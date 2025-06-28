'use client'

import { useEffect, useRef } from 'react'
import { Transition } from '@headlessui/react'
import { CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { XMarkIcon } from '@heroicons/react/20/solid'

export type NotificationType = 'success' | 'warning' | 'error'

interface NotificationProps {
  show: boolean
  onClose: () => void
  type: NotificationType
  title: string
  message?: string
  autoClose?: boolean
  autoCloseDelay?: number
}

const notificationConfig = {
  success: {
    icon: CheckCircleIcon,
    iconColor: 'text-green-400',
  },
  warning: {
    icon: ExclamationTriangleIcon,
    iconColor: 'text-yellow-400',
  },
  error: {
    icon: XCircleIcon,
    iconColor: 'text-red-400',
  },
}

export default function Notification({
  show,
  onClose,
  type,
  title,
  message,
  autoClose = true,
  autoCloseDelay = 5000
}: NotificationProps) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const config = notificationConfig[type]
  const IconComponent = config.icon

  useEffect(() => {
    // Limpar timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }

    if (show && autoClose) {
      timeoutRef.current = setTimeout(() => {
        onClose()
      }, autoCloseDelay)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [show, autoClose, autoCloseDelay, onClose])

  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 z-50 flex items-end px-4 py-6 sm:items-start sm:p-6"
    >
      <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
        <Transition
          show={show}
          enter="transform ease-out duration-300 transition"
          enterFrom="opacity-0 scale-90 translate-x-4"
          enterTo="opacity-100 scale-100 translate-x-0"
          leave="transition ease-in duration-300"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-90 translate-x-4"
        >
          <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/5">
            <div className="p-4">
              <div className="flex items-start">
                <div className="shrink-0">
                  <IconComponent aria-hidden="true" className={`size-6 ${config.iconColor}`} />
                </div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                  <p className="text-sm font-medium text-gray-900">{title}</p>
                  {message && <p className="mt-1 text-sm text-gray-500">{message}</p>}
                </div>
                <div className="ml-4 flex shrink-0">
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex cursor-pointer rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-1 focus:ring-rose-500 focus:ring-offset-2 focus:outline-hidden"
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon aria-hidden="true" className="size-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  )
}
