"use client"

import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react"
import { cn } from "@/lib/utils"
import { MarkdownPreview } from "@/components/markdown-preview"
import { TableOfContents, type TocItem } from "@/components/table-of-contents"

export interface BlogViewerProps {
  title: string
  content: string
  excerpt: string
  date: string
  author: string
  category: string
  tags: string[]
  readingTime: number
  toc: TocItem[]
  onBack?: () => void
  isMobile?: boolean
  onTagClick?: (tag: string) => void
  onCategoryClick?: (category: string) => void
}

const categoryStyles: Record<string, string> = {
  thought: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  insight: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  log: "bg-green-500/10 text-green-600 dark:text-green-400",
  article: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
}

export function BlogViewer({
  title,
  content,
  excerpt,
  date,
  author,
  category,
  tags,
  readingTime,
  toc,
  onBack,
  isMobile,
  onTagClick,
  onCategoryClick,
}: BlogViewerProps) {
  const catStyle = categoryStyles[category] || "bg-muted text-muted-foreground"

  return (
    <article className="flex flex-col h-full">
      <div className="border-b border-border pb-4 mb-6">
        {/* Mobile back button */}
        {isMobile && onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-3 transition-colors md:hidden"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to list
          </button>
        )}

        {/* Category */}
        {onCategoryClick ? (
          <button
            onClick={() => onCategoryClick(category)}
            className={cn(
              "text-[11px] font-medium px-2 py-0.5 rounded uppercase tracking-wide transition-opacity hover:opacity-70",
              catStyle
            )}
          >
            {category}
          </button>
        ) : (
          <span
            className={cn(
              "inline-block text-[11px] font-medium px-2 py-0.5 rounded uppercase tracking-wide",
              catStyle
            )}
          >
            {category}
          </span>
        )}

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-semibold text-foreground mt-2 mb-3 leading-tight tracking-tight">
          {title}
        </h1>

        {/* Meta + Tags inline */}
        <div className="flex items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[11px] font-semibold">
              {author[0]}
            </div>
            <span className="font-medium">{author}</span>
          </div>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {date}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {readingTime} min read
          </span>
          {tags.length > 0 && (
            <>
              <span className="text-muted-foreground/20 hidden sm:inline">|</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => onTagClick?.(tag)}
                    className="inline-flex items-center gap-0.5 text-xs text-muted-foreground bg-secondary/70 px-2 py-0.5 rounded-md hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <Tag className="h-3 w-3" />
                    {tag}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Content area: article + ToC sidebar */}
      <div className="flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-8">
          {/* Main content */}
          <div className="max-w-3xl">
            {/* Excerpt block */}
            {excerpt && (
              <div className="bg-[var(--accent-subtle)] border-l-4 border-[var(--accent)] p-4 mb-6 rounded-r-lg">
                <p className="text-muted-foreground italic text-sm leading-relaxed">{excerpt}</p>
              </div>
            )}

            {/* Markdown content */}
            <MarkdownPreview source={content} />
          </div>

          {/* ToC sidebar */}
          <aside className="hidden lg:block">
            <TableOfContents headings={toc} />
          </aside>
        </div>
      </div>
    </article>
  )
}
