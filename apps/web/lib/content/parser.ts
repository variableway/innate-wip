import matter from 'gray-matter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeHighlight from 'rehype-highlight'
import rehypeStringify from 'rehype-stringify'
import type { PostMeta, ParsedPost } from './types'

export function parseFrontmatter(content: string): { meta: PostMeta; body: string } {
  const { data, content: body } = matter(content)

  return {
    meta: {
      title: data.title || 'Untitled',
      slug: data.slug || '',
      date: data.date || new Date().toISOString(),
      updated: data.updated,
      author: data.author || 'Anonymous',
      category: data.category || 'article',
      tags: data.tags || [],
      excerpt: data.excerpt,
      cover: data.cover,
      featured: data.featured || false,
      editorsPick: data.editorsPick || false,
      readingTime: data.readingTime || estimateReadingTime(body),
      status: data.status || 'published',
    },
    body: body.trim(),
  }
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(markdown)

  return String(result)
}

export async function parsePost(content: string): Promise<ParsedPost> {
  const { meta, body } = parseFrontmatter(content)
  const html = await markdownToHtml(body)

  return {
    meta,
    content: body,
    html,
  }
}

export function extractPlainText(html: string, maxLength: number = 200): string {
  const text = html
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export function extractToc(content: string): Array<{ level: number; text: string; id: string }> {
  const headings: Array<{ level: number; text: string; id: string }> = []
  const seenIds = new Map<string, number>()
  const lines = content.split('\n')

  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.+)$/)
    if (match) {
      const level = match[1].length
      const text = match[2].trim()
      let id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')

      const seenCount = seenIds.get(id) || 0
      seenIds.set(id, seenCount + 1)
      if (seenCount > 0) {
        id = `${id}-${seenCount}`
      }

      headings.push({ level, text, id })
    }
  }

  return headings
}

function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
}
