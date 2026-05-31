"use client"

import { CollectionItem } from "@/lib/collections/types"
import { cn } from "@/lib/utils"
import { Calendar, Tag } from "lucide-react"

const sourceColors: Record<string, string> = {
  kimi: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  feishu: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  other: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
}

interface CollectionsListProps {
  items: CollectionItem[]
  activeId?: string
  onSelect: (id: string) => void
  onTagClick?: (tag: string) => void
}

export function CollectionsList({ items, activeId, onSelect, onTagClick }: CollectionsListProps) {
  return (
    <div className="flex flex-col gap-1 py-2">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          className={cn(
            "w-full text-left px-4 py-3 rounded-lg transition-colors border border-transparent",
            activeId === item.id
              ? "bg-secondary border-border"
              : "hover:bg-secondary/50"
          )}
        >
          {/* Source badge */}
          <div className="flex items-center gap-2 mb-1.5">
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
          <h3
            className={cn(
              "text-sm font-semibold leading-snug mb-1 line-clamp-2",
              activeId === item.id ? "text-foreground" : "text-foreground/90"
            )}
          >
            {item.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
            {item.description}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {item.date}
            </span>
          </div>

          {/* Tags */}
          {item.tags.length > 0 && (
            <div className="flex items-center gap-1 mt-1.5 flex-wrap">
              {item.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
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
        </button>
      ))}
    </div>
  )
}
