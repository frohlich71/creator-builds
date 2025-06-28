import { useState, useEffect, useCallback } from 'react'
import { SearchUser } from '@/types/search'

export function useUserSearch() {
  const [users, setUsers] = useState<SearchUser[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [query, setQuery] = useState('')

  const searchUsers = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 2) return []
    
    // Para busca de usuários, usamos a API local que não requer autenticação
    try {
      const response = await fetch(`/api/user/search?q=${encodeURIComponent(searchQuery)}`)
      if (!response.ok) {
        throw new Error('Erro na busca de usuários')
      }
      return await response.json()
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
      return []
    }
  }, [])

  const searchUsersDebounced = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery || searchQuery.length < 2) {
        setUsers([])
        return
      }

      setIsLoading(true)
      try {
        const results = await searchUsers(searchQuery)
        setUsers(results || [])
      } catch (error) {
        console.error('Erro ao buscar usuários:', error)
        setUsers([])
      } finally {
        setIsLoading(false)
      }
    },
    [searchUsers]
  )

  // Debounce da busca
  useEffect(() => {
    const timer = setTimeout(() => {
      searchUsersDebounced(query)
    }, 300) // 300ms de delay

    return () => clearTimeout(timer)
  }, [query, searchUsersDebounced])

  const handleQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery)
  }, [])

  return {
    users,
    isLoading,
    query,
    handleQueryChange,
  }
}
