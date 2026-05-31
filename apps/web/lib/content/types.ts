export interface PostMeta {
  title: string
  slug: string
  date: string
  updated?: string
  author: string
  category: string
  tags: string[]
  excerpt?: string
  cover?: string
  featured?: boolean
  editorsPick?: boolean
  readingTime?: number
  status: 'published' | 'draft' | 'archived'
}

export interface ParsedPost {
  meta: PostMeta
  content: string
  html: string
}

export interface Author {
  name: string
  avatar: string
  bio?: string
  social?: {
    twitter?: string
    github?: string
  }
}
