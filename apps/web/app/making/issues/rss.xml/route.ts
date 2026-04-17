import { issues, projects } from '@/lib/making/data'

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
  const sortedIssues = [...issues]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 50)

  const projectMap = new Map(projects.map((p) => [p.id, p]))

  const items = sortedIssues.map((issue) => {
    const issueUrl = issue.url || `${SITE_URL}/making/issues/${issue.project}/${issue.number}`
    const project = projectMap.get(issue.project)
    const projectName = project?.name || issue.project
    const statusLabel = issue.status === 'open' ? '🟢 Open' : '✅ Closed'

    const description = [
      `Project: ${escapeXml(projectName)}`,
      `Status: ${statusLabel}`,
      issue.labels.length > 0
        ? `Labels: ${issue.labels.map((l) => escapeXml(l.name)).join(', ')}`
        : '',
      issue.author ? `Author: ${escapeXml(issue.author)}` : '',
    ]
      .filter(Boolean)
      .join(' | ')

    return `
    <item>
      <title>${escapeXml(`[${projectName} #${issue.number}] ${issue.title}`)}</title>
      <link>${issueUrl}</link>
      <guid>${issueUrl}</guid>
      <description>${description}</description>
      <pubDate>${new Date(issue.updatedAt).toUTCString()}</pubDate>
      ${issue.labels.map((label) => `<category>${escapeXml(label.name)}</category>`).join('\n      ')}
    </item>`
  })

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Innate - Issues</title>
    <link>${SITE_URL}/making/issues</link>
    <description>GitHub Issues tracker across all Innate projects</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/making/issues/rss.xml" rel="self" type="application/rss+xml" />
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
