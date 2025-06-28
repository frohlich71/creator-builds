'use client'

import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import Image from 'next/image'

type LoginForm = {
  username: string
  password: string
}
export default function LoginDrawer({open, setOpen} : {open: boolean, setOpen: (open: boolean) => void}) {
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<LoginForm>()

  async function onSubmit(data: LoginForm) {
    // Limpar erros anteriores
    setLoginError(null)
    clearErrors()
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        username: data.username,
        password: data.password,
        redirect: false
      })

      // Verificação corrigida: só considera sucesso se não há erro E se está ok
      if (result?.error) {
        // Tratar diferentes tipos de erro
        if (result.error === 'CredentialsSignin') {
          setLoginError('Invalid username or password')
        } else {
          setLoginError('Internal server error')
        }
      } else if (result?.ok && !result?.error) {
        // Só considera sucesso se está ok E não tem erro
        setOpen(false)
        // Recarregar a página para atualizar o estado de autenticação
        window.location.reload()
      } else {
        // Caso inesperado - nem erro nem sucesso
        setLoginError('Unexpected server response')
      }
    } catch (error) {
      console.error('Login error:', error)
      setLoginError('Connection error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <DialogPanel
                transition
                className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700"
              >
                <div className="flex h-full flex-col overflow-y-auto bg-white shadow-xl">
                  <div className="bg-rose-900 px-4 py-6 sm:px-6">
                    <div className="flex items-center justify-between">
                      <DialogTitle className="text-base cursor-default font-semibold text-white">
                        Sign in
                      </DialogTitle>
                      <div className="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          onClick={() => setOpen(false)}
                          className="relative cursor-pointer rounded-md bg-rose-900 text-white hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-hidden"
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon aria-hidden="true" className="size-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="relative flex-1 px-4 py-6 sm:px-6">

                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                      <Image
                        alt="Your Company"
                        src="/favicon.ico"
                        width={40}
                        height={40}
                        className="mx-auto h-10 w-auto"
                      />
                      
                    </div>

                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div>
                          <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
                            Username
                          </label>
                          <div className="mt-2">
                            <input
                              id="username"
                              type="text"
                              autoComplete="username"
                              {...register('username', { 
                                required: 'Username is required',
                                minLength: {
                                  value: 3,
                                  message: 'Username must be at least 3 characters'
                                },
                                pattern: {
                                  value: /^[a-zA-Z0-9_-]+$/,
                                  message: 'Username can only contain letters, numbers, _ and -'
                                }
                              })}
                              className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 ${
                                errors.username ? 'outline-red-500' : 'outline-gray-300'
                              } placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-rose-600 sm:text-sm/6`}
                            />
                            {errors.username && (
                              <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
                            )}
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between">
                            <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                              Password
                            </label>
                            {/* <div className="text-sm">
                              <a
                                href="#"
                                className="font-sans transition-all duration-300 text-rose-800 hover:text-rose-400"
                              >
                                Forgot password?
                              </a>
                            </div> */}
                          </div>
                          <div className="mt-2">
                            <input
                              id="password"
                              type="password"
                              autoComplete="current-password"
                              {...register('password', { 
                                required: 'Password is required',
                                minLength: {
                                  value: 4,
                                  message: 'Password must be at least 4 characters'
                                }
                              })}
                              className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 ${
                                errors.password ? 'outline-red-500' : 'outline-gray-300'
                              } placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-red-600 sm:text-sm/6`}
                            />
                            {errors.password && (
                              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                            )}
                          </div>
                        </div>

                        {/* Erro geral de login */}
                        {loginError && (
                          <div className="rounded-md bg-red-50 p-4">
                            <div className="flex">
                              <div className="shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-red-800">{loginError}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        <div>
                          <button
                            type="submit"
                            disabled={isLoading}
                            className={`flex w-full cursor-pointer transition-all duration-300 justify-center rounded-md px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 ${
                              isLoading 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-rose-900 hover:bg-rose-600'
                            }`}
                          >
                            {isLoading ? (
                              <div className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing in...
                              </div>
                            ) : (
                              'Sign in'
                            )}
                          </button>
                        </div>
                      </form>

                      <p className="mt-10 text-center text-sm/6 text-gray-500">
                        Not a member?{' '}
                        <a href="/register" className="font-semibold transition-all duration-300 text-rose-800 hover:text-rose-500">
                          Register now
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
