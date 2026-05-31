export interface AwesomeCategory {
  slug: string
  name: string
  description: string
  icon: string
  color: string
}

export interface AwesomeItem {
  slug: string
  name: string
  description: string
  category: string
  isLocal: boolean
  repoUrl: string | null
  installCommand: string | null
  tags: string[]
  shortDescription?: string
}

export interface AwesomeSource {
  id: string
  name: string
  repo: string
  description: string
  addedDate: string
  lastSynced: string
}

export interface AwesomeData {
  source: AwesomeSource
  items: AwesomeItem[]
}
