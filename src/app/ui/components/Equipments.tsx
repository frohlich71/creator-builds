'use client'

import { Equipment } from '@/types/setup'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

// Mapeamento dos IDs dos ícones para as imagens
const ICON_MAP: Record<string, string> = {
  monitor: '/icons/monitor.png',
  keyboard: '/icons/keyboard.png',
  mouse: '/icons/mouse.png',
  headset: '/icons/headset.png',
  speakers: '/icons/speakers.png',
  camera: '/icons/camera.png',
  joystick: '/icons/joystick.png',
  laptop: '/icons/laptop.png',
  printer: '/icons/printer.png',
  light: '/icons/light.png',
  cable: '/icons/cable.png',
  other: '/icons/other.png',
}

// Função para obter a URL da imagem do ícone
function getIconImageUrl(iconId: string): string {
  return ICON_MAP[iconId] || '/icons/other.png'
}

export default function Equipments({equipments} : {equipments: Equipment[]}) {

  return (
    <div className="mt-4">
      <div className="grid gap-4">
        {equipments.map((equipment) => (
          <div key={equipment._id} className="flex border border-gray-200 rounded-lg p-4 items-center justify-between bg-gray-50/50 hover:bg-gray-50 transition-colors duration-200">
            {/* Seção esquerda: Ícone e informações */}
            <div className="flex items-center space-x-4">
              {/* Ícone do equipamento */}
              <div className="inline-flex size-12 items-center justify-center rounded-lg bg-white border border-gray-200 shadow-sm">
                <Image
                  src={getIconImageUrl(equipment.icon)}
                  alt={`Ícone ${equipment.name}`}
                  width={24}
                  height={24}
                  className="w-6 h-6 object-contain"
                />
              </div>
              
              {/* Informações do equipamento */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 mb-1">{equipment.name}</h4>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="font-medium text-gray-700">{equipment.brand}</span>
                  <span className="text-gray-400">•</span>
                  <span>{equipment.model}</span>
                </div>
              </div>
            </div>
            
            {/* Seção direita: Botão de ação */}
            <div className="flex items-center">
              <a
                href={equipment.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-2 py-1.5 md:px-3 md:py-2 text-xs md:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              >
                <ArrowTopRightOnSquareIcon className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">View Product</span>
                <span className="sm:hidden">View Product</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
