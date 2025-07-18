'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import { useNotificationContext } from '../contexts/NotificationContext'
import Link from 'next/link'
import { CheckCircleIcon, XCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { showSuccess, showError } = useNotificationContext()
  
  const [isVerifying, setIsVerifying] = useState(true)
  const [verificationStatus, setVerificationStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isResending, setIsResending] = useState(false)
  
  const email = searchParams.get('email')
  const code = searchParams.get('code')

  useEffect(() => {
    if (!email || !code) {
      setVerificationStatus('error')
      setErrorMessage('Invalid verification link. Please check your email and try again.')
      setIsVerifying(false)
      return
    }

    const verifyEmailAsync = async () => {
      try {
        setIsVerifying(true)
        
        // Fazer chamada para a API de verificação
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            code
          })
        })

        const data = await response.json()

        if (response.ok) {
          setVerificationStatus('success')
          showSuccess('Email Verified', 'Your email has been successfully verified! You can now log in.')
          
          // Redirecionar para login após 3 segundos
          setTimeout(() => {
            router.push('/')
          }, 3000)
        } else {
          setVerificationStatus('error')
          setErrorMessage(data.message || 'Failed to verify email. Please try again.')
          showError('Verification Failed', data.message || 'Failed to verify email. Please try again.')
        }
      } catch (error) {
        console.error('Email verification error:', error)
        setVerificationStatus('error')
        setErrorMessage('An error occurred while verifying your email. Please try again.')
        showError('Verification Error', 'An error occurred while verifying your email. Please try again.')
      } finally {
        setIsVerifying(false)
      }
    }

    verifyEmailAsync()
  }, [email, code, router, showSuccess, showError])

  const resendVerification = async () => {
    if (!email) return
    
    try {
      setIsResending(true)
      
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (response.ok) {
        showSuccess('Verification Sent', 'A new verification email has been sent to your email address.')
      } else {
        showError('Resend Failed', data.message || 'Failed to resend verification email.')
      }
    } catch (error) {
      console.error('Resend verification error:', error)
      showError('Resend Error', 'An error occurred while resending the verification email.')
    } finally {
      setIsResending(false)
    }
  }

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-900">Verifying your email...</h2>
              <p className="mt-2 text-sm text-gray-600">Please wait while we verify your email address.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (verificationStatus === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900">Email Verified Successfully!</h2>
              <p className="mt-2 text-sm text-gray-600">
                Your email has been verified. You can start adding your setups now.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (verificationStatus === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <XCircleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900">Verification Failed</h2>
              <p className="mt-2 text-sm text-gray-600">
                {errorMessage || 'There was an error verifying your email address.'}
              </p>
              <div className="mt-6 space-y-3">
                {email && (
                  <button
                    onClick={resendVerification}
                    disabled={isResending}
                    className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isResending ? (
                      <>
                        <ArrowPathIcon className="h-4 w-4 animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      'Resend Verification Email'
                    )}
                  </button>
                )}
                <Link
                  href="/register"
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Back to Registration
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900">Email Verification</h2>
            <p className="mt-2 text-sm text-gray-600">
              Please check your email for the verification link.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-900">Loading...</h2>
            </div>
          </div>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}
