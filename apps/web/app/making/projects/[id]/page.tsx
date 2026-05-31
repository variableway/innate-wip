import Link from "next/link"
import { notFound } from "next/navigation"
import { 
  ArrowLeft,
  FolderGit2,
  Star,
  AlertTriangle,
  Zap,
  Lightbulb,
  Github,
  ExternalLink,
  FileText,
  CheckCircle2
} from "lucide-react"
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  Badge,
  Button,
  Separator,
  cn
} from "@innate/ui"
import { getProjectById, projectAnalyses } from "@/lib/making/data"
import { extractToc } from "@/lib/content/parser"
import { ServerMarkdown } from "@/components/server-markdown"
import { TableOfContents } from "@/components/table-of-contents"

interface PageProps {
  params: Promise<{ id: string }>
}

// Generate static params for all projects
export function generateStaticParams() {
  return projectAnalyses.map((project) => ({
    id: project.id,
  }))
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params
  const project = getProjectById(id)

  if (!project) {
    notFound()
  }

  const toc = extractToc(project.rawContent || '')

  return (
    <div className="h-full flex">
      {/* Left: Project Navigation */}
      <div className="w-64 border-r border-border bg-muted/30 flex flex-col shrink-0">
        <div className="p-4 border-b border-border">
          <Link 
            href="/making/projects"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-3"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to projects
          </Link>
          <div className="flex items-center gap-2">
            <FolderGit2 className="h-4 w-4 text-blue-500" />
            <h1 className="font-semibold text-sm truncate">{project.name}</h1>
          </div>
          {project.hasAgents && (
            <Badge variant="outline" className="text-xs mt-2 text-green-600 border-green-200">
              AGENTS
            </Badge>
          )}
        </div>

        {/* Project Navigation */}
        <div className="flex-1 p-2 space-y-1 overflow-y-auto">
          <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
            All Projects
          </div>
          {projectAnalyses.map((p) => (
            <Link
              key={p.id}
              href={`/making/projects/${p.id}`}
              className={cn(
                "block px-3 py-2 rounded-lg text-sm transition-colors",
                p.id === project.id
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="truncate">{p.name}</span>
                {p.id === project.id && (
                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* External Link */}
        {project.repoUrl && (
          <div className="p-3 border-t border-border">
            <a 
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" />
              <span>View on GitHub</span>
              <ExternalLink className="h-3 w-3 ml-auto" />
            </a>
          </div>
        )}
      </div>

      {/* Right: Content */}
      <div className="flex-1 overflow-y-auto bg-background">
        <div className="max-w-5xl mx-auto p-6">
          {/* Header */}
          <div className="mb-8 pb-6 border-b border-border">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FolderGit2 className="h-5 w-5 text-blue-500" />
                  {project.hasAgents ? (
                    <Badge variant="outline" className="text-xs font-bold text-green-600 border-green-200">
                      AGENTS
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs text-muted-foreground">
                      No docs
                    </Badge>
                  )}
                </div>
                <h2 className="text-2xl font-bold">{project.name}</h2>
                {project.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {project.description}
                  </p>
                )}
              </div>
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm">
                    <Github className="h-4 w-4 mr-2" />
                    GitHub
                  </Button>
                </a>
              )}
            </div>
          </div>

          {/* AI Analysis Section */}
          {project.hasAgents && (
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Zap className="h-3.5 w-3.5 text-blue-500" />
                </div>
                <h3 className="text-sm font-bold">AI Project Analysis</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Summary */}
                <Card className="border-t-4 border-t-blue-500 shadow-sm md:col-span-3">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-500" />
                      <CardTitle className="text-sm font-bold">Summary</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {project.summary}
                    </p>
                  </CardContent>
                </Card>

                {/* Strengths */}
                <Card className="border-t-4 border-t-green-500 shadow-sm">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-green-500" />
                      <CardTitle className="text-sm font-bold">Strengths</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {project.strengths && project.strengths.length > 0 ? (
                      <ul className="space-y-2">
                        {project.strengths.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        No records
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Weaknesses */}
                <Card className="border-t-4 border-t-orange-500 shadow-sm">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      <CardTitle className="text-sm font-bold">Areas for Improvement</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {project.weaknesses && project.weaknesses.length > 0 ? (
                      <ul className="space-y-2">
                        {project.weaknesses.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <AlertTriangle className="h-3.5 w-3.5 text-orange-500 shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        No records
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Features */}
                <Card className="border-t-4 border-t-purple-500 shadow-sm">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-purple-500" />
                      <CardTitle className="text-sm font-bold">Key Features</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {project.features && project.features.length > 0 ? (
                      <ul className="space-y-2">
                        {project.features.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="text-purple-500 shrink-0">•</span>
                            <span className="leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        No records
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </section>
          )}

          {/* AGENTS.md Content - Direct Markdown Rendering */}
          {project.rawContent && (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-8">
              <section>
                <ServerMarkdown content={project.rawContent} />
              </section>
              <aside>
                <TableOfContents headings={toc} />
              </aside>
            </div>
          )}

          {!project.hasAgents && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No AGENTS.md file
              </h3>
              <p className="text-sm text-muted-foreground">
                This project has not created an AGENTS.md file
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
