import { useSession } from 'next-auth/react'
import { createServerApi } from '../lib/serverApi'
import { useMemo } from 'react'

export function useAuthenticatedApi() {
  const { data: session, status } = useSession()
  
  const api = useMemo(() => {
    if (status === 'loading') {
      return null
    }
    if (!session?.accessToken) {
      throw new Error('User not authenticated')
    }
    return createServerApi(session.accessToken)
  }, [session?.accessToken, status])

  const getSession = () => {
    if (status === 'loading') {
      throw new Error('Session is still loading')
    }
    if (!session) {
      throw new Error('User not authenticated')
    }
    return session
  }

  return {
    api,
    getSession,
    isLoading: status === 'loading',
    isAuthenticated: !!session?.accessToken && status === 'authenticated'
  }
}
