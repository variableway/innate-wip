"use client"

import Link from "next/link"
import { 
  FolderGit2,
  ChevronRight,
  Star,
  AlertTriangle,
  ExternalLink,
  Github
} from "lucide-react"
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  Badge,
  Button,
  cn
} from "@innate/ui"
import { projectAnalyses } from "@/lib/making/data"

export default function ProjectsPage() {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center gap-2">
            <FolderGit2 className="h-5 w-5 text-blue-500" />
            <h1 className="text-lg font-semibold">Projects</h1>
            <Badge variant="secondary" className="text-xs">
              {projectAnalyses.length}
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projectAnalyses.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ProjectCard({ project }: { project: typeof projectAnalyses[0] }) {
  return (
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
            <Link href={`/making/projects/${project.id}`}>
              <CardTitle className="text-base group-hover:text-primary transition-colors font-bold truncate">
                {project.name}
              </CardTitle>
            </Link>
          </div>
          <div className="flex items-center gap-1">
            {project.repoUrl && (
              <a 
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Github className="h-4 w-4 text-muted-foreground" />
              </a>
            )}
            <Link href={`/making/projects/${project.id}`}>
              <div className="p-2 rounded-lg hover:bg-muted transition-colors">
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </Link>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-3">
        {/* Summary */}
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {project.summary}
        </p>

        {/* Features */}
        {project.features && project.features.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {project.features.slice(0, 3).map((feature, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {feature}
              </Badge>
            ))}
            {project.features.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{project.features.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Quick Stats */}
        <div className="flex items-center gap-4 pt-3 border-t border-border">
          <div className="flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5 text-yellow-500" />
            <span className="text-xs text-muted-foreground">
              {project.strengths?.length || 0} strengths
            </span>
          </div>
          {project.weaknesses && project.weaknesses.length > 0 && (
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
  )
}
