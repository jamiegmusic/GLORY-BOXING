import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ErrorBoundary } from '@/components/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'Glory Management - From Amateur to Glory',
  description: 'The ultimate boxing management simulation game. Take fighters from amateur status to championship glory while dealing with the gritty realities of the boxing business.',
  keywords: 'boxing, management, game, simulation, fighter, promoter, championship',
      authors: [{ name: 'Glory Management Team' }],
  robots: 'index, follow',
  openGraph: {
    title: 'Glory Management',
    description: 'The ultimate boxing management simulation game',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Glory Management',
    description: 'The ultimate boxing management simulation game',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className={inter.className}>
        <ErrorBoundary service="root" showDetails={process.env.NODE_ENV === 'development'}>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  )
} 