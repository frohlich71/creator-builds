'use client'

import { RegisterForm } from '@/types/register-form'
import { useForm } from 'react-hook-form'
import { SocialIcon } from 'react-social-icons'
import { createUser, updateUserProfile } from '../service/profile'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useState } from 'react'
import FloatingInput from '../ui/components/FloatingInput'
import ImageUpload from '../ui/components/ImageUpload'
import { uploadImageToCloudinary } from '../utils/cloudinaryUpload'
import { registerValidation, getFieldError, hasFormErrors } from '../utils/profileValidation'
import { useNotificationContext } from '../contexts/NotificationContext'
import { getSession } from 'next-auth/react'

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({ mode: 'onChange' })

  const [isLoading, setIsLoading] = useState(false)
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const [submitError, setSubmitError] = useState<string>('')
  const { showError } = useNotificationContext()

  const profileImage = watch('profileImage')

  const handleImageSelect = (file: File | null) => {
    setSelectedImageFile(file)
    // Limpar URL existente quando selecionar novo arquivo
    if (file) {
      setValue('profileImage', '')
    }
  }

  async function onSubmit(data: RegisterForm) {
    if (hasFormErrors(errors)) {
      setSubmitError('Please fix the form errors before submitting')
      showError('Form Validation Error', 'Please fix the form errors before submitting')
      return
    }

    NProgress.start()
    setIsLoading(true)
    setSubmitError('')

    try {
      // Primeiro, tentar criar o usuário sem a imagem
      const res = await createUser(data)
      
      if (!res) {
        const errorMessage = 'Failed to create user. Please check your data and try again.'
        setSubmitError(errorMessage)
        showError('Registration Failed', errorMessage)
        return
      }

      // Login do usuário após registro bem-sucedido
      const signInResult = await signIn('credentials', {
        username: data.name,
        password: data.password,
        redirect: false,
      })

      if (signInResult?.error) {
        const errorMessage = 'Registration successful, but login failed. Please try signing in manually.'
        setSubmitError(errorMessage)
        showError('Login Failed', errorMessage)
        return
      }

      // Após login bem-sucedido, fazer upload da imagem se houver
      if (selectedImageFile && signInResult?.ok) {
        try {
          const imageUrl = await uploadImageToCloudinary(selectedImageFile)
          
          // Obter a sessão para pegar o token
          const session = await getSession()
          if (session?.accessToken && res._id) {
            await updateUserProfile(session.accessToken as string, res._id, { 
              profileImage: imageUrl 
            })
          }
        } catch (imageError) {
          console.error('Image upload/update error:', imageError)
          // Continuar mesmo se o upload da imagem falhar
          // O usuário já foi criado e logado com sucesso
        }
      }

      // Redirecionar com notificação de sucesso via URL
      const successMessage = encodeURIComponent('Registration successful! Welcome to the platform.')
      const redirectUrl = `/profile/${data.name}?notification=success&message=${successMessage}`
      window.location.href = redirectUrl
      
    } catch (err) {
      console.error('Registration error:', err)
      
      // Se for uma instância de Error com mensagem específica, usar essa mensagem
      let errorMessage = 'An error occurred during registration. Please try again.'
      if (err instanceof Error) {
        errorMessage = err.message
      }
      
      setSubmitError(errorMessage)
      showError('Registration Error', errorMessage)
    } finally {
      NProgress.done()
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto overflow-auto max-w-7xl mt-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base/7 font-semibold text-gray-900">Profile</h2>
              <p className="mt-1 text-sm/6 text-gray-600">
                This information will be displayed publicly so be careful what you share.
              </p>

              <div className='mt-5 h-0.5 w-full bg-gray-200' />

              <div className="p-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <FloatingInput 
                    id='name' 
                    label='Username' 
                    register={register('name', registerValidation.name)} 
                  />
                  {getFieldError(errors, 'name') && (
                    <p className="mt-2 text-sm text-red-600">{getFieldError(errors, 'name')}</p>
                  )}
                </div>

                <div className="sm:col-span-4">
                  <FloatingInput 
                    id='nickname' 
                    label='Name' 
                    register={register('nickname', registerValidation.nickname)} 
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
                  />
                  {getFieldError(errors, 'email') && (
                    <p className="mt-2 text-sm text-red-600">{getFieldError(errors, 'email')}</p>
                  )}
                </div>

                <div className="sm:col-span-4">
                  <FloatingInput 
                    id='telephone'  
                    label='Telephone' 
                    register={register('telephone', registerValidation.telephone)} 
                    type="tel" 
                  />
                  {getFieldError(errors, 'telephone') && (
                    <p className="mt-2 text-sm text-red-600">{getFieldError(errors, 'telephone')}</p>
                  )}
                </div>

                <div className="sm:col-span-4">
                  <FloatingInput 
                    id='password' 
                    label='Password' 
                    register={register('password', registerValidation.password)} 
                    type="password" 
                  />
                  {getFieldError(errors, 'password') && (
                    <p className="mt-2 text-sm text-red-600">{getFieldError(errors, 'password')}</p>
                  )}
                </div>

                <div className="sm:col-span-4">
                  <FloatingInput 
                    id='website' 
                    label='Website' 
                    register={register('website', registerValidation.website)} 
                    placeholder="www.example.com" 
                    prefix="https://" 
                  />
                  {getFieldError(errors, 'website') && (
                    <p className="mt-2 text-sm text-red-600">{getFieldError(errors, 'website')}</p>
                  )}
                </div>

                <div className="sm:col-span-4">
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

                <div className="sm:col-span-4">
                  <label htmlFor="youtube" className="block text-sm/6 font-medium text-gray-900">
                    Youtube
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

                <div className="sm:col-span-4">
                  <label htmlFor="x" className="block text-sm/6 font-medium text-gray-900">
                    X
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
            <Link href='/' className="text-sm/6 font-semibold text-gray-900">
              Back
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
              {isLoading ? 'Creating Account...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>

  )
}