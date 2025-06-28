import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  try {
    console.log('=== DEBUG: Variáveis de ambiente Cloudinary ===')
    console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? 'DEFINIDO' : 'NÃO DEFINIDO')
    console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? 'DEFINIDO' : 'NÃO DEFINIDO')
    console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'DEFINIDO' : 'NÃO DEFINIDO')
    
    // Verificar se as variáveis de ambiente estão configuradas
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('❌ Variáveis de ambiente do Cloudinary não configuradas')
      return NextResponse.json(
        { 
          error: 'Configuração do Cloudinary não encontrada',
          details: {
            cloud_name: !!process.env.CLOUDINARY_CLOUD_NAME,
            api_key: !!process.env.CLOUDINARY_API_KEY,
            api_secret: !!process.env.CLOUDINARY_API_SECRET
          }
        },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { folder = 'profiles' } = body

    // Parâmetros para o upload
    const timestamp = Math.round(new Date().getTime() / 1000)
    const params = {
      timestamp,
      folder,
      transformation: 'w_400,h_400,c_fill,q_auto,f_auto',
    }

    // Gerar assinatura
    const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET)

    console.log('✅ Assinatura gerada com sucesso')
    
    return NextResponse.json({
      signature,
      timestamp,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      folder,
    })
  } catch (error) {
    console.error('Erro ao gerar assinatura Cloudinary:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
