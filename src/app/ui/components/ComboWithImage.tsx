'use client'

import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'
import { useState } from 'react'

interface ComboWithImageProps<T> {
  options: T[];
  value: T | null;
  onChange: (value: T | null) => void;
  label?: string;
  getLabel?: (item: T) => string;
  getImageUrl?: (item: T) => string;
  placeholder?: string;
  onInputChange?: (query: string) => void;
  isLoading?: boolean;
  noResultsMessage?: string;
  onItemHover?: (item: T | null, event?: React.MouseEvent) => void;
}

export default function ComboWithImage<T extends { id: string | number } = { id: string | number }>({
  options,
  value,
  onChange,
  label = 'Select',
  getLabel = (item: unknown) => (item as { name: string }).name,
  getImageUrl = (item) => (item as unknown as { imageUrl: string }).imageUrl,
  onInputChange,
  isLoading = false,
  noResultsMessage = "No results found",
  onItemHover,
}: ComboWithImageProps<T>) {
  const [query, setQuery] = useState('')

  // Se há onInputChange, não filtramos localmente (busca via API)
  // Se não há, filtramos localmente
  const filteredOptions = onInputChange 
    ? options
    : query === ''
      ? options
      : options.filter((item) => {
          return getLabel(item).toLowerCase().includes(query.toLowerCase())
        })

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newQuery = event.target.value
    setQuery(newQuery)
    if (onInputChange) onInputChange(newQuery)
  }

  return (
    <Combobox
      as="div"
      value={value}
      onChange={(item) => {
        setQuery('')
        onChange(item)
      }}
    >
      <div className="relative">
        <div className="relative">
          <ComboboxInput
            className={
              `block w-full rounded-lg bg-white px-2.5 pr-8 pb-2 pt-4 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-transparent focus:outline-2 focus:-outline-offset-2 focus:outline-rose-600 sm:text-sm/6 peer`}
            onChange={handleInputChange}
            onBlur={() => setQuery('')}
            displayValue={(item: T) => (item ? getLabel(item) : '')}
            placeholder={label}
          />
          <label
            className={
              `absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:text-rose-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1`
            }
          >
            {label}
          </label>
          <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-hidden">
            <ChevronUpDownIcon className="size-5 text-gray-400" aria-hidden="true" />
          </ComboboxButton>
        </div>
        {(filteredOptions.length > 0 || isLoading || query) && (
          <ComboboxOptions className="absolute z-50 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-hidden sm:text-sm">
            {isLoading ? (
              <div className="relative cursor-default py-2 px-3 text-gray-900 select-none">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-rose-600"></div>
                  <span className="ml-3 text-gray-500">Searching...</span>
                </div>
              </div>
            ) : filteredOptions.length > 0 ? (
              filteredOptions.map((item, index) => (
                <ComboboxOption
                  key={`${item.id}-${index}`}
                  value={item}
                  className="group relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-rose-600 data-focus:text-white data-focus:outline-hidden"
                  onMouseEnter={(e) => onItemHover?.(item, e)}
                  onMouseLeave={() => onItemHover?.(null)}
                >
                  <div className="flex items-center">
                    <Image 
                      src={(() => {
                        const imageUrl = getImageUrl(item);
                        return imageUrl && imageUrl.trim() !== '' ? imageUrl : '/fallback.png';
                      })()} 
                      alt={getLabel(item)} 
                      width={24}
                      height={24}
                      className="size-6 shrink-0 rounded-full object-cover" 
                    />
                    <span className="ml-3 truncate group-data-selected:font-semibold">{getLabel(item)}</span>
                  </div>

                  <span className="absolute inset-y-0 right-0 hidden items-center pr-4 text-rose-600 group-data-focus:text-white group-data-selected:flex">
                    <CheckIcon className="size-5" aria-hidden="true" />
                  </span>
                </ComboboxOption>
              ))
            ) : query && (
              <div className="relative cursor-default py-2 px-3 text-gray-500 select-none">
                {noResultsMessage}
              </div>
            )}
          </ComboboxOptions>
        )}
      </div>
    </Combobox>
  )
}
