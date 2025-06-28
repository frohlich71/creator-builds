// Este arquivo agora é obsoleto para componentes cliente - use useProfileService.ts
// Mantido apenas para compatibilidade com código servidor (como em pages)

import { RegisterForm } from "@/types/register-form"
import { createServerApi } from "../lib/serverApi"

export async function getProfileByName(token: string, name: string) {
  if (token === '') {
    return null
  }

  const api = createServerApi(token)
  const res = await api.get(`/user/name/${name}`)
  
  return res.data
}

export async function createUser(data: RegisterForm) {
  try {
    const api = createServerApi()
    const res = await api.post('/user', data)
    return res.data
  } catch (error: unknown) {
    // Se for erro 409 (conflito), retornar a mensagem específica do backend
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response: { status: number; data?: { message?: string } } }
      if (axiosError.response?.status === 409) {
        throw new Error(axiosError.response.data?.message || 'User already exists')
      }
      // Para outros erros, lançar uma mensagem genérica
      throw new Error(axiosError.response.data?.message || 'Failed to create user')
    }
    throw new Error('Failed to create user')
  }
}

export async function updateUserProfile(token: string, userId: string, data: Partial<RegisterForm>) {
  try {
    const api = createServerApi(token)
    const res = await api.put(`/user/${userId}`, data)
    return res.data
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response: { status: number; data?: { message?: string } } }
      throw new Error(axiosError.response.data?.message || 'Failed to update profile')
    }
    throw new Error('Failed to update profile')
  }
}