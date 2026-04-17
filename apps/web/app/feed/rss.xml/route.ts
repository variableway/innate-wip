import { getPostsMeta } from '@/lib/content'

export const dynamic = 'force-static'

const SITE_URL = process.env.SITE_URL || 'https://variableway.github.io/innate-websites'

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const posts = await getPostsMeta({ status: 'published' })

  const items = await Promise.all(
    posts.map(async (post) => {
      const postUrl = `${SITE_URL}/feed/${post.slug}`
      const description = post.excerpt
        ? escapeXml(post.excerpt)
        : ''

      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description>${description}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <author>${escapeXml(post.author)}</author>
      ${post.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join('\n      ')}
    </item>`
    })
  )

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Innate - Writing</title>
    <link>${SITE_URL}/feed</link>
    <description>What drives you, and what you makes, make you.</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed/rss.xml" rel="self" type="application/rss+xml" />
${items.join('')}
  </channel>
</rss>`

  return new Response(xml.trim(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
