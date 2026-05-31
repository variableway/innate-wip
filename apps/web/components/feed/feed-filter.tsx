"use client"

import { cn } from "@/lib/utils"
import { FeedFilterType } from "./types"
import { Newspaper, FileText, Bookmark, Star, LayoutGrid } from "lucide-react"

interface FeedFilterProps {
  currentFilter: FeedFilterType
  onFilterChange: (filter: FeedFilterType) => void
  categories?: string[]
}

const iconMap: Record<string, React.ReactNode> = {
  all: <LayoutGrid className="h-4 w-4" />,
  article: <Newspaper className="h-4 w-4" />,
  log: <FileText className="h-4 w-4" />,
  news: <Bookmark className="h-4 w-4" />,
  "editors-pick": <Star className="h-4 w-4" />,
}

function getFilterLabel(id: string): string {
  if (id === "all") return "All"
  if (id === "editors-pick") return "Editor's Pick"
  return id.charAt(0).toUpperCase() + id.slice(1)
}

function getFilterIcon(id: string): React.ReactNode {
  return iconMap[id] || <FileText className="h-4 w-4" />
}

export function FeedFilter({ currentFilter, onFilterChange, categories = [] }: FeedFilterProps) {
  const filters: FeedFilterType[] = ["all", ...categories.filter((c) => c !== "all"), "editors-pick"]

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
            currentFilter === filter
              ? "bg-[#8FA68E] text-white shadow-md"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
        >
          {getFilterIcon(filter)}
          {getFilterLabel(filter)}
        </button>
      ))}
    </div>
  )
}
