import fs from 'fs/promises'
import path from 'path'
import type { AwesomeCategory, AwesomeItem, AwesomeData } from './types'

const AWESOME_DIR = path.join(process.cwd(), 'content', 'awesome')

export async function getAwesomeCategories(): Promise<AwesomeCategory[]> {
  try {
    const raw = await fs.readFile(path.join(AWESOME_DIR, 'categories.json'), 'utf-8')
    const data = JSON.parse(raw)
    return data.categories || []
  } catch {
    return []
  }
}

export async function getAllAwesomeData(): Promise<AwesomeData[]> {
  try {
    const files = await fs.readdir(AWESOME_DIR)
    const jsonFiles = files.filter((f) => f.endsWith('.json') && f !== 'categories.json')

    const results = await Promise.all(
      jsonFiles.map(async (file) => {
        try {
          const raw = await fs.readFile(path.join(AWESOME_DIR, file), 'utf-8')
          return JSON.parse(raw) as AwesomeData
        } catch {
          return null
        }
      })
    )

    return results.filter((r): r is AwesomeData => r !== null)
  } catch {
    return []
  }
}

export async function getAllAwesomeItems(): Promise<(AwesomeItem & { sourceName: string })[]> {
  const dataList = await getAllAwesomeData()
  const items: (AwesomeItem & { sourceName: string })[] = []

  for (const data of dataList) {
    for (const item of data.items) {
      items.push({ ...item, sourceName: data.source.name })
    }
  }

  return items
}

export async function getAwesomeItemsByCategory(
  categorySlug: string
): Promise<(AwesomeItem & { sourceName: string })[]> {
  const all = await getAllAwesomeItems()
  return all.filter((item) => item.category === categorySlug)
}

export async function getAwesomeCategory(slug: string): Promise<AwesomeCategory | null> {
  const categories = await getAwesomeCategories()
  return categories.find((c) => c.slug === slug) || null
}

export async function getAllCategorySlugs(): Promise<string[]> {
  const categories = await getAwesomeCategories()
  return categories.map((c) => c.slug)
}
