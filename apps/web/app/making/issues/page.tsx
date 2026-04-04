"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { 
  CheckSquare, 
  LayoutGrid, 
  List, 
  Filter,
  Circle
} from "lucide-react"
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  Badge,
  Input,
  cn
} from "@innate/ui"
import { 
  issues, 
  projects, 
  getAllLabels,
  filterIssues,
  type Issue,
  type ViewMode,
  type IssueFilter
} from "@/lib/making/data"
import { MarkdownRendererSimple } from "@/components/markdown-renderer"

export default function IssuesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('card')
  const [filters, setFilters] = useState<IssueFilter>({
    status: 'all',
    projects: [],
    labels: [],
  })
  const [searchQuery, setSearchQuery] = useState('')

  const allLabels = getAllLabels()

  const filteredIssues = useMemo(() => {
    let result = filterIssues(filters)
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(issue => 
        issue.title.toLowerCase().includes(query) ||
        issue.description.toLowerCase().includes(query)
      )
    }
    
    return result.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
  }, [filters, searchQuery])

  const issuesByProject = useMemo(() => {
    const grouped: Record<string, Issue[]> = {}
    filteredIssues.forEach(issue => {
      if (!grouped[issue.project]) {
        grouped[issue.project] = []
      }
      grouped[issue.project].push(issue)
    })
    return grouped
  }, [filteredIssues])

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-semibold">做什么</h1>
              <Badge variant="secondary" className="text-xs">
                {filteredIssues.length}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-muted rounded-lg p-0.5">
                <button
                  onClick={() => setViewMode('card')}
                  className={cn(
                    "p-1.5 rounded-md transition-colors",
                    viewMode === 'card' 
                      ? "bg-background shadow-sm text-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  title="Card view"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    "p-1.5 rounded-md transition-colors",
                    viewMode === 'list' 
                      ? "bg-background shadow-sm text-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  title="List view"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Input
                placeholder="Search issues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 text-sm pl-8"
              />
              <Filter className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>

            {/* Custom Select for Status */}
            <div className="relative">
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as 'all' | 'open' | 'closed' }))}
                className="h-8 w-[120px] text-xs rounded-md border border-input bg-transparent px-3 py-1 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Custom Select for Project */}
            <div className="relative">
              <select
                value={filters.projects?.[0] || 'all'}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  projects: e.target.value === 'all' ? [] : [e.target.value] 
                }))}
                className="h-8 min-w-[140px] max-w-[200px] text-xs rounded-md border border-input bg-transparent px-3 py-1 pr-8 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring font-medium"
              >
                <option value="all">📁 All Projects</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({issues.filter(i => i.project === p.id).length})
                  </option>
                ))}
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="h-4 w-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {Object.keys(issuesByProject).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <CheckSquare className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-medium text-foreground mb-1">
              No issues found
            </h3>
            <p className="text-xs text-muted-foreground">
              Try adjusting your filters
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(issuesByProject).map(([projectId, projectIssues]) => {
              const project = projects.find(p => p.id === projectId)
              return (
                <div key={projectId}>
                  {/* Project Header with Dropdown */}
                  <div className="flex items-center gap-2 mb-3">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: project?.color || '#888' }}
                    />
                    {/* Project Name with Dropdown */}
                    <div className="relative group">
                      <select
                        value={projectId}
                        onChange={(e) => {
                          const newProjectId = e.target.value
                          if (newProjectId !== projectId) {
                            setFilters(prev => ({ 
                              ...prev, 
                              projects: [newProjectId] 
                            }))
                          }
                        }}
                        className="h-7 text-sm font-medium bg-transparent border border-transparent hover:border-border rounded-md px-2 py-0.5 pr-6 appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-colors"
                      >
                        {projects.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({issues.filter(i => i.project === p.id).length})
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="h-3 w-3 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {projectIssues.length}
                    </Badge>
                  </div>

                  {/* Issues Grid/List */}
                  {viewMode === 'card' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {projectIssues.map(issue => (
                        <IssueCard key={issue.id} issue={issue} />
                      ))}
                    </div>
                  ) : (
                    <div className="border border-border rounded-lg overflow-hidden">
                      {projectIssues.map((issue, idx) => (
                        <IssueListItem 
                          key={issue.id} 
                          issue={issue} 
                          isLast={idx === projectIssues.length - 1}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function IssueCard({ issue }: { issue: Issue }) {
  const project = projects.find(p => p.id === issue.project)
  
  return (
    <Link href={`/making/issues/${issue.project}/${issue.number}`}>
      <Card className="group hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              {issue.status === 'closed' ? (
                <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckSquare className="h-3 w-3 text-green-500" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center">
                  <Circle className="h-2 w-2 text-muted-foreground" />
                </div>
              )}
              <span className="text-xs text-muted-foreground font-mono">
                #{issue.number}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {formatDate(issue.updatedAt)}
            </span>
          </div>
          <CardTitle className="text-sm font-medium mt-2 line-clamp-2">
            {issue.title}
          </CardTitle>
          {issue.description && (
            <div className="mt-2 line-clamp-3 text-xs text-muted-foreground">
              <MarkdownRendererSimple content={issue.description} />
            </div>
          )}
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-1">
            {issue.labels.slice(0, 3).map(label => (
              <Badge 
                key={label.id}
                variant="secondary"
                className="text-[10px] px-1.5 py-0"
                style={{ 
                  backgroundColor: `${label.color}20`,
                  color: label.color,
                  borderColor: `${label.color}40`,
                }}
              >
                {label.name}
              </Badge>
            ))}
            {issue.labels.length > 3 && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                +{issue.labels.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function IssueListItem({ issue, isLast }: { issue: Issue; isLast: boolean }) {
  return (
    <Link href={`/making/issues/${issue.project}/${issue.number}`}>
      <div className={cn(
        "flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer",
        !isLast && "border-b border-border"
      )}>
        {issue.status === 'closed' ? (
          <CheckSquare className="h-4 w-4 text-green-500 shrink-0" />
        ) : (
          <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-mono shrink-0">
              #{issue.number}
            </span>
            <span className="text-sm font-medium truncate">{issue.title}</span>
          </div>
          {issue.description && (
            <div className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
              <MarkdownRendererSimple content={issue.description} />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex gap-1">
            {issue.labels.slice(0, 2).map(label => (
              <Badge 
                key={label.id}
                variant="secondary"
                className="text-[10px] px-1.5 py-0"
                style={{ 
                  backgroundColor: `${label.color}20`,
                  color: label.color,
                }}
              >
                {label.name}
              </Badge>
            ))}
          </div>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {formatDate(issue.updatedAt)}
          </span>
        </div>
      </div>
    </Link>
  )
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
