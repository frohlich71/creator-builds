import { useState, useRef } from 'react'
import { UserCircleIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

interface ImageUploadProps {
  onImageSelect: (file: File | null) => void
  currentImage?: string | null
  label?: string
  size?: 'sm' | 'md' | 'lg'
  rounded?: boolean
}

export default function ImageUpload({ 
  onImageSelect, 
  currentImage, 
  label = "Photo",
  size = 'md',
  rounded = true 
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sizeClasses = {
    sm: 'size-12',
    md: 'size-16',
    lg: 'size-24'
  }

  const validateFile = (file: File): string | null => {
    // Verificar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      return 'Por favor, selecione apenas arquivos de imagem.'
    }

    // Verificar tamanho (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return 'O arquivo deve ter no máximo 10MB.'
    }

    return null
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError(null)

    // Validar arquivo
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    // Criar preview local
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Notificar o componente pai sobre o arquivo selecionado
    onImageSelect(file)
  }

  const removeImage = () => {
    setPreview(null)
    setError(null)
    onImageSelect(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="col-span-full">
      <label htmlFor="photo" className="block text-sm/6 font-medium text-gray-900">
        {label}
      </label>
      <div className="mt-2 flex items-center gap-x-6">
        <div className="relative">
          {preview ? (
            <div className="relative group">
              <Image
                src={preview}
                alt="Profile preview"
                width={400}
                height={400}
                className={`${sizeClasses[size]} ${rounded ? 'rounded-full' : 'rounded-md'} object-cover ring-2 ring-gray-300`}
              />
              {/* Botão para remover imagem */}
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remover imagem"
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <UserCircleIcon aria-hidden="true" className={`${sizeClasses[size]} text-gray-300`} />
          )}
          
          {/* Removido loading state pois upload acontece apenas no submit do formulário */}
        </div>

        <div className="flex flex-col gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 flex items-center gap-2"
          >
            <PhotoIcon className="w-4 h-4" />
            {preview ? 'Change Photo' : 'Upload Photo'}
          </button>
          
          <p className="text-xs text-gray-500">
            JPG, PNG até 10MB
          </p>
          
          {error && (
            <p className="text-xs text-red-600">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}