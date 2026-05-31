import { readFile, getAllWritingSlugs, getAllWritingRaw, getWritingFile } from './loader'
import { parsePost, parseFrontmatter, markdownToHtml, extractToc, extractPlainText } from './parser'
import type { PostMeta, ParsedPost, Author } from './types'

export type { PostMeta, ParsedPost, Author }

export async function getWriting(slug: string): Promise<(ParsedPost & { type: 'md' | 'mdx' }) | null> {
  const file = await getWritingFile(slug)
  if (!file) return null

  const parsed = await parsePost(file.content)
  return {
    ...parsed,
    type: file.ext === '.mdx' ? 'mdx' : 'md',
  }
}

export async function getWritingMeta(options?: {
  category?: string
  tag?: string
  status?: 'published' | 'draft' | 'archived'
  limit?: number
  offset?: number
}): Promise<Array<PostMeta & { slug: string; type: 'md' | 'mdx' }>> {
  const rawPosts = await getAllWritingRaw()

  let posts = rawPosts.map(({ slug, content, ext }) => {
    const { meta } = parseFrontmatter(content)
    return { ...meta, slug, type: ext === '.mdx' ? ('mdx' as const) : ('md' as const) }
  })

  if (options?.category) {
    posts = posts.filter((p) => p.category === options.category)
  }
  if (options?.tag) {
    posts = posts.filter((p) => p.tags.includes(options.tag!))
  }
  if (options?.status) {
    posts = posts.filter((p) => p.status === options.status)
  } else {
    posts = posts.filter((p) => p.status === 'published')
  }

  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  if (options?.offset) {
    posts = posts.slice(options.offset)
  }
  if (options?.limit) {
    posts = posts.slice(0, options.limit)
  }

  return posts
}

export async function getAllWritingSlugObjects(): Promise<Array<{ slug: string }>> {
  const slugs = await getAllWritingSlugs()
  return slugs.map((slug) => ({ slug }))
}

export { extractToc, extractPlainText, markdownToHtml }
