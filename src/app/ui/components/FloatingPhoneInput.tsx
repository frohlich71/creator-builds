'use client'

import React, { useState, useEffect, useRef } from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

interface CountryCode {
  code: string
  flag: string
  name: string
  mask: string
}

interface FloatingPhoneInputProps {
  id: string
  label: string
  register: UseFormRegisterReturn
  error?: string
  required?: boolean
  defaultValue?: string
}

// Lista de códigos de países com suas bandeiras e máscaras
const countryCodes: CountryCode[] = [
  { code: '+1', flag: '🇺🇸', name: 'United States', mask: '(###) ###-####' },
  { code: '+55', flag: '🇧🇷', name: 'Brazil', mask: '(##) #####-####' },
  { code: '+44', flag: '🇬🇧', name: 'United Kingdom', mask: '#### ### ####' },
  { code: '+33', flag: '🇫🇷', name: 'France', mask: '## ## ## ## ##' },
  { code: '+49', flag: '🇩🇪', name: 'Germany', mask: '### ### ####' },
  { code: '+34', flag: '🇪🇸', name: 'Spain', mask: '### ### ###' },
  { code: '+39', flag: '🇮🇹', name: 'Italy', mask: '### ### ####' },
  { code: '+31', flag: '🇳🇱', name: 'Netherlands', mask: '## ### ####' },
  { code: '+61', flag: '🇦🇺', name: 'Australia', mask: '### ### ###' },
  { code: '+81', flag: '🇯🇵', name: 'Japan', mask: '##-####-####' },
  { code: '+86', flag: '🇨🇳', name: 'China', mask: '### #### ####' },
  { code: '+91', flag: '🇮🇳', name: 'India', mask: '##### #####' },
  { code: '+52', flag: '🇲🇽', name: 'Mexico', mask: '## #### ####' },
  { code: '+54', flag: '🇦🇷', name: 'Argentina', mask: '## #### ####' },
  { code: '+56', flag: '🇨🇱', name: 'Chile', mask: '# #### ####' },
  { code: '+57', flag: '🇨🇴', name: 'Colombia', mask: '### ### ####' },
  { code: '+51', flag: '🇵🇪', name: 'Peru', mask: '### ### ###' },
  { code: '+58', flag: '🇻🇪', name: 'Venezuela', mask: '###-###-####' },
  { code: '+351', flag: '🇵🇹', name: 'Portugal', mask: '### ### ###' },
  { code: '+7', flag: '🇷🇺', name: 'Russia', mask: '### ###-##-##' },
]

const applyMask = (value: string, mask: string): string => {
  // Remove tudo que não é dígito
  const numbers = value.replace(/\D/g, '')
  
  let result = ''
  let numberIndex = 0
  
  for (let i = 0; i < mask.length && numberIndex < numbers.length; i++) {
    if (mask[i] === '#') {
      result += numbers[numberIndex]
      numberIndex++
    } else {
      result += mask[i]
    }
  }
  
  return result
}

export default function FloatingPhoneInput({ 
  id, 
  label, 
  register, 
  error, 
  required = false,
  defaultValue = '' 
}: FloatingPhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(countryCodes[0])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Processar valor padrão ao inicializar
  useEffect(() => {
    if (defaultValue && !isInitialized) {
      // Encontrar o país baseado no código
      let detectedCountry = countryCodes[0] // Default para US
      let phoneNumber = defaultValue
      
      // Tentar encontrar o país pelo código
      for (const country of countryCodes) {
        if (defaultValue.startsWith(country.code)) {
          detectedCountry = country
          phoneNumber = defaultValue.slice(country.code.length)
          break
        }
      }
      
      setSelectedCountry(detectedCountry)
      
      // Aplicar máscara ao número
      const maskedValue = applyMask(phoneNumber, detectedCountry.mask)
      setInputValue(maskedValue)
      
      setIsInitialized(true)
    }
  }, [defaultValue, isInitialized])

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const maskedValue = applyMask(value, selectedCountry.mask)
    setInputValue(maskedValue)
    
    // Atualizar o valor no react-hook-form com código do país + número
    const numbersOnly = maskedValue.replace(/\D/g, '')
    const fullNumber = selectedCountry.code + numbersOnly
    
    // Usar o método onChange do register para atualizar o valor
    const event = {
      target: {
        value: fullNumber,
        name: register.name
      }
    }
    register.onChange(event)
  }

  const handleCountryChange = (country: CountryCode) => {
    setSelectedCountry(country)
    setIsDropdownOpen(false)
    
    // Reaplicar máscara com o novo país selecionado
    const maskedValue = applyMask(inputValue, country.mask)
    setInputValue(maskedValue)
    
    // Atualizar valor no form
    const numbersOnly = maskedValue.replace(/\D/g, '')
    const fullNumber = country.code + numbersOnly
    
    const event = {
      target: {
        value: fullNumber,
        name: register.name
      }
    }
    register.onChange(event)
  }

  const isActive = isFocused || inputValue.length > 0

  return (
    <div className="relative">
      <div className="relative">
        <div className="flex">
          {/* Dropdown do código do país */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2.5 bg-white border border-gray-300 rounded-l-md border-r-0 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:border-transparent h-12"
            >
              <span className="text-lg">{selectedCountry.flag}</span>
              <span className="text-sm text-gray-600">{selectedCountry.code}</span>
              <ChevronDownIcon className="h-4 w-4 text-gray-400" />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-72 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                {countryCodes.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleCountryChange(country)}
                    className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                  >
                    <span className="text-lg">{country.flag}</span>
                    <span className="text-sm text-gray-600">{country.code}</span>
                    <span className="text-sm text-gray-900">{country.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input do telefone */}
          <div className="relative flex-1">
            <input
              {...register}
              id={id}
              type="tel"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={isActive ? selectedCountry.mask.replace(/#/g, '0') : ''}
              className="block w-full px-3 py-2.5 bg-white border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-rose-600 focus:border-transparent placeholder:text-gray-400 h-12"
              required={required}
            />
            
            {/* Floating Label */}
            <label
              htmlFor={id}
              className={`absolute left-3 transition-all duration-200 pointer-events-none ${
                isActive
                  ? `text-xs ${isFocused ? 'text-rose-600' : 'text-gray-500'} -top-2 bg-white px-1`
                  : 'text-base text-gray-500 top-2.5'
              }`}
            >
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          </div>
        </div>
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
