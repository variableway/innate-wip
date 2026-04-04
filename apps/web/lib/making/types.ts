// Types for Making module - Issues and Weekly Summaries

export interface IssueLabel {
  id: string
  name: string
  color: string
  description?: string
}

export interface Issue {
  id: string
  number: number
  title: string
  description: string
  status: 'open' | 'closed'
  project: string
  projectIcon?: string
  labels: IssueLabel[]
  createdAt: string
  updatedAt: string
  closedAt?: string
  url?: string
  author?: string
}

// Bilingual text support
export interface BilingualText {
  zh: string
  en: string
}

export interface WeeklyEvaluation {
  strengths: string[] | BilingualText[]
  weaknesses: string[] | BilingualText[]
  improvements: string[] | BilingualText[]
}

export interface WeeklyMindset {
  strengths: string[] | BilingualText[]
  weaknesses: string[] | BilingualText[]
  suggestions: string[] | BilingualText[]
}

export interface WeeklySummary {
  id: string
  weekNumber: number
  year: number
  title: string
  titleZh?: string
  dateRange: {
    start: string
    end: string
  }
  summary: string
  summaryZh?: string
  completedIssues: string[] // issue ids
  evaluations: WeeklyEvaluation
  mindsetAnalysis: WeeklyMindset
  createdAt: string
  updatedAt: string
}

export interface Project {
  id: string
  name: string
  description?: string
  icon?: string
  color?: string
  repoUrl?: string
}

export type ViewMode = 'card' | 'list'

export type IssueFilter = {
  projects?: string[]
  labels?: string[]
  status?: 'all' | 'open' | 'closed'
  dateRange?: {
    start?: string
    end?: string
  }
}

// Project with AGENTS.md analysis
export interface ProjectAnalysis {
  id: string
  name: string
  description?: string
  repoUrl?: string
  hasAgents: boolean
  agentsPath?: string
  summary: string
  features: string[]
  strengths: string[]
  weaknesses: string[]
  rawContent?: string
  error?: string
}

export interface ProjectsData {
  projects: ProjectAnalysis[]
  lastUpdated: string
}

// Insight/收获 - Practice reports and analysis
export interface Insight {
  id: string
  title: string
  date: string
  summary: string
  category: 'practice' | 'analysis' | 'guide'
  content: string  // Embedded markdown content for static export
}

export interface InsightsData {
  insights: Insight[]
  lastUpdated: string
}

// Helper type guard for bilingual text
export function isBilingualText(item: string | BilingualText): item is BilingualText {
  return typeof item === 'object' && 'zh' in item && 'en' in item
}
