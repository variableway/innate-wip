export interface CheatsheetMeta {
  slug: string
  title: string
  category: string
  tags: string[]
  keywords: string[]
  updated: string | null
  weight: number
  intro: string | null
  description: string
}

export interface Cheatsheet extends CheatsheetMeta {
  content: string
}

export type ViewMode = "card" | "list"
