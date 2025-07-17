import { NextRequest, NextResponse } from 'next/server'
import { createServerApi } from '@/app/lib/serverApi'

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const body = await request.json()
    const { currentPassword, newPassword } = body

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ message: 'Current password and new password are required' }, { status: 400 })
    }

    // Fazer chamada para o backend real
    const api = createServerApi(token)
    const response = await api.put('/user/update-password', {
      currentPassword,
      newPassword
    })

    return NextResponse.json(response.data)
  } catch (error) {
    console.error('Erro ao atualizar senha:', error)
    
    // Retornar erro mais específico baseado no tipo
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { status?: number; data?: { message?: string } } }
      return NextResponse.json(
        { message: axiosError.response?.data?.message || 'Erro ao atualizar senha' }, 
        { status: axiosError.response?.status || 500 }
      )
    }
    
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 })
  }
}
