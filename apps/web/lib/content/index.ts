import { readFile, getAllPostSlugs, getAllPostsRaw, getAllWritingSlugs, getAllWritingRaw, getAuthor, getAllAuthors } from './loader'
import { parsePost, parseFrontmatter, markdownToHtml, extractToc, extractPlainText } from './parser'
import type { PostMeta, ParsedPost, Author } from './types'

export type { PostMeta, ParsedPost, Author }

/**
 * 获取单篇文章（完整内容）
 */
export async function getPost(slug: string): Promise<ParsedPost | null> {
  const content = await readFile(`posts/${slug}.md`)
  if (!content) return null
  
  return parsePost(content)
}

/**
 * 获取文章元数据列表（用于列表页）
 */
export async function getPostsMeta(options?: {
  category?: string
  tag?: string
  featured?: boolean
  editorsPick?: boolean
  status?: 'published' | 'draft' | 'archived'
  limit?: number
  offset?: number
}): Promise<Array<PostMeta & { slug: string }>> {
  const rawPosts = await getAllPostsRaw()
  
  let posts = rawPosts.map(({ slug, content }) => {
    const { meta } = parseFrontmatter(content)
    return { ...meta, slug }
  })
  
  // 过滤
  if (options?.category) {
    posts = posts.filter((p) => p.category === options.category)
  }
  if (options?.tag) {
    posts = posts.filter((p) => p.tags.includes(options.tag!))
  }
  if (options?.featured) {
    posts = posts.filter((p) => p.featured)
  }
  if (options?.editorsPick) {
    posts = posts.filter((p) => p.editorsPick)
  }
  if (options?.status) {
    posts = posts.filter((p) => p.status === options.status)
  } else {
    // 默认只显示已发布
    posts = posts.filter((p) => p.status === 'published')
  }
  
  // 排序（按日期倒序）
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  
  // 分页
  if (options?.offset) {
    posts = posts.slice(options.offset)
  }
  if (options?.limit) {
    posts = posts.slice(0, options.limit)
  }
  
  return posts
}

/**
 * 获取所有文章 slug（用于静态生成）
 * 返回格式: [{ slug: 'post-1' }, { slug: 'post-2' }]
 */
export async function getAllPostSlugObjects(): Promise<Array<{ slug: string }>> {
  const slugs = await getAllPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

/**
 * 获取相关文章
 */
export async function getRelatedPosts(
  currentSlug: string,
  tags: string[],
  limit = 3
): Promise<Array<PostMeta & { slug: string }>> {
  const posts = await getPostsMeta()
  
  // 根据标签相似度排序
  const scored = posts
    .filter((p) => p.slug !== currentSlug)
    .map((p) => {
      const commonTags = p.tags.filter((t) => tags.includes(t))
      return { ...p, score: commonTags.length }
    })
    .sort((a, b) => b.score - a.score)
  
  return scored.slice(0, limit)
}

/**
 * 获取作者信息
 */
export { getAuthor, getAllAuthors }

/**
 * 工具函数
 */
export { extractToc, extractPlainText, markdownToHtml }

/**
 * 获取单篇 Writing 文章（完整内容）
 */
export async function getWriting(slug: string): Promise<ParsedPost | null> {
  const content = await readFile(`writing/${slug}.md`)
  if (!content) return null

  return parsePost(content)
}

/**
 * 获取 Writing 文章元数据列表（用于列表页）
 */
export async function getWritingMeta(options?: {
  category?: string
  tag?: string
  status?: 'published' | 'draft' | 'archived'
  limit?: number
  offset?: number
}): Promise<Array<PostMeta & { slug: string }>> {
  const rawPosts = await getAllWritingRaw()

  let posts = rawPosts.map(({ slug, content }) => {
    const { meta } = parseFrontmatter(content)
    return { ...meta, slug }
  })

  // 过滤
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

  // 排序（按日期倒序）
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // 分页
  if (options?.offset) {
    posts = posts.slice(options.offset)
  }
  if (options?.limit) {
    posts = posts.slice(0, options.limit)
  }

  return posts
}

/**
 * 获取所有 Writing 文章 slug（用于静态生成）
 */
export async function getAllWritingSlugObjects(): Promise<Array<{ slug: string }>> {
  const slugs = await getAllWritingSlugs()
  return slugs.map((slug) => ({ slug }))
}
