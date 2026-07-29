import {
  BookOpen,
  Calendar,
  CheckSquare,
  FileText,
  FolderGit2,
  Hammer,
  Lightbulb,
  Tag,
  type LucideIcon,
} from "lucide-react"

const iconMap: Record<string, LucideIcon> = {
  hammer: Hammer,
  "folder-git-2": FolderGit2,
  calendar: Calendar,
  lightbulb: Lightbulb,
  "check-square": CheckSquare,
  "file-text": FileText,
  "book-open": BookOpen,
  tag: Tag,
}

export function PluginIcon({
  name,
  className = "h-3.5 w-3.5 shrink-0",
}: {
  name?: string
  className?: string
}) {
  const Icon = (name && iconMap[name]) || Tag
  return <Icon className={className} />
}
