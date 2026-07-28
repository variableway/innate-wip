import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { ThemeProvider } from '@/components/theme-provider'
import { AppShell } from '@/components/app-shell'
import { getAwesomeCategories, getAllAwesomeItems } from '@/lib/awesome/data'
import { getWritingMeta } from '@/lib/content'
import './globals.css'

const SITE_URL = process.env.SITE_URL || 'https://variableway.github.io/innate'

export const metadata: Metadata = {
  title: 'Innate',
  description: 'What you makes, make you.',
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
  const posts = await getWritingMeta()

  const categoriesWithCount = categories.map((cat) => ({
    ...cat,
    count: items.filter((item) => item.category === cat.slug).length,
  }))

  const searchData = [
    ...items.map((item) => ({
      type: 'awesome' as const,
      title: item.name,
      subtitle: item.shortDescription ?? item.description,
      href: `/awesome/${item.category}`,
    })),
    ...posts.map((post) => ({
      type: 'writing' as const,
      title: post.title,
      subtitle: post.excerpt ?? post.category,
      href: `/writing/${post.slug}`,
    })),
  ]

  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AppShell categories={categoriesWithCount} searchData={searchData}>
            {children}
          </AppShell>
        </ThemeProvider>
      </body>
    </html>
  )
}
