"use client"

import { CollectionItem } from "@/lib/collections/types"
import { cn } from "@allone/utils"
import { Calendar, Tag, ExternalLink } from "lucide-react"

const sourceColors: Record<string, string> = {
  kimi: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  feishu: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  other: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
}

interface CollectionsCardGridProps {
  items: CollectionItem[]
  onSelect: (id: string) => void
  onTagClick?: (tag: string) => void
}

export function CollectionsCardGrid({ items, onSelect, onTagClick }: CollectionsCardGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          className="text-left border border-border rounded-lg p-4 hover:bg-secondary/50 hover:border-border/80 transition-colors group"
        >
          {/* Source + Category badges */}
          <div className="flex items-center gap-2 mb-2">
            <span
              className={cn(
                "text-[10px] font-medium px-1.5 py-0.5 rounded uppercase tracking-wide",
                sourceColors[item.source] || "bg-muted text-muted-foreground"
              )}
            >
              {item.source}
            </span>
            <span className="text-[10px] text-muted-foreground px-1.5 py-0.5 rounded bg-muted">
              {item.category}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-sm font-semibold text-foreground mb-1.5 line-clamp-1 group-hover:text-primary transition-colors">
            {item.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
            {item.description}
          </p>

          {/* Footer: date + tags */}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {item.date}
            </span>
            {item.tags.length > 0 && (
              <div className="flex items-center gap-1">
                {item.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded"
                    onClick={(e) => {
                      e.stopPropagation()
                      onTagClick?.(tag)
                    }}
                  >
                    <Tag className="h-2.5 w-2.5" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  )
}
