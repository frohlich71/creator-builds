'use client'

import { NotificationProvider } from '@/app/contexts/NotificationContext'
import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

interface ProvidersProps {
  children: ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  return <NotificationProvider><SessionProvider>{children}</SessionProvider></NotificationProvider>
}