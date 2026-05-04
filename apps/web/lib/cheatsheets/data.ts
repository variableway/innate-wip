import fs from "fs/promises"
import path from "path"
import matter from "gray-matter"
import { Cheatsheet, CheatsheetMeta } from "./types"

const CHEATSHEETS_DIR = path.join(process.cwd(), "../../docs/cheatsheets")

function parseCheatsheet(slug: string, raw: string): Cheatsheet {
  const { data, content } = matter(raw)

  const intro =
    typeof data.intro === "string"
      ? data.intro
      : typeof data.description === "string"
        ? data.description
        : null

  const description =
    intro ||
    content
      .replace(/^---[\s\S]*?---/, "")
      .replace(/\n#{1,6}\s.*$/gm, "")
      .replace(/```[\s\S]*?```/g, "")
      .replace(/\{:[^}]*\}/g, "")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/[*_`~>|#\-]/g, "")
      .split("\n")
      .map((l: string) => l.trim())
      .filter((l: string) => l.length > 0)
      .slice(0, 2)
      .join(" ")
      .slice(0, 200) || ""

  const updated = data.updated || data.lastUpdated || null
  const updatedStr = updated instanceof Date ? updated.toISOString().slice(0, 10) : typeof updated === "string" ? updated : null

  return {
    slug,
    title: data.title || slug,
    category: data.category || "Uncategorized",
    tags: Array.isArray(data.tags) ? data.tags : [],
    keywords: Array.isArray(data.keywords) ? data.keywords : [],
    updated: updatedStr,
    weight: typeof data.weight === "number" ? data.weight : 0,
    intro,
    description,
    content,
  }
}

let _cache: Cheatsheet[] | null = null

async function loadAll(): Promise<Cheatsheet[]> {
  if (_cache) return _cache

  const files = await fs.readdir(CHEATSHEETS_DIR)
  const mdFiles = files.filter(
    (f) => f.endsWith(".md") && f !== "index.md" && !f.includes("@")
  )

  const items = await Promise.all(
    mdFiles.map(async (filename) => {
      const slug = filename.replace(/\.md$/, "")
      const raw = await fs.readFile(path.join(CHEATSHEETS_DIR, filename), "utf-8")
      return parseCheatsheet(slug, raw)
    })
  )

  _cache = items.sort((a, b) => {
    if (a.weight !== b.weight) return a.weight - b.weight
    return a.title.localeCompare(b.title)
  })

  return _cache
}

export async function getAllCheatsheets(): Promise<CheatsheetMeta[]> {
  const all = await loadAll()
  return all.map(({ content: _, ...meta }) => meta)
}

export async function getCheatsheetBySlug(
  slug: string
): Promise<Cheatsheet | null> {
  const all = await loadAll()
  return all.find((c) => c.slug === slug) || null
}

export async function getUniqueCategories(): Promise<string[]> {
  const all = await loadAll()
  return [...new Set(all.map((c) => c.category))].sort()
}

export async function getCheatsheetCount(): Promise<number> {
  const all = await loadAll()
  return all.length
}
