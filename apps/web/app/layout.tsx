import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/theme-provider'
import { AppShell } from '@/components/app-shell'
import { getAwesomeCategories, getAllAwesomeItems } from '@/lib/awesome/data'
import './globals.css'

const SITE_URL = process.env.SITE_URL || 'https://variableway.github.io/innate'

export const metadata: Metadata = {
  title: 'Innate',
  description: 'What drives you, and what you makes, make you.',
  alternates: {
    types: {
      'application/rss+xml': `${SITE_URL}/rss.xml`,
    },
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const categories = await getAwesomeCategories()
  const items = await getAllAwesomeItems()

  const categoriesWithCount = categories.map((cat) => ({
    ...cat,
    count: items.filter((item) => item.category === cat.slug).length,
  }))

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AppShell categories={categoriesWithCount}>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  )
}
