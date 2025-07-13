'use client'

import { useCurrentUser } from '@/app/hooks/useCurrentUser'
import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'
import FloatingInput from '@/app/ui/components/FloatingInput'
import ImageUpload from '@/app/ui/components/ImageUpload'
import { registerValidation, getFieldError } from '@/app/utils/profileValidation'
import { updateUserProfile, getProfileByName } from '@/app/service/profile'
import { uploadImageToCloudinary } from '@/app/utils/cloudinaryUpload'
import { useNotificationContext } from '@/app/contexts/NotificationContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SocialIcon } from 'react-social-icons'
import { User } from 'next-auth'

type EditProfileForm = {
  nickname: string
  email: string
  telephone?: string
  website?: string
  instagram?: string
  youtube?: string
  x?: string
  profileImage?: string
}

export default function EditProfile() {
  const { user: sessionUser, accessToken, isLoading: userLoading } = useCurrentUser()
  const router = useRouter()
  const { showSuccess, showError } = useNotificationContext()
  
  const [user, setUser] = useState<User | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    reset,
    formState: { errors },
  } = useForm<EditProfileForm>({ 
    mode: 'onChange',
    reValidateMode: 'onChange'
  })

  const [isLoading, setIsLoading] = useState(false)
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const [submitError, setSubmitError] = useState<string>('')
  
  const profileImage = watch('profileImage')

  // Buscar dados completos do usuário
  useEffect(() => {
    async function fetchUserProfile() {
      if (!sessionUser?.name || !accessToken) return
      
      try {
        const profileData = await getProfileByName(accessToken, sessionUser.name)
        setUser(profileData)
        
        // Popular o formulário com os dados do usuário
        reset({
          nickname: profileData?.nickname || '',
          email: profileData?.email || '',
          telephone: profileData?.telephone || '',
          website: profileData?.website || '',
          instagram: profileData?.instagram || '',
          youtube: profileData?.youtube || '',
          x: profileData?.x || '',
          profileImage: profileData?.profileImage || ''
        })
      } catch (error) {
        console.error('Error fetching user profile:', error)
        showError('Error', 'Failed to load profile data')
      } finally {
        setIsLoadingProfile(false)
      }
    }

    fetchUserProfile()
  }, [sessionUser, accessToken, reset, showError])

  const handleImageSelect = (file: File | null) => {
    setSelectedImageFile(file)
    if (file) {
      setValue('profileImage', '')
    }
  }

  async function onSubmit(data: EditProfileForm) {
    if (!accessToken || !user?._id) {
      showError('Authentication Error', 'You must be logged in to edit your profile')
      return
    }

    setIsLoading(true)
    setSubmitError('')

    try {
      const updateData = { ...data }

      // Upload da imagem se houver
      if (selectedImageFile) {
        try {
          const imageUrl = await uploadImageToCloudinary(selectedImageFile)
          updateData.profileImage = imageUrl
        } catch (imageError) {
          console.error('Image upload error:', imageError)
          showError('Image Upload Failed', 'Failed to upload image. Profile will be updated without image changes.')
        }
      }

      // Atualizar perfil
      await updateUserProfile(accessToken, user._id, updateData)
      
      showSuccess('Profile Updated', 'Your profile has been updated successfully!')
      
      // Redirecionar para o perfil
      router.push(`/profile/${user.name}`)
      
    } catch (err) {
      console.error('Profile update error:', err)
      
      let errorMessage = 'An error occurred while updating your profile. Please try again.'
      if (err instanceof Error) {
        errorMessage = err.message
      }
      
      setSubmitError(errorMessage)
      showError('Update Failed', errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  if (userLoading || isLoadingProfile) {
    return (
      <div className="mx-auto overflow-auto max-w-7xl mt-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-center">Loading...</p>
        </div>
      </div>
    )
  }

  if (!sessionUser || !user) {
    return (
      <div className="mx-auto overflow-auto max-w-7xl mt-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-center text-red-600">You must be logged in to edit your profile.</p>
          <div className="text-center mt-4">
            <Link href="/" className="text-rose-600 hover:text-rose-500">
              Go back to home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto overflow-auto max-w-7xl mt-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base/7 font-semibold text-gray-900">Edit Profile</h2>
              <p className="mt-1 text-sm/6 text-gray-600">
                Update your profile information. This information will be displayed publicly.
              </p>

              <div className='mt-5 h-0.5 w-full bg-gray-200' />

              <div className="p-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <FloatingInput 
                    id='nickname' 
                    label='Nickname' 
                    register={register('nickname', registerValidation.nickname)}
                    onPaste={() => {
                      setTimeout(() => {
                        trigger('nickname')
                      }, 0)
                    }}
                  />
                  {getFieldError(errors, 'nickname') && (
                    <p className="mt-2 text-sm text-red-600">{getFieldError(errors, 'nickname')}</p>
                  )}
                </div>

                <div className="sm:col-span-4">
                  <FloatingInput 
                    id='email' 
                    label='Email' 
                    register={register('email', registerValidation.email)} 
                    type="email"
                    onPaste={() => {
                      setTimeout(() => {
                        trigger('email')
                      }, 0)
                    }}
                  />
                  {getFieldError(errors, 'email') && (
                    <p className="mt-2 text-sm text-red-600">{getFieldError(errors, 'email')}</p>
                  )}
                </div>

                <div className="sm:col-span-4">
                  <FloatingInput 
                    id='telephone'  
                    label='Telephone (Optional)' 
                    register={register('telephone', registerValidation.telephone)} 
                    type="tel"
                    onPaste={() => {
                      setTimeout(() => {
                        trigger('telephone')
                      }, 0)
                    }}
                  />
                  {getFieldError(errors, 'telephone') && (
                    <p className="mt-2 text-sm text-red-600">{getFieldError(errors, 'telephone')}</p>
                  )}
                </div>

                <div className="sm:col-span-4">
                  <FloatingInput 
                    id='website' 
                    label='Website (Optional)' 
                    register={register('website', registerValidation.website)}
                    placeholder="www.example.com"
                    prefix="https://"
                    onPaste={() => {
                      setTimeout(() => {
                        trigger('website')
                      }, 0)
                    }}
                  />
                  {getFieldError(errors, 'website') && (
                    <p className="mt-2 text-sm text-red-600">{getFieldError(errors, 'website')}</p>
                  )}
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="instagram" className="block text-sm/6 font-medium text-gray-900">
                    Instagram (Optional)
                  </label>
                  <div className="mt-2">
                    <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-rose-600">
                      <div tabIndex={-1} className="flex shrink-0 mr-2 items-center rounded-l-md bg-white px-3 text-base text-gray-500  outline-gray-300 sm:text-sm/6">
                        <SocialIcon tabIndex={-1} style={{ height: 27, width: 27 }} url='https://www.instagram.com' />
                      </div>
                      <input
                        {...register('instagram', registerValidation.instagram)}
                        type="text"
                        placeholder="www.instagram.com/profile"
                        className="-ml-px block w-full grow rounded-r-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-rose-600 sm:text-sm/6"
                        onPaste={() => {
                          setTimeout(() => {
                            trigger('instagram')
                          }, 0)
                        }}
                      />
                    </div>
                  </div>
                  {getFieldError(errors, 'instagram') && (
                    <p className="mt-2 text-sm text-red-600">{getFieldError(errors, 'instagram')}</p>
                  )}
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="youtube" className="block text-sm/6 font-medium text-gray-900">
                    Youtube (Optional)
                  </label>
                  <div className="mt-2">
                    <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-rose-600">
                      <div tabIndex={-1} className="flex shrink-0 mr-2 items-center rounded-l-md bg-white px-3 text-base text-gray-500  outline-gray-300 sm:text-sm/6">
                        <SocialIcon tabIndex={-1} style={{ height: 27, width: 27 }} url='https://www.youtube.com' />
                      </div>
                      <input
                        {...register('youtube', registerValidation.youtube)}
                        type="text"
                        placeholder="www.youtube.com/yourchanel"
                        className="-ml-px block w-full grow rounded-r-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-rose-600 sm:text-sm/6"
                        onPaste={() => {
                          setTimeout(() => {
                            trigger('youtube')
                          }, 0)
                        }}
                      />
                    </div>
                  </div>
                  {getFieldError(errors, 'youtube') && (
                    <p className="mt-2 text-sm text-red-600">{getFieldError(errors, 'youtube')}</p>
                  )}
                </div>

                <div className="sm:col-span-4">
                  <label htmlFor="x" className="block text-sm/6 font-medium text-gray-900">
                    X (Optional)
                  </label>
                  <div className="mt-2">
                    <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-rose-600">
                      <div tabIndex={-1} className="flex shrink-0 mr-2 items-center rounded-l-md bg-white px-3 text-base text-gray-500  outline-gray-300 sm:text-sm/6">
                        <SocialIcon tabIndex={-1} style={{ height: 27, width: 27 }} url='https://www.x.com' />
                      </div>
                      <input
                        {...register('x', registerValidation.x)}
                        type="text"
                        placeholder="www.x.com/yourprofile"
                        className="-ml-px block w-full grow rounded-r-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-rose-600 sm:text-sm/6"
                        onPaste={() => {
                          setTimeout(() => {
                            trigger('x')
                          }, 0)
                        }}
                      />
                    </div>
                  </div>
                  {getFieldError(errors, 'x') && (
                    <p className="mt-2 text-sm text-red-600">{getFieldError(errors, 'x')}</p>
                  )}
                </div>

                <ImageUpload
                  onImageSelect={handleImageSelect}
                  currentImage={profileImage}
                  label="Profile Photo"
                  size="lg"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 mb-6 flex items-center justify-end gap-x-6">
            {submitError && (
              <div className="mr-auto">
                <p className="text-sm text-red-600">{submitError}</p>
              </div>
            )}
            <Link href={`/profile/${user.name}`} className="text-sm/6 font-semibold text-gray-900">
              Cancel
            </Link>
            <button
              disabled={isLoading}
              type="submit"
              className={`cursor-pointer rounded-md transition-all duration-300 px-3 py-2 text-sm font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-rose-600 hover:bg-rose-500'
              }`}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}