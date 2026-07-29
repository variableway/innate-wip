import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { ThemeProvider } from '@/components/theme-provider'
import { AppShell } from '@/components/app-shell'
import { getWritingMeta } from '@/lib/content'
import { siteFeatures } from '@/lib/site-features'
import { getEnabledPlugins } from '@/lib/plugins/registry'
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
  const posts = await getWritingMeta()
  const plugins = getEnabledPlugins()

  // Awesome category chips reserved for when awesome plugin is enabled.
  const categoriesWithCount: Array<{
    slug: string
    name: string
    icon: string
    color: string
    count: number
  }> = []

  const searchData = siteFeatures.content
    ? posts.map((post) => ({
        type: 'writing' as const,
        title: post.title,
        subtitle: post.excerpt ?? post.category,
        href: `/writing/${post.slug}`,
      }))
    : []

  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AppShell
            categories={categoriesWithCount}
            plugins={plugins}
            searchData={searchData}
          >
            {children}
          </AppShell>
        </ThemeProvider>
      </body>
    </html>
  )
}
