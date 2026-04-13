import fs from 'fs/promises'
import path from 'path'
import { cache } from 'react'

// 内容目录路径
const CONTENT_DIR = path.join(process.cwd(), 'content')
const POSTS_DIR = path.join(CONTENT_DIR, 'posts')
const WRITING_DIR = path.join(CONTENT_DIR, 'writing')

/**
 * 读取文件内容（带缓存）
 * 使用 React cache 确保在 SSR 中同一请求只读取一次
 */
export const readFile = cache(async (relativePath: string): Promise<string | null> => {
  try {
    const fullPath = path.join(CONTENT_DIR, relativePath)
    return await fs.readFile(fullPath, 'utf-8')
  } catch (error) {
    console.error(`Failed to read file: ${relativePath}`, error)
    return null
  }
})

/**
 * 检查文件是否存在
 */
export async function fileExists(relativePath: string): Promise<boolean> {
  try {
    const fullPath = path.join(CONTENT_DIR, relativePath)
    await fs.access(fullPath)
    return true
  } catch {
    return false
  }
}

/**
 * 获取所有文章 slug 列表
 */
export async function getAllPostSlugs(): Promise<string[]> {
  try {
    const files = await fs.readdir(POSTS_DIR)
    return files
      .filter((file) => file.endsWith('.md'))
      .map((file) => file.replace(/\.md$/, ''))
  } catch (error) {
    console.error('Failed to read posts directory:', error)
    return []
  }
}

/**
 * 获取所有文章的原始内容（用于构建时）
 */
export async function getAllPostsRaw(): Promise<Array<{ slug: string; content: string }>> {
  const slugs = await getAllPostSlugs()
  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const content = await readFile(`posts/${slug}.md`)
      if (!content) return null
      return { slug, content }
    })
  )
  return posts.filter((post): post is { slug: string; content: string } => post !== null)
}

/**
 * 获取所有 Writing 文章 slug 列表
 */
export async function getAllWritingSlugs(): Promise<string[]> {
  try {
    const files = await fs.readdir(WRITING_DIR)
    return files
      .filter((file) => file.endsWith('.md'))
      .map((file) => file.replace(/\.md$/, ''))
  } catch (error) {
    console.error('Failed to read writing directory:', error)
    return []
  }
}

/**
 * 获取所有 Writing 文章的原始内容
 */
export async function getAllWritingRaw(): Promise<Array<{ slug: string; content: string }>> {
  const slugs = await getAllWritingSlugs()
  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const content = await readFile(`writing/${slug}.md`)
      if (!content) return null
      return { slug, content }
    })
  )
  return posts.filter((post): post is { slug: string; content: string } => post !== null)
}

/**
 * 获取作者信息
 */
export async function getAuthor(authorId: string) {
  const content = await readFile('authors/authors.json')
  if (!content) return null
  
  try {
    const authors = JSON.parse(content)
    return authors[authorId] || null
  } catch {
    return null
  }
}

/**
 * 获取所有作者
 */
export async function getAllAuthors() {
  const content = await readFile('authors/authors.json')
  if (!content) return {}
  
  try {
    return JSON.parse(content)
  } catch {
    return {}
  }
}
