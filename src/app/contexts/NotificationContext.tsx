'use client'

import { createContext, useContext, ReactNode, useState, useCallback, useEffect } from 'react'
import Notification, { NotificationType } from '@/app/ui/components/Notification'

interface NotificationState {
  show: boolean
  type: NotificationType
  title: string
  message?: string
}

interface NotificationContextType {
  showNotification: (type: NotificationType, title: string, message?: string) => void
  showSuccess: (title: string, message?: string) => void
  showWarning: (title: string, message?: string) => void
  showError: (title: string, message?: string) => void
  hideNotification: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notification, setNotification] = useState<NotificationState>({
    show: false,
    type: 'success',
    title: '',
    message: undefined
  })

  const showNotification = useCallback((
    type: NotificationType,
    title: string,
    message?: string
  ) => {
    setNotification({
      show: true,
      type,
      title,
      message
    })
  }, [])

  const hideNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, show: false }))
  }, [])

  // Métodos de conveniência
  const showSuccess = useCallback((title: string, message?: string) => {
    showNotification('success', title, message)
  }, [showNotification])

  const showWarning = useCallback((title: string, message?: string) => {
    showNotification('warning', title, message)
  }, [showNotification])

  const showError = useCallback((title: string, message?: string) => {
    showNotification('error', title, message)
  }, [showNotification])

  // Detectar notificação na URL automaticamente
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Função para verificar e processar parâmetros da URL
      const processUrlNotification = () => {
        const urlParams = new URLSearchParams(window.location.search)
        const notificationType = urlParams.get('notification') as NotificationType
        const message = urlParams.get('message')
        const setupName = urlParams.get('setupName')

        if (notificationType && ['success', 'warning', 'error'].includes(notificationType)) {
          let title = ''
          let finalMessage = message ? decodeURIComponent(message) : undefined

          // Lidar com notificações específicas do sistema
          if (notificationType === 'success') {
            if (setupName) {
              title = 'Setup created successfully!'
              finalMessage = `"${setupName}" was added to your collection.`
            } else if (message) {
              title = 'Success!'
            } else {
              title = 'Operation completed successfully!'
            }
          } else if (notificationType === 'warning') {
            title = 'Warning!'
          } else if (notificationType === 'error') {
            title = 'Error!'
          }

          // Mostrar a notificação
          showNotification(notificationType, title, finalMessage)

          // Limpar os parâmetros da URL após um pequeno delay
          setTimeout(() => {
            const url = new URL(window.location.href)
            url.searchParams.delete('notification')
            url.searchParams.delete('message')
            url.searchParams.delete('setupName')
            window.history.replaceState({}, '', url.toString())
          }, 100)
        }
      }

      // Processar notificação imediatamente
      processUrlNotification()

      // Também escutar mudanças no histórico (back/forward)
      const handlePopState = () => {
        processUrlNotification()
      }

      window.addEventListener('popstate', handlePopState)

      return () => {
        window.removeEventListener('popstate', handlePopState)
      }
    }
  }, [showNotification])

  return (
    <NotificationContext.Provider
      value={{
        showNotification,
        showSuccess,
        showWarning,
        showError,
        hideNotification
      }}
    >
      {children}
      
      {/* Notificação global */}
      <Notification
        show={notification.show}
        onClose={hideNotification}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        autoClose={true}
        autoCloseDelay={5000}
      />
    </NotificationContext.Provider>
  )
}

export function useNotificationContext() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider')
  }
  return context
}
