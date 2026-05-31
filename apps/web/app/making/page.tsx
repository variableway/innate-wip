"use client"

import Link from "next/link"
import { 
  ArrowRight, 
  CheckSquare, 
  Calendar, 
  Sparkles, 
  TrendingUp,
  AlertCircle,
  Lightbulb,
  Brain,
  Zap,
  MessageSquare,
  ChevronRight,
  FolderGit2,
  Star,
  AlertTriangle
} from "lucide-react"
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  CardDescription,
  Badge,
  Button,
  Separator,
  cn
} from "@innate/ui"
import { getLatestWeeklies, getIssuesForWeekly, projects, isBilingualText, projectAnalyses } from "@/lib/making/data"

export default function MakingPage() {
  const recentWeeklies = getLatestWeeklies(4)

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto p-6">
        {/* Hero Section */}
        <section className="mb-10 py-8 px-6 bg-gradient-to-br from-muted/50 to-background rounded-2xl border border-border/50">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold mb-4">
              Making
            </h1>
            <p className="text-xl text-muted-foreground font-medium mb-2">
              What drives you and what you make, makes you.
            </p>
            <p className="text-base text-muted-foreground/80 leading-relaxed">
              Track your creative process, monitor project progress, and reflect on your growth journey.
              AI-powered weekly analysis helps discover strengths and areas for improvement.
            </p>
            <div className="flex gap-3 mt-6">
              <Link href="/making/issues">
                <Button className="font-bold">
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Issues
                </Button>
              </Link>
              <Link href="/making/weekly">
                <Button variant="outline" className="font-bold">
                  <Calendar className="h-4 w-4 mr-2" />
                  Weekly
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <FolderGit2 className="h-4 w-4 text-blue-500" />
              </div>
              <h2 className="text-lg font-bold">Projects</h2>
              <Badge variant="secondary" className="text-xs">
                {projectAnalyses.length}
              </Badge>
            </div>
            <Link 
              href="/making/projects"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View all
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projectAnalyses.slice(0, 4).map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>

        {/* Weekly Analysis Section */}
        {recentWeeklies.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Brain className="h-4 w-4 text-primary" />
                </div>
                <h2 className="text-lg font-bold">Weekly Analysis</h2>
              </div>
              {recentWeeklies.length >= 4 && (
                <Link 
                  href="/making/weekly"
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  View more
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentWeeklies.map(weekly => (
                <WeeklyCard key={weekly.id} weekly={weekly} />
              ))}
            </div>
          </section>
        )}

        {/* Quick Stats */}
        <section>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <h2 className="text-lg font-bold">Quick Nav</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/making/issues">
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer group h-full">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <CheckSquare className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base group-hover:text-primary transition-colors">
                        Issues
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        View all active and completed issues
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/making/weekly">
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer group h-full">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                      <Calendar className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base group-hover:text-primary transition-colors">
                        Weekly
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        AI analysis of weekly work and mindset growth
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

function ProjectCard({ project }: { project: typeof projectAnalyses[0] }) {
  return (
    <Link href={`/making/projects/${project.id}`}>
      <Card className="hover:shadow-md transition-all cursor-pointer group h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <FolderGit2 className="h-4 w-4 text-blue-500" />
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
              <CardTitle className="text-base group-hover:text-primary transition-colors font-bold truncate">
                {project.name}
              </CardTitle>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 space-y-3">
          {/* Summary */}
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {project.summary}
          </p>

          {/* Quick Stats */}
          <div className="flex items-center gap-4 pt-3 border-t border-border">
            <div className="flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 text-yellow-500" />
              <span className="text-xs text-muted-foreground">
                {project.strengths.length} strengths
              </span>
            </div>
            {project.weaknesses.length > 0 && (
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-orange-500" />
                <span className="text-xs text-muted-foreground">
                  {project.weaknesses.length} improvements
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function WeeklyCard({ weekly }: { weekly: ReturnType<typeof getLatestWeeklies>[0] }) {
  const completedIssues = getIssuesForWeekly(weekly)
  const mainProject = completedIssues[0]?.project
  const project = projects.find(p => p.id === mainProject)

  // Get bilingual text helper
  const getText = (text: string | { zh: string; en: string }): string => {
    if (isBilingualText(text)) {
      return text.zh
    }
    return text
  }

  return (
    <Link href={`/making/weekly/${weekly.id}`}>
      <Card className="hover:shadow-md transition-all cursor-pointer group h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Badge variant="outline" className="text-xs font-bold">
                  Week {weekly.weekNumber}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {weekly.dateRange.start} ~ {weekly.dateRange.end}
                </span>
              </div>
              <CardTitle className="text-base group-hover:text-primary transition-colors font-bold">
                {weekly.titleZh || weekly.title}
              </CardTitle>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 space-y-3">
          {/* Summary */}
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {weekly.summaryZh || weekly.summary}
          </p>

          {/* Quick Stats */}
          <div className="flex items-center gap-4 pt-3 border-t border-border">
            <div className="flex items-center gap-1.5">
              <CheckSquare className="h-3.5 w-3.5 text-green-500" />
              <span className="text-xs text-muted-foreground">
                {completedIssues.length} issues
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-purple-500" />
              <span className="text-xs text-muted-foreground">
                {Array.isArray(weekly.evaluations.strengths) ? weekly.evaluations.strengths.length : 0} strengths
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
