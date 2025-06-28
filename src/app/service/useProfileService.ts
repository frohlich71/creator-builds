import { useAuthenticatedApi } from '../hooks/useAuthenticatedApi'
import { RegisterForm } from "@/types/register-form"
import { createServerApi } from "../lib/serverApi"

export function useProfileService() {
  const { api } = useAuthenticatedApi()
  
  return {
    getProfileByName: async (name: string) => {
      if (!api) throw new Error('API não autenticada')
      const res = await api.get(`/user/name/${name}`)
      return res.data
    },
    
    searchUsers: async (query: string) => {
      if (!query || query.length < 2) return []
      
      // Para busca de usuários, usamos a API local que não requer autenticação
      try {
        const response = await fetch(`/api/user/search?q=${encodeURIComponent(query)}`)
        if (!response.ok) {
          throw new Error('Erro na busca de usuários')
        }
        return await response.json()
      } catch (error) {
        console.error('Erro ao buscar usuários:', error)
        return []
      }
    }
  }
}

// Mantido para registro de usuário (não precisa de autenticação)
export async function createUser(data: RegisterForm) {
  const api = createServerApi()
  const res = await api.post('/user', data)

  return res.data
}
