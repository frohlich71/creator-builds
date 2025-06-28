/**
 * Função utilitária para fazer upload de imagem para o Cloudinary
 * usando autenticação server-side.
 * 
 * @param file - Arquivo de imagem a ser enviado
 * @param folder - Pasta no Cloudinary (default: 'profiles')
 * @returns Promise com a URL da imagem enviada
 */
export async function uploadImageToCloudinary(
  file: File, 
  folder: string = 'profiles'
): Promise<string> {
  try {
    // 1. Obter assinatura do servidor
    const signatureResponse = await fetch('/api/cloudinary/signature', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ folder }),
    })

    if (!signatureResponse.ok) {
      const errorData = await signatureResponse.json()
      console.error('Erro da API de assinatura:', errorData)
      
      // Melhor tratamento de erro baseado no status
      if (signatureResponse.status === 500) {
        throw new Error('Configuração do Cloudinary não encontrada. Verifique as variáveis de ambiente CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY e CLOUDINARY_API_SECRET.')
      }
      
      throw new Error(errorData.error || `Erro ao obter assinatura (${signatureResponse.status})`)
    }

    const signatureData = await signatureResponse.json()
    
    // Validar se recebemos todos os dados necessários
    if (!signatureData.signature || !signatureData.cloud_name || !signatureData.api_key) {
      throw new Error('Dados de assinatura incompletos recebidos do servidor')
    }
    
    // 2. Fazer upload usando assinatura
    const formData = new FormData()
    formData.append('file', file)
    formData.append('signature', signatureData.signature)
    formData.append('timestamp', signatureData.timestamp.toString())
    formData.append('api_key', signatureData.api_key)
    formData.append('folder', signatureData.folder)
    formData.append('transformation', 'w_400,h_400,c_fill,q_auto,f_auto')

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${signatureData.cloud_name}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json()
      throw new Error(errorData.error?.message || 'Falha no upload')
    }

    const uploadData = await uploadResponse.json()
    return uploadData.secure_url
    
  } catch (error) {
    console.error('Upload error:', error)
    throw error instanceof Error ? error : new Error('Erro ao fazer upload da imagem')
  }
}
