"use client"

import { useRouter } from "next/navigation"
import { projects, getIssuesByProject } from "@/lib/making/data"

interface ProjectSwitcherProps {
  currentProjectId: string
  projects: typeof projects
  currentProject?: typeof projects[0]
}

export function ProjectSwitcher({ currentProjectId, projects, currentProject }: ProjectSwitcherProps) {
  const router = useRouter()

  const handleProjectChange = (newProjectId: string) => {
    if (newProjectId === currentProjectId) return
    
    // Get first issue of the new project
    const newProjectIssues = getIssuesByProject(newProjectId)
    if (newProjectIssues.length > 0) {
      const firstIssue = newProjectIssues[0]
      router.push(`/making/issues/${firstIssue.project}/${firstIssue.number}`)
    } else {
      // If no issues, go back to issues list
      router.push("/making/issues")
    }
  }

  return (
    <div className="flex items-center gap-2">
      <div 
        className="w-3 h-3 rounded-full shrink-0"
        style={{ backgroundColor: currentProject?.color || '#888' }}
      />
      <div className="relative flex-1 min-w-0">
        <select
          value={currentProjectId}
          onChange={(e) => handleProjectChange(e.target.value)}
          className="w-full h-7 text-sm font-medium bg-transparent border border-transparent hover:border-border rounded-md px-2 py-0.5 pr-6 appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring transition-colors truncate"
        >
          {projects.map(p => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <div className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="h-3 w-3 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  )
}
