'use client'

import { useForm } from 'react-hook-form'
import { useState } from 'react'
import FloatingInput from '@/app/ui/components/FloatingInput'
import { registerValidation, getFieldError } from '@/app/utils/profileValidation'
import { useNotificationContext } from '@/app/contexts/NotificationContext'
import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { updatePassword } from '@/app/service/profile'

type UpdatePasswordForm = {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface UpdatePasswordFormProps {
  accessToken: string
}

export default function UpdatePasswordForm({ accessToken }: UpdatePasswordFormProps) {
  const { data: session } = useSession()
  const { showSuccess, showError } = useNotificationContext()
  
  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<UpdatePasswordForm>({ 
    mode: 'onChange',
    reValidateMode: 'onChange'
  })

  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string>('')
  
  const newPassword = watch('newPassword')

  async function onSubmit(data: UpdatePasswordForm) {
    if (data.newPassword !== data.confirmPassword) {
      setSubmitError('New passwords do not match')
      return
    }

    setIsLoading(true)
    setSubmitError('')

    try {
      await updatePassword(accessToken, data.currentPassword, data.newPassword)

      showSuccess('Password Updated', 'Your password has been updated successfully! You will be logged out for security.')
      
      // Logout após alteração da senha por segurança
      setTimeout(async () => {
        await signOut({ 
          callbackUrl: '/',
          redirect: true 
        })
      }, 2000)
      
    } catch (err) {
      console.error('Password update error:', err)
      
      let errorMessage = 'An error occurred while updating your password. Please try again.'
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
          <h2 className="text-base/7 font-semibold text-gray-900">Update Password</h2>
          <p className="mt-1 text-sm/6 text-gray-600">
            Change your password. You will be logged out after updating for security reasons.
          </p>

          <div className='mt-5 h-0.5 w-full bg-gray-200' />

          <div className="p-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <FloatingInput 
                id='currentPassword' 
                label='Current Password' 
                type="password"
                register={register('currentPassword', { required: 'Current password is required' })}
                onPaste={() => {
                  setTimeout(() => {
                    trigger('currentPassword')
                  }, 0)
                }}
              />
              {getFieldError(errors, 'currentPassword') && (
                <p className="mt-2 text-sm text-red-600">{getFieldError(errors, 'currentPassword')}</p>
              )}
            </div>

            <div className="sm:col-span-4">
              <FloatingInput 
                id='newPassword' 
                label='New Password' 
                type="password"
                register={register('newPassword', registerValidation.password)}
                onPaste={() => {
                  setTimeout(() => {
                    trigger('newPassword')
                  }, 0)
                }}
              />
              {getFieldError(errors, 'newPassword') && (
                <p className="mt-2 text-sm text-red-600">{getFieldError(errors, 'newPassword')}</p>
              )}
            </div>

            <div className="sm:col-span-4">
              <FloatingInput 
                id='confirmPassword' 
                label='Confirm New Password' 
                type="password"
                register={register('confirmPassword', {
                  required: 'Please confirm your new password',
                  validate: (value) => value === newPassword || 'Passwords do not match'
                })}
                onPaste={() => {
                  setTimeout(() => {
                    trigger('confirmPassword')
                  }, 0)
                }}
              />
              {getFieldError(errors, 'confirmPassword') && (
                <p className="mt-2 text-sm text-red-600">{getFieldError(errors, 'confirmPassword')}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 mb-6 flex items-center justify-end gap-x-6">
        {submitError && (
          <div className="mr-auto">
            <p className="text-sm text-red-600">{submitError}</p>
          </div>
        )}
        <Link 
          href={`/profile/${session?.user?.name}`}
          className="cursor-pointer transition-all duration-300 hover:text-gray-600 text-sm/6 font-semibold text-gray-900"
        >
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
          {isLoading ? 'Updating...' : 'Update Password'}
        </button>
      </div>
    </form>
  )
}
