import Link from "next/link"
import { notFound } from "next/navigation"
import { 
  ArrowLeft, 
  CheckSquare, 
  Circle, 
  Calendar, 
  Tag, 
  ExternalLink,
  User
} from "lucide-react"
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  CardDescription,
  Badge,
  Separator,
  Button,
  cn
} from "@innate/ui"
import { 
  issues, 
  projects, 
  weeklySummaries, 
  getIssuesByProject,
  getIssueByNumber
} from "@/lib/making/data"
import { ServerMarkdown } from "@/components/server-markdown"
import { ProjectSwitcher } from "./project-switcher"

// Generate static params for all issues
export function generateStaticParams() {
  return issues.map(issue => ({
    project: issue.project,
    number: issue.number.toString(),
  }))
}

interface PageProps {
  params: Promise<{ project: string; number: string }>
}

export default async function IssueDetailPage({ params }: PageProps) {
  const { project: projectId, number } = await params
  const issueNumber = parseInt(number, 10)
  
  const issue = getIssueByNumber(projectId, issueNumber)
  const project = projects.find(p => p.id === projectId)
  
  if (!issue) {
    notFound()
  }

  // Find related weekly summaries
  const relatedWeeklies = weeklySummaries.filter(w => 
    w.completedIssues.includes(issue.id)
  )

  // Get related issues from same project
  const relatedIssues = getIssuesByProject(projectId)
    .filter(i => i.id !== issue.id)
    .slice(0, 5)

  return (
    <div className="h-full flex">
      {/* Left: Issue Navigation */}
      <div className="w-64 border-r border-border bg-card/30 flex flex-col shrink-0">
        <div className="p-4 border-b border-border">
          <Link 
            href="/making/issues"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-3"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to issues
          </Link>
          
          {/* Project Switcher */}
          <ProjectSwitcher 
            currentProjectId={projectId} 
            projects={projects}
            currentProject={project}
          />
          
          <p className="text-xs text-muted-foreground mt-2">
            #{issue.number}
          </p>
        </div>

        {/* Related Issues */}
        <div className="flex-1 p-2 overflow-y-auto">
          <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Related Issues
          </div>
          <div className="space-y-1">
            {relatedIssues.map((relatedIssue) => (
              <Link
                key={relatedIssue.id}
                href={`/making/issues/${relatedIssue.project}/${relatedIssue.number}`}
                className={cn(
                  "block px-3 py-2 rounded-lg text-sm transition-colors",
                  relatedIssue.id === issue.id
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <div className="flex items-start gap-2">
                  {relatedIssue.status === 'closed' ? (
                    <CheckSquare className="h-3.5 w-3.5 text-green-500 shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                  )}
                  <span className="line-clamp-2">{relatedIssue.title}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  #{relatedIssue.number}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              {issue.status === 'closed' ? (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 text-green-600 rounded-full text-xs font-medium">
                  <CheckSquare className="h-3.5 w-3.5" />
                  Closed
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 text-green-600 rounded-full text-xs font-medium">
                  <Circle className="h-3.5 w-3.5" />
                  Open
                </div>
              )}
              <span className="text-xs text-muted-foreground">
                {project?.name || projectId} #{issue.number}
              </span>
            </div>
            
            <h1 className="text-xl font-semibold mb-4">{issue.title}</h1>
            
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                <span>{issue.author || 'Unknown'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>Created {formatDate(issue.createdAt)}</span>
              </div>
              {issue.closedAt && (
                <div className="flex items-center gap-1.5">
                  <CheckSquare className="h-4 w-4 text-green-500" />
                  <span>Closed {formatDate(issue.closedAt)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Labels */}
          {issue.labels.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Labels</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {issue.labels.map(label => (
                  <Badge 
                    key={label.id}
                    variant="secondary"
                    className="text-xs"
                    style={{ 
                      backgroundColor: `${label.color}20`,
                      color: label.color,
                      borderColor: `${label.color}40`,
                    }}
                  >
                    {label.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Issue Content - Direct Markdown Rendering */}
          <section className="mb-8">
            {issue.description ? (
              <ServerMarkdown content={issue.description} />
            ) : (
              <p className="text-muted-foreground italic">No description provided</p>
            )}
          </section>

          {/* Related Weekly Summaries */}
          {relatedWeeklies.length > 0 && (
            <section className="mb-8">
              <h2 className="text-sm font-medium mb-4">Completed In</h2>
              <div className="space-y-2">
                {relatedWeeklies.map(weekly => (
                  <Link key={weekly.id} href={`/making/weekly/${weekly.id}`}>
                    <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                      <CardContent className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-4 w-4 text-primary" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{weekly.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {weekly.dateRange.start} ~ {weekly.dateRange.end}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* External Link */}
          {issue.url && (
            <section>
              <a 
                href={issue.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on GitHub
                </Button>
              </a>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}
