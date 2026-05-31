import fs from "fs/promises"
import path from "path"

const GUIDES_DIR = path.join(process.cwd(), "..", "..", "packages", "betterstack-guides", "guides")

export interface BetterstackGuide {
  slug: string
  category: string
  title: string
  content: string
  filePath: string
}

export interface BetterstackGuideMeta {
  slug: string
  category: string
  title: string
}

async function readGuideFile(filePath: string, category: string): Promise<BetterstackGuide | null> {
  try {
    const content = await fs.readFile(filePath, "utf-8")
    const titleMatch = content.match(/^#\s+(.+)/m)
    const title = titleMatch ? titleMatch[1].trim() : path.basename(filePath, ".md")
    const slug = path.basename(filePath, ".md")
    return { slug, category, title, content, filePath }
  } catch {
    return null
  }
}

export async function getAllGuides(): Promise<BetterstackGuide[]> {
  const guides: BetterstackGuide[] = []

  try {
    const categories = await fs.readdir(GUIDES_DIR)
    for (const category of categories) {
      const categoryPath = path.join(GUIDES_DIR, category)
      const stat = await fs.stat(categoryPath).catch(() => null)
      if (!stat || !stat.isDirectory()) continue

      const files = await fs.readdir(categoryPath)
      for (const file of files) {
        if (!file.endsWith(".md")) continue
        const guide = await readGuideFile(path.join(categoryPath, file), category)
        if (guide) guides.push(guide)
      }
    }
  } catch {
    // directory might not exist
  }

  return guides.sort((a, b) => a.title.localeCompare(b.title))
}

export async function getAllGuideMetas(): Promise<BetterstackGuideMeta[]> {
  const guides = await getAllGuides()
  return guides.map(({ slug, category, title }) => ({ slug, category, title }))
}

export async function getGuideCategories(): Promise<string[]> {
  try {
    const entries = await fs.readdir(GUIDES_DIR)
    const categories: string[] = []
    for (const entry of entries) {
      const stat = await fs.stat(path.join(GUIDES_DIR, entry)).catch(() => null)
      if (stat && stat.isDirectory()) categories.push(entry)
    }
    return categories.sort()
  } catch {
    return []
  }
}

export async function getGuidesByCategory(category: string): Promise<BetterstackGuideMeta[]> {
  const all = await getAllGuideMetas()
  return all.filter((g) => g.category === category)
}

export async function getGuideBySlug(category: string, slug: string): Promise<BetterstackGuide | null> {
  const filePath = path.join(GUIDES_DIR, category, `${slug}.md`)
  return readGuideFile(filePath, category)
}

export async function getGuideCount(): Promise<number> {
  const guides = await getAllGuides()
  return guides.length
}
