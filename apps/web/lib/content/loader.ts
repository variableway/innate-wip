import fs from 'fs/promises'
import path from 'path'
import { cache } from 'react'

const CONTENT_DIR = path.join(process.cwd(), 'content')
const WRITING_DIR = path.join(CONTENT_DIR, 'writing')

export const readFile = cache(async (relativePath: string): Promise<string | null> => {
  try {
    const fullPath = path.join(CONTENT_DIR, relativePath)
    return await fs.readFile(fullPath, 'utf-8')
  } catch {
    return null
  }
})

export async function fileExists(relativePath: string): Promise<boolean> {
  try {
    const fullPath = path.join(CONTENT_DIR, relativePath)
    await fs.access(fullPath)
    return true
  } catch {
    return false
  }
}

export async function getAllWritingSlugs(): Promise<string[]> {
  try {
    const files = await fs.readdir(WRITING_DIR)
    return files
      .filter((file) => file.endsWith('.md') || file.endsWith('.mdx'))
      .map((file) => file.replace(/\.(md|mdx)$/, ''))
  } catch (error) {
    console.error('Failed to read writing directory:', error)
    return []
  }
}

export async function getAllWritingRaw(): Promise<Array<{ slug: string; content: string; ext: string }>> {
  const slugs = await getAllWritingSlugs()
  const posts = await Promise.all(
    slugs.map(async (slug) => {
      // Try .md first, then .mdx
      let content = await readFile(`writing/${slug}.md`)
      let ext = '.md'
      if (!content) {
        content = await readFile(`writing/${slug}.mdx`)
        ext = '.mdx'
      }
      if (!content) return null
      return { slug, content, ext }
    })
  )
  return posts.filter((post): post is { slug: string; content: string; ext: string } => post !== null)
}

export async function getWritingFile(slug: string): Promise<{ content: string; ext: string } | null> {
  let content = await readFile(`writing/${slug}.md`)
  if (content) return { content, ext: '.md' }

  content = await readFile(`writing/${slug}.mdx`)
  if (content) return { content, ext: '.mdx' }

  return null
}
