"use client"

import { cn } from "@/lib/utils"
import { Tag } from "lucide-react"

export interface BlogListItem {
  slug: string
  title: string
  excerpt: string
  date: string
  category: string
  tags: string[]
  readingTime: number
}

interface BlogListProps {
  items: BlogListItem[]
  activeSlug?: string
  onSelect: (slug: string) => void
  onTagClick?: (tag: string) => void
}

const categoryColors: Record<string, { bg: string; text: string }> = {
  thought: {
    bg: "bg-blue-500/8",
    text: "text-blue-600 dark:text-blue-400",
  },
  insight: {
    bg: "bg-amber-500/8",
    text: "text-amber-600 dark:text-amber-400",
  },
  log: {
    bg: "bg-green-500/8",
    text: "text-green-600 dark:text-green-400",
  },
  article: {
    bg: "bg-purple-500/8",
    text: "text-purple-600 dark:text-purple-400",
  },
}

export function BlogList({ items, activeSlug, onSelect, onTagClick }: BlogListProps) {
  const colors = (cat: string) =>
    categoryColors[cat] || {
      bg: "bg-muted",
      text: "text-muted-foreground",
    }

  return (
    <div className="flex flex-col gap-0.5 py-2">
      {items.map((item) => {
        const isActive = activeSlug === item.slug
        const catColors = colors(item.category)

        return (
          <button
            key={item.slug}
            onClick={() => onSelect(item.slug)}
            className={cn(
              "group w-full text-left rounded-xl transition-all duration-150 border",
              isActive
                ? "bg-card border-border shadow-sm"
                : "bg-transparent border-transparent hover:bg-card/60 hover:border-border/50"
            )}
          >
            {/* Active indicator bar */}
            <div className="flex">
              <div
                className={cn(
                  "w-1 shrink-0 rounded-l-xl transition-colors duration-150",
                  isActive ? "bg-[#8FA68E]" : "bg-transparent group-hover:bg-[#8FA68E]/30"
                )}
              />
              <div className="flex-1 px-3.5 py-2.5 min-w-0">
                {/* Title */}
                <h3
                  className={cn(
                    "text-sm font-semibold leading-snug line-clamp-1 transition-colors",
                    isActive ? "text-foreground" : "text-foreground/85 group-hover:text-foreground"
                  )}
                >
                  {item.title}
                </h3>

                {/* Excerpt + meta row (single line) */}
                <div className="flex items-center gap-2 mt-1 min-w-0">
                  {/* Short excerpt */}
                  {item.excerpt && (
                    <span className="text-xs text-muted-foreground/60 truncate shrink">
                      {item.excerpt}
                    </span>
                  )}

                  {/* Divider */}
                  <span className="text-muted-foreground/20 shrink-0">·</span>

                  {/* Category tag */}
                  <span
                    className={cn(
                      "text-[10px] font-medium px-1.5 py-0.5 rounded shrink-0",
                      catColors.bg,
                      catColors.text
                    )}
                  >
                    {item.category}
                  </span>

                  {/* Date */}
                  <span className="text-[10px] text-muted-foreground/50 shrink-0 tabular-nums">
                    {item.date}
                  </span>

                  {/* Tags */}
                  {item.tags.length > 0 && (
                    <div className="flex items-center gap-1 shrink-0">
                      {item.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground/50 bg-muted/50 px-1.5 py-0.5 rounded hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation()
                            onTagClick?.(tag)
                          }}
                        >
                          <Tag className="h-2 w-2" />
                          {tag}
                        </span>
                      ))}
                      {item.tags.length > 2 && (
                        <span className="text-[10px] text-muted-foreground/30">
                          +{item.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
