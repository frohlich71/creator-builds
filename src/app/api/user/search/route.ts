import { NextRequest, NextResponse } from 'next/server'
import { createServerApi } from '@/app/lib/serverApi'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query || query.length < 2) {
      return NextResponse.json([])
    }

    // Fazer chamada para o backend real
    const api = createServerApi()
    const response = await api.get(`/user/search?q=${encodeURIComponent(query)}`)

    return NextResponse.json(response.data)
  } catch (error) {
    console.error('Erro na busca de usuários:', error)
    
    // Retornar erro mais específico baseado no tipo
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number } }
      return NextResponse.json(
        { error: 'Erro ao buscar usuários no backend' }, 
        { status: axiosError.response?.status || 500 }
      )
    }
    
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}