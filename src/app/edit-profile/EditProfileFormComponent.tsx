'use client'

import { useForm } from 'react-hook-form'
import { useState } from 'react'
import FloatingInput from '@/app/ui/components/FloatingInput'
import FloatingPhoneInput from '@/app/ui/components/FloatingPhoneInput'
import ImageUpload from '@/app/ui/components/ImageUpload'
import { registerValidation, getFieldError } from '@/app/utils/profileValidation'
import { updateUserProfile } from '@/app/service/profile'
import { uploadImageToCloudinary } from '@/app/utils/cloudinaryUpload'
import { useNotificationContext } from '@/app/contexts/NotificationContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SocialIcon } from 'react-social-icons'
import { User } from 'next-auth'
import { signOut } from 'next-auth/react'

type EditProfileForm = {
  name: string
  nickname: string
  email: string
  telephone?: string
  website?: string
  instagram?: string
  youtube?: string
  x?: string
  tiktok?: string
  snapchat?: string
  facebook?: string
  linkedin?: string
  pinterest?: string
  twitch?: string
  profileImage?: string
}

interface EditProfileFormProps {
  user: User
  accessToken: string
}

export default function EditProfileFormComponent({ user, accessToken }: EditProfileFormProps) {
  const router = useRouter()
  const { showSuccess, showError } = useNotificationContext()
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<EditProfileForm>({ 
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: user?.name || '',
      nickname: user?.nickname || '',
      email: user?.email || '',
      telephone: user?.telephone || '',
      website: user?.website || '',
      instagram: user?.instagram || '',
      youtube: user?.youtube || '',
      x: user?.x || '',
      tiktok: user?.tiktok || '',
      snapchat: user?.snapchat || '',
      facebook: user?.facebook || '',
      linkedin: user?.linkedin || '',
      pinterest: user?.pinterest || '',
      twitch: user?.twitch || '',
      profileImage: user?.profileImage || ''
    }
  })

  const [isLoading, setIsLoading] = useState(false)
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const [submitError, setSubmitError] = useState<string>('')
  
  const profileImage = watch('profileImage')

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
      const originalName = user.name
      const nameChanged = originalName !== data.name

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
      
      // Se o username foi alterado, fazer logout para forçar nova autenticação
      if (nameChanged) {
        showSuccess('Username Changed', 'Your username has been changed. You will be logged out to update your session.')
        
        // Aguardar um pouco para o usuário ver a mensagem
        setTimeout(async () => {
          await signOut({ 
            callbackUrl: '/',
            redirect: true 
          })
        }, 2000)
      } else {
        // Redirecionar para o perfil apenas se o username não foi alterado
        router.push(`/profile/${user.name}`)
      }
      
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

  return (
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
                id='name' 
                label='Username' 
                register={register('name', registerValidation.name)}
                onPaste={() => {
                  setTimeout(() => {
                    trigger('name')
                  }, 0)
                }}
              />
              {getFieldError(errors, 'name') && (
                <p className="mt-2 text-sm text-red-600">{getFieldError(errors, 'name')}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                <i>Changing your username will log you out to update your session</i>
              </p>
            </div>

            <div className="sm:col-span-4">
              <FloatingInput 
                id='nickname' 
                label='Name' 
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
              <FloatingPhoneInput
                id='telephone'
                label='Phone Number'
                register={register('telephone', registerValidation.telephone)}
                defaultValue={user?.telephone || ''}
              />
              {getFieldError(errors, 'telephone') && (
                <p className="mt-2 text-sm text-red-600">{getFieldError(errors, 'telephone')}</p>
              )}
            </div>

            <div className="sm:col-span-4">
              <FloatingInput 
                id='website' 
                label='Website' 
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

            {/* Social Media Section - 2 columns layout */}
            <div className="sm:col-span-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Social Media</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                <div>
                  <label htmlFor="instagram" className="block text-sm/6 font-medium text-gray-900">
                    Instagram
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
                      />
                    </div>
                  </div>
                  {getFieldError(errors, 'instagram') && (
                    <p className="mt-2 text-sm text-red-600">{getFieldError(errors, 'instagram')}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="youtube" className="block text-sm/6 font-medium text-gray-900">
                    YouTube
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
                      />
                    </div>
                  </div>
                  {getFieldError(errors, 'youtube') && (
                    <p className="mt-2 text-sm text-red-600">{getFieldError(errors, 'youtube')}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="x" className="block text-sm/6 font-medium text-gray-900">
                    X (Twitter)
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
                      />
                    </div>
                  </div>
                  {getFieldError(errors, 'x') && (
                    <p className="mt-2 text-sm text-red-600">{getFieldError(errors, 'x')}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="tiktok" className="block text-sm/6 font-medium text-gray-900">
                    TikTok
                  </label>
                  <div className="mt-2">
                    <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-rose-600">
                      <div tabIndex={-1} className="flex shrink-0 mr-2 items-center rounded-l-md bg-white px-3 text-base text-gray-500  outline-gray-300 sm:text-sm/6">
                        <SocialIcon tabIndex={-1} style={{ height: 27, width: 27 }} url='https://www.tiktok.com' />
                      </div>
                      <input
                        {...register('tiktok', registerValidation.tiktok)}
                        type="text"
                        placeholder="www.tiktok.com/@yourprofile"
                        className="-ml-px block w-full grow rounded-r-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-rose-600 sm:text-sm/6"
                      />
                    </div>
                  </div>
                  {getFieldError(errors, 'tiktok') && (
                    <p className="mt-2 text-sm text-red-600">{getFieldError(errors, 'tiktok')}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="snapchat" className="block text-sm/6 font-medium text-gray-900">
                    Snapchat
                  </label>
                  <div className="mt-2">
                    <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-rose-600">
                      <div tabIndex={-1} className="flex shrink-0 mr-2 items-center rounded-l-md bg-white px-3 text-base text-gray-500  outline-gray-300 sm:text-sm/6">
                        <SocialIcon tabIndex={-1} style={{ height: 27, width: 27 }} url='https://www.snapchat.com' />
                      </div>
                      <input
                        {...register('snapchat', registerValidation.snapchat)}
                        type="text"
                        placeholder="www.snapchat.com/add/yourprofile"
                        className="-ml-px block w-full grow rounded-r-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-rose-600 sm:text-sm/6"
                      />
                    </div>
                  </div>
                  {getFieldError(errors, 'snapchat') && (
                    <p className="mt-2 text-sm text-red-600">{getFieldError(errors, 'snapchat')}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="facebook" className="block text-sm/6 font-medium text-gray-900">
                    Facebook
                  </label>
                  <div className="mt-2">
                    <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-rose-600">
                      <div tabIndex={-1} className="flex shrink-0 mr-2 items-center rounded-l-md bg-white px-3 text-base text-gray-500  outline-gray-300 sm:text-sm/6">
                        <SocialIcon tabIndex={-1} style={{ height: 27, width: 27 }} url='https://www.facebook.com' />
                      </div>
                      <input
                        {...register('facebook', registerValidation.facebook)}
                        type="text"
                        placeholder="www.facebook.com/yourprofile"
                        className="-ml-px block w-full grow rounded-r-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-rose-600 sm:text-sm/6"
                      />
                    </div>
                  </div>
                  {getFieldError(errors, 'facebook') && (
                    <p className="mt-2 text-sm text-red-600">{getFieldError(errors, 'facebook')}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="linkedin" className="block text-sm/6 font-medium text-gray-900">
                    LinkedIn
                  </label>
                  <div className="mt-2">
                    <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-rose-600">
                      <div tabIndex={-1} className="flex shrink-0 mr-2 items-center rounded-l-md bg-white px-3 text-base text-gray-500  outline-gray-300 sm:text-sm/6">
                        <SocialIcon tabIndex={-1} style={{ height: 27, width: 27 }} url='https://www.linkedin.com' />
                      </div>
                      <input
                        {...register('linkedin', registerValidation.linkedin)}
                        type="text"
                        placeholder="www.linkedin.com/in/yourprofile"
                        className="-ml-px block w-full grow rounded-r-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-rose-600 sm:text-sm/6"
                      />
                    </div>
                  </div>
                  {getFieldError(errors, 'linkedin') && (
                    <p className="mt-2 text-sm text-red-600">{getFieldError(errors, 'linkedin')}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="pinterest" className="block text-sm/6 font-medium text-gray-900">
                    Pinterest
                  </label>
                  <div className="mt-2">
                    <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-rose-600">
                      <div tabIndex={-1} className="flex shrink-0 mr-2 items-center rounded-l-md bg-white px-3 text-base text-gray-500  outline-gray-300 sm:text-sm/6">
                        <SocialIcon tabIndex={-1} style={{ height: 27, width: 27 }} url='https://www.pinterest.com' />
                      </div>
                      <input
                        {...register('pinterest', registerValidation.pinterest)}
                        type="text"
                        placeholder="www.pinterest.com/yourprofile"
                        className="-ml-px block w-full grow rounded-r-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-rose-600 sm:text-sm/6"
                      />
                    </div>
                  </div>
                  {getFieldError(errors, 'pinterest') && (
                    <p className="mt-2 text-sm text-red-600">{getFieldError(errors, 'pinterest')}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="twitch" className="block text-sm/6 font-medium text-gray-900">
                    Twitch
                  </label>
                  <div className="mt-2">
                    <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-rose-600">
                      <div tabIndex={-1} className="flex shrink-0 mr-2 items-center rounded-l-md bg-white px-3 text-base text-gray-500  outline-gray-300 sm:text-sm/6">
                        <SocialIcon tabIndex={-1} style={{ height: 27, width: 27 }} url='https://www.twitch.tv' />
                      </div>
                      <input
                        {...register('twitch', registerValidation.twitch)}
                        type="text"
                        placeholder="www.twitch.tv/yourprofile"
                        className="-ml-px block w-full grow rounded-r-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-rose-600 sm:text-sm/6"
                      />
                    </div>
                  </div>
                  {getFieldError(errors, 'twitch') && (
                    <p className="mt-2 text-sm text-red-600">{getFieldError(errors, 'twitch')}</p>
                  )}
                </div>
              </div>
            </div>

            <ImageUpload
              onImageSelect={handleImageSelect}
              currentImage={profileImage}
              label="Profile Picture"
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
  )
}
