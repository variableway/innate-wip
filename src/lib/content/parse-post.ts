import { extractToc, parseFrontmatter } from "./parser"
import type { PostMeta } from "./types"

export interface WritingPost extends PostMeta {
  slug: string
  type: "md" | "mdx"
  content: string
  toc: Array<{ id: string; text: string; level: number }>
}

/** `.../content/demo/nested/deep/note.md` → `demo/nested/deep/note.md` */
export function contentRelativePath(filePath: string): string {
  const normalized = filePath.replace(/\\/g, "/")
  const marker = "/content/"
  const writingMarker = "/content/writing/"
  if (normalized.includes(writingMarker)) {
    return normalized.slice(normalized.lastIndexOf(writingMarker) + writingMarker.length)
  }
  const idx = normalized.lastIndexOf(marker)
  if (idx >= 0) return normalized.slice(idx + marker.length)
  return normalized.split("/").pop() ?? "untitled.md"
}

export function fallbackSlug(filePath: string): string {
  return contentRelativePath(filePath)
    .replace(/\.(md|mdx)$/i, "")
    .replace(/\/+/g, "-")
}

function folderCategory(filePath: string): string {
  const folders = contentRelativePath(filePath).split("/").slice(0, -1)
  return folders[0] ?? ""
}

export function parseWritingFile(filePath: string, raw: string): WritingPost {
  const name = filePath.split(/[/\\]/).pop() ?? "untitled.md"
  const type: "md" | "mdx" = name.endsWith(".mdx") ? "mdx" : "md"
  const { meta, body } = parseFrontmatter(raw)
  return {
    ...meta,
    slug: meta.slug || fallbackSlug(filePath),
    category: meta.category || folderCategory(filePath) || "article",
    type,
    content: body,
    toc: extractToc(body),
  }
}

export function sortPostsByDate(posts: WritingPost[]): WritingPost[] {
  return [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}
