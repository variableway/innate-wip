"use client"

import { cn } from "@allone/utils"
import { Calendar, Clock, Tag } from "lucide-react"

export interface WritingListItem {
  slug: string
  title: string
  excerpt: string
  date: string
  category: string
  tags: string[]
  readingTime: number
}

interface WritingListProps {
  items: WritingListItem[]
  activeSlug?: string
  onSelect: (slug: string) => void
}

const categoryColors: Record<string, string> = {
  thought: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  insight: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  log: "bg-green-500/10 text-green-600 dark:text-green-400",
  article: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
}

export function WritingList({ items, activeSlug, onSelect }: WritingListProps) {
  return (
    <div className="flex flex-col gap-1 py-2">
      {items.map((item) => (
        <button
          key={item.slug}
          onClick={() => onSelect(item.slug)}
          className={cn(
            "w-full text-left px-4 py-3 rounded-lg transition-colors border border-transparent",
            activeSlug === item.slug
              ? "bg-secondary border-border"
              : "hover:bg-secondary/50"
          )}
        >
          {/* Category badge */}
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className={cn(
                "text-[10px] font-medium px-1.5 py-0.5 rounded uppercase tracking-wide",
                categoryColors[item.category] || "bg-muted text-muted-foreground"
              )}
            >
              {item.category}
            </span>
          </div>

          {/* Title */}
          <h3
            className={cn(
              "text-sm font-semibold leading-snug mb-1 line-clamp-2",
              activeSlug === item.slug ? "text-foreground" : "text-foreground/90"
            )}
          >
            {item.title}
          </h3>

          {/* Excerpt */}
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
            {item.excerpt}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {item.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {item.readingTime} min
            </span>
          </div>

          {/* Tags */}
          {item.tags.length > 0 && (
            <div className="flex items-center gap-1 mt-1.5 flex-wrap">
              {item.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded"
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
