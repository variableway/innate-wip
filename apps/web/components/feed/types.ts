export interface FeedPost {
  slug: string
  title: string
  summary: string
  date: string
  author: {
    name: string
    avatar?: string
    role?: string
  }
  category: string
  tags: string[]
  readTime?: number
  isEditorsPick?: boolean
}

export type FeedFilterType = "all" | "editors-pick" | string
