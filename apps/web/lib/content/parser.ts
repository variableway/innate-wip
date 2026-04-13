import matter from 'gray-matter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeHighlight from 'rehype-highlight'
import rehypeStringify from 'rehype-stringify'
import type { PostMeta, ParsedPost } from './types'

/**
 * 解析 frontmatter 和正文
 */
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

/**
 * Markdown 转换为 HTML
 * 使用 unified/remark 处理器，并为标题添加 id 属性
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)           // 解析 Markdown
    .use(remarkGfm)             // GitHub Flavored Markdown
    .use(remarkRehype, {
      handlers: {
        // 为 h2/h3 标题添加 id 属性（用于 ToC 导航）
        heading(state, node) {
          const children = state.all(node)
          const text = children
            .filter((c): c is { type: 'text'; value: string } => c.type === 'text')
            .map((c) => c.value)
            .join('')
          const id = text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')

          const result: { type: string; tagName: string; properties: { id: string }; children: any[] } = {
            type: 'element',
            tagName: `h${node.depth}`,
            properties: { id },
            children,
          }
          return result
        },
      },
    })
    .use(rehypeHighlight)       // 代码高亮
    .use(rehypeStringify)       // 输出 HTML 字符串
    .process(markdown)

  return String(result)
}

/**
 * 解析完整文章
 */
export async function parsePost(content: string): Promise<ParsedPost> {
  const { meta, body } = parseFrontmatter(content)
  const html = await markdownToHtml(body)
  
  return {
    meta,
    content: body,
    html,
  }
}

/**
 * 从 HTML 中提取纯文本（用于摘要）
 */
export function extractPlainText(html: string, maxLength: number = 200): string {
  // 移除 HTML 标签
  const text = html
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

/**
 * 提取目录（TOC）
 */
export function extractToc(content: string): Array<{ level: number; text: string; id: string }> {
  const headings: Array<{ level: number; text: string; id: string }> = []
  const lines = content.split('\n')
  
  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.+)$/)
    if (match) {
      const level = match[1].length
      const text = match[2].trim()
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
      
      headings.push({ level, text, id })
    }
  }
  
  return headings
}

/**
 * 估算阅读时长
 */
function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
}
