"use client"

import { useState } from "react"
import { CollectionItem } from "@/lib/collections/types"
import { ArrowLeft, ExternalLink, Tag, Loader2, LayoutGrid } from "lucide-react"
import { cn } from "@allone/utils"

const sourceColors: Record<string, string> = {
  kimi: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  feishu: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  other: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
}

interface CollectionViewerProps {
  item: CollectionItem
  onBack?: () => void
  isMobile?: boolean
  onTagClick?: (tag: string) => void
}

export function CollectionViewer({ item, onBack, isMobile, onTagClick }: CollectionViewerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border px-4 py-3">
        {/* Mobile back button */}
        {isMobile && onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to grid
          </button>
        )}

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {/* Source + Category badges */}
            <div className="flex items-center gap-2 mb-1">
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
            <h1 className="text-lg font-bold text-foreground leading-tight">
              {item.title}
            </h1>

            {/* Description */}
            {item.description && (
              <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
            )}

            {/* Tags + Date */}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="text-[11px] text-muted-foreground">{item.date}</span>
              {item.tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => onTagClick?.(tag)}
                  className="inline-flex items-center gap-0.5 text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded-md hover:bg-muted hover:text-foreground transition-colors"
                >
                  <Tag className="h-2.5 w-2.5" />
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Open in new tab */}
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-secondary"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Open</span>
          </a>
        </div>
      </div>

      {/* Iframe container */}
      <div className="flex-1 min-h-0 p-4">
        <div className="relative w-full h-full border border-border rounded-lg overflow-hidden bg-muted/30">
          {isLoading && !isError && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-sm">Loading...</span>
              </div>
            </div>
          )}

          {isError && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <ExternalLink className="h-8 w-8 opacity-30" />
                <p className="text-sm">This site cannot be embedded</p>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#8FA68E] hover:text-[#8FA68E]/80 flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  Open in new tab
                </a>
              </div>
            </div>
          )}

          <iframe
            src={item.url}
            title={item.title}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-popups"
            loading="lazy"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false)
              setIsError(true)
            }}
          />
        </div>
      </div>
    </div>
  )
}
