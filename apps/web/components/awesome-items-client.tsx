"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Copy, Check, Search, Tag, Github, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import type { AwesomeItem, AwesomeCategory } from "@/lib/awesome/types"
import {
  Code,
  Briefcase,
  MessageSquare,
  BarChart3,
  Settings,
} from "lucide-react"

const iconMap: Record<string, React.ReactNode> = {
  code: <Code className="h-4 w-4" />,
  briefcase: <Briefcase className="h-4 w-4" />,
  "message-square": <MessageSquare className="h-4 w-4" />,
  "bar-chart": <BarChart3 className="h-4 w-4" />,
  settings: <Settings className="h-4 w-4" />,
}

interface AwesomeItemsClientProps {
  items: (AwesomeItem & { sourceName: string })[]
  categories: AwesomeCategory[]
}

export function AwesomeItemsClient({ items, categories }: AwesomeItemsClientProps) {
  const [query, setQuery] = useState("")
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (!query.trim()) return items
    const q = query.toLowerCase()
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q))
    )
  }, [items, query])

  const handleCopy = async (e: React.MouseEvent, text: string, slug: string) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(text)
      setCopiedSlug(slug)
      setTimeout(() => setCopiedSlug(null), 2000)
    } catch {
      // ignore
    }
  }

  return (
    <div className="space-y-5">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
        <input
          type="text"
          placeholder="Search tools, skills, tags..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-10 pl-9 pr-4 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-[#8FA68E]/30 focus:border-[#8FA68E]/40 transition-all"
        />
        {query && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground/50">
            {filtered.length}
          </span>
        )}
      </div>

      {/* Items Grid — 3 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => {
          const category = categories.find((c) => c.slug === item.category)
          const linkUrl = item.repoUrl || undefined

          const cardContent = (
            <>
              {/* Header: icon + name + badges */}
              <div className="flex items-start gap-3">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                  style={{
                    backgroundColor: category ? `${category.color}15` : undefined,
                    color: category?.color,
                  }}
                >
                  {iconMap[category?.icon || ""] || <Tag className="h-4 w-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-[#8FA68E] transition-colors truncate">
                      {item.name}
                    </h3>
                    {linkUrl && (
                      <ExternalLink className="h-3 w-3 text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    )}
                  </div>
                  {category && (
                    <span
                      className="inline-block text-[10px] font-medium px-1.5 py-0.5 rounded-full border mt-1"
                      style={{
                        backgroundColor: `${category.color}10`,
                        color: category.color,
                        borderColor: `${category.color}20`,
                      }}
                    >
                      {category.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-muted-foreground/70 mt-3 leading-relaxed line-clamp-3 flex-1">
                {item.shortDescription || item.description}
              </p>

              {/* Footer: tags + actions */}
              <div className="mt-3 pt-3 border-t border-border/50">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 flex-wrap min-w-0">
                    {item.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] text-muted-foreground/60 bg-muted/40 px-1.5 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {item.tags.length > 3 && (
                      <span className="text-[10px] text-muted-foreground/40">
                        +{item.tags.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {item.repoUrl && (
                      <span className="text-muted-foreground/30">
                        <Github className="h-3.5 w-3.5" />
                      </span>
                    )}
                    {item.installCommand && (
                      <button
                        onClick={(e) =>
                          handleCopy(e, item.installCommand!, item.slug)
                        }
                        className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors font-mono bg-muted/50 px-2 py-1 rounded-md group/cmd"
                        title="Click to copy install command"
                      >
                        <span className="truncate max-w-[100px] block">
                          {item.installCommand}
                        </span>
                        {copiedSlug === item.slug ? (
                          <Check className="h-3 w-3 text-green-500 shrink-0" />
                        ) : (
                          <Copy className="h-3 w-3 opacity-0 group-hover/cmd:opacity-100 shrink-0 transition-opacity" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </>
          )

          return linkUrl ? (
            <a
              key={item.slug}
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "group flex flex-col rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:shadow-md hover:border-[#8FA68E]/30 cursor-pointer"
              )}
            >
              {cardContent}
            </a>
          ) : (
            <div
              key={item.slug}
              className={cn(
                "group flex flex-col rounded-xl border border-border bg-card p-4 transition-all duration-200 opacity-80"
              )}
            >
              {cardContent}
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground/50">
          <Search className="h-10 w-10 mb-3 opacity-20" />
          <p className="text-sm font-medium">No items found</p>
          <p className="text-xs text-muted-foreground/40 mt-1">Try a different search term</p>
        </div>
      )}
    </div>
  )
}
