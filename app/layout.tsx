import '@/app/globals.css'
import { auth } from '@/auth'
import { Header } from '@/components/header'
import { Providers } from '@/components/providers'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { fontMono, fontSans } from '@/lib/fonts'
import { getURL } from '@/lib/helpers'
import { cn } from '@/lib/utils'
import { Metadata } from 'next'
import { cookies } from 'next/headers'
import NextTopLoader from 'nextjs-toploader'
import { Toaster } from 'react-hot-toast'
import { getChats } from './actions'
import MainLayout from './(main)/chat-layout'
import { useEffect } from 'react'

export const metadata: Metadata = {
  metadataBase: new URL(getURL()),
  title: {
    default: '🐣 Smol Talk',
    template: `%s - Smol Talk`
  },
  description: 'An AI-powered chatbot built with Next.js and Vercel.',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png'
  },
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'de-DE': '/de-DE'
    }
  },
  openGraph: {
    images: '/og-image.png'
  }
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          'font-sans antialiased',
          fontSans.variable,
          fontMono.variable
        )}
      >
        <Providers attribute="class" defaultTheme="system" enableSystem>
          <NextTopLoader />
          <Toaster />
          <main className="w-full">{children}</main>
          <TailwindIndicator />
        </Providers>
      </body>
    </html>
  )
}
