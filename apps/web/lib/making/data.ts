import { Issue, WeeklySummary, Project, IssueLabel, ProjectAnalysis, Insight, isBilingualText } from './types'

export { isBilingualText }

// Import JSON data directly for static export
import issuesData from '@/data/issues.json'
import weeklyData from '@/data/weekly.json'
import projectsData from '@/data/projects.json'
import insightsData from '@/data/insights.json'

// Export data directly from imported JSON
export const projects: Project[] = (issuesData as any).projects || []
export const issues: Issue[] = (issuesData as any).issues || []
export const weeklySummaries: WeeklySummary[] = (weeklyData as any).summaries || []
export const projectAnalyses: ProjectAnalysis[] = (projectsData as any).projects || []
export const insights: Insight[] = (insightsData as any).insights || []

// Helper functions
export function getProjectInfoById(id: string): Project | undefined {
  return projects.find(p => p.id === id)
}

export function getIssuesByProject(projectId: string): Issue[] {
  return issues.filter(i => i.project === projectId)
}

export function getOpenIssues(): Issue[] {
  return issues.filter(i => i.status === 'open')
}

export function getClosedIssues(): Issue[] {
  return issues.filter(i => i.status === 'closed')
}

export function getLatestIssues(limit: number = 5): Issue[] {
  return [...issues]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, limit)
}

export function getLatestWeeklies(limit: number = 4): WeeklySummary[] {
  return [...weeklySummaries]
    .sort((a, b) => new Date(b.dateRange.end).getTime() - new Date(a.dateRange.end).getTime())
    .slice(0, limit)
}

export function getWeeklyById(id: string): WeeklySummary | undefined {
  return weeklySummaries.find(w => w.id === id)
}

export function getIssuesForWeekly(weekly: WeeklySummary): Issue[] {
  return issues.filter(i => weekly.completedIssues.includes(i.id))
}

export function filterIssues(
  filters: {
    projects?: string[]
    status?: 'all' | 'open' | 'closed'
    labels?: string[]
  }
): Issue[] {
  return issues.filter(issue => {
    if (filters.projects?.length && !filters.projects.includes(issue.project)) {
      return false
    }
    if (filters.status && filters.status !== 'all' && issue.status !== filters.status) {
      return false
    }
    if (filters.labels?.length) {
      const issueLabelIds = issue.labels.map(l => l.id)
      if (!filters.labels.some(l => issueLabelIds.includes(l))) {
        return false
      }
    }
    return true
  })
}

export function getAllLabels(): IssueLabel[] {
  const labelMap = new Map<string, IssueLabel>()
  issues.forEach(issue => {
    issue.labels.forEach(label => {
      if (!labelMap.has(label.id)) {
        labelMap.set(label.id, label)
      }
    })
  })
  return Array.from(labelMap.values())
}

// Get issue by ID
export function getIssueById(id: string): Issue | undefined {
  return issues.find(i => i.id === id)
}

// Get issue by number and project
export function getIssueByNumber(project: string, number: number): Issue | undefined {
  return issues.find(i => i.project === project && i.number === number)
}

// Get project analysis by ID
export function getProjectById(id: string): ProjectAnalysis | undefined {
  return projectAnalyses.find(p => p.id === id)
}

// Get all projects with AGENTS.md
export function getProjectsWithAgents(): ProjectAnalysis[] {
  return projectAnalyses.filter(p => p.hasAgents)
}

// Get insight by ID
export function getInsightById(id: string): Insight | undefined {
  return insights.find(i => i.id === id)
}

// Get all insights sorted by date (newest first)
export function getAllInsights(): Insight[] {
  return [...insights].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}
