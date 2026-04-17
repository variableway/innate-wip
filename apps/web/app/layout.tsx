import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { AppLayout } from '@/components/layout/app-layout'
import './globals.css'

export const metadata: Metadata = {
  title: 'Innate',
  description: 'What drives you, and what you makes, make you.',
  generator: 'v0.app',
  alternates: {
    types: {
      'application/rss+xml': '/feed/rss.xml',
    },
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body className="font-sans antialiased">
        <AppLayout>{children}</AppLayout>
        <Analytics />
      </body>
    </html>
  )
}
