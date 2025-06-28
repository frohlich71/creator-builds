import React from 'react'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  loading?: boolean
  fullWidth?: boolean
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  loading = false,
  fullWidth = false,
  onClick,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  
  const baseClasses = 'inline-flex cursor-pointer items-center justify-center font-semibold transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variantClasses = {
    primary: 'bg-rose-600 text-white hover:bg-rose-500 focus-visible:outline-rose-600 shadow-xs',
    secondary: 'bg-rose-50 text-rose-600 hover:bg-rose-100 focus-visible:outline-rose-600',
    outline: 'border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 focus-visible:outline-gray-600 shadow-xs',
    ghost: 'text-gray-700 hover:bg-gray-100 focus-visible:outline-gray-600'
  }
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs rounded-sm',
    md: 'px-3 py-2 text-sm rounded-md',
    lg: 'px-4 py-3 text-base rounded-lg'
  }
  
  const widthClass = fullWidth ? 'w-full' : ''
  
  const classes = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${widthClass}
    ${className}
  `.trim().replace(/\s+/g, ' ')
  
  return (
    <button
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  )
}