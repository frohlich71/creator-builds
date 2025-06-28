import { useSession } from 'next-auth/react'

export function useCurrentUser() {
  const { data: session, status } = useSession()
  
  return {
    user: session?.user || null,
    accessToken: session?.accessToken || null,
    refreshToken: session?.refreshToken || null,
    isLoading: status === 'loading',
    isAuthenticated: !!session?.accessToken,
    isUnauthenticated: status === 'unauthenticated',
    
    // Dados específicos do usuário
    name: session?.user?.name || null,
    email: session?.user?.email || null,
    image: session?.user?.image || null,
  }
}
