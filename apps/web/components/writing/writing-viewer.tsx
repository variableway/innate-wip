"use client"

import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react"
import { cn } from "@allone/utils"

export interface WritingViewerProps {
  title: string
  html: string
  date: string
  author: string
  category: string
  tags: string[]
  readingTime: number
  onBack?: () => void
  isMobile?: boolean
}

export function WritingViewer({
  title,
  html,
  date,
  author,
  category,
  tags,
  readingTime,
  onBack,
  isMobile,
}: WritingViewerProps) {
  return (
    <article className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border pb-4 mb-6">
        {/* Mobile back button */}
        {isMobile && onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-3 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to list
          </button>
        )}

        {/* Category */}
        <span
          className={cn(
            "text-[11px] font-medium px-2 py-0.5 rounded uppercase tracking-wide",
            category === "thought" && "bg-blue-500/10 text-blue-600 dark:text-blue-400",
            category === "insight" && "bg-amber-500/10 text-amber-600 dark:text-amber-400",
            category === "log" && "bg-green-500/10 text-green-600 dark:text-green-400",
            category === "article" && "bg-purple-500/10 text-purple-600 dark:text-purple-400"
          )}
        >
          {category}
        </span>

        {/* Title */}
        <h1 className="text-2xl font-bold text-foreground mt-2 mb-3 leading-tight">
          {title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{author}</span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {date}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {readingTime} min read
          </span>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex items-center gap-1.5 mt-3 flex-wrap">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-0.5 text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-md"
              >
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div
        className="prose prose-sm dark:prose-invert max-w-none flex-1 overflow-y-auto"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  )
}
