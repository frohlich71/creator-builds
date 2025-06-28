'use client'

import { Equipment } from '@/types/setup'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'



export default function Equipments({equipments} : {equipments: Equipment[]}) {

  return (
    <ul role="list" className="divide-y divide-gray-100">
      {equipments.map((equipment) => (
        <li key={equipment._id} className="flex border border-gray-300 rounded-md p-6 mt-5 items-center justify-between gap-x-6 py-5">
          <div className="flex min-w-0">
            <Image
                alt="Equipment image"
                src={equipment.product.imgUrl && equipment.product.imgUrl.trim() !== '' ? equipment.product.imgUrl : '/fallback.png'}
                width={48}
                height={48}
                className="inline-block mr-2 size-12 rounded-md object-cover"
            />
            <div className="items-start ml-4 gap-x-3">
              <p className="text-sm/6 font-semibold text-gray-900">{equipment.name}</p>
              <p className="truncate text-sm text-gray-500">
                {equipment.product.title.split(' ').slice(0, 6).join(' ')}
                {equipment.product.title.split(' ').length > 6 && '...'}
              </p>
            </div>
            <div className="mt-1 flex items-center gap-x-2 text-xs/5 text-gray-500">
              <svg viewBox="0 0 2 2" className="size-0.5 fill-current">
                <circle r={1} cx={1} cy={1} />
              </svg>
            </div>
          </div>
          <div className="flex flex-none items-center gap-x-4">
            <a
              href={equipment.product.productURL}
              className="inline-flex items-center transition-all duration-300 gap-x-2 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
            >
              <ArrowTopRightOnSquareIcon className="size-5" />
              Buy it<span className="sr-only">, {equipment.name}</span>
            </a>
          </div>
        </li>
      ))}
    </ul>
  )
}
