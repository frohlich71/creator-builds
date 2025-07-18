import { Metadata } from 'next'
import './globals.css'
import Providers from './ui/providers/Providers'
import Header from './ui/components/Header'
 
export const metadata: Metadata = {
  title: 'Creator Builds',
  description: 'See the best creator builds',
  icons: {
    icon: '/favicon.ico',
  }
}
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full bg-white">
      <body className="h-full">
        <Providers>
          <main>
            <div className="min-h-full">
              <Header />
            </div>
            {children}
          </main>
          <footer className='bg-white'>
          <div className="mx-auto max-w-3x px-4 sm:px-6 lg:w-full lg:px-8">
            <div className="border-t border-gray-200 py-8 text-center text-sm text-gray-500 sm:text-left">
              <span className="block sm:inline">&copy; 2025 Creator builds, Inc.</span>{' '}
              <span className="block sm:inline">All rights reserved.</span>
            </div>
          </div>
        </footer>
        </Providers>
      </body>
    </html>
  )
}