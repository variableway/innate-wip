"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react"
import { cn } from "@allone/utils"
import { MarkdownPreview } from "@/components/markdown-preview"

export interface WritingViewerProps {
  title: string
  content: string
  excerpt: string
  date: string
  author: string
  category: string
  tags: string[]
  readingTime: number
  toc: Array<{ id: string; text: string; level: number }>
  onBack?: () => void
  isMobile?: boolean
  onTagClick?: (tag: string) => void
  onCategoryClick?: (category: string) => void
}

function TableOfContents({ headings }: { headings: Array<{ id: string; text: string; level: number }> }) {
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px" }
    )

    const timeout = setTimeout(() => {
      for (const h of headings) {
        const el = document.getElementById(h.id)
        if (el) observer.observe(el)
      }
    }, 200)

    return () => {
      clearTimeout(timeout)
      observer.disconnect()
    }
  }, [headings])

  if (headings.length === 0) return null

  return (
    <div className="hidden lg:block sticky top-24 h-fit max-h-[calc(100vh-120px)] overflow-y-auto">
      <h3 className="text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
        On this page
      </h3>
      <nav className="space-y-1">
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            className={cn(
              "block text-sm py-1 transition-colors border-l-2 pl-3",
              heading.level === 3 && "pl-6",
              activeId === heading.id
                ? "border-[#8FA68E] text-[#8FA68E] font-medium"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            )}
            onClick={(e) => {
              e.preventDefault()
              const element = document.getElementById(heading.id)
              if (element) {
                element.scrollIntoView({ behavior: "smooth" })
              }
            }}
          >
            {heading.text}
          </a>
        ))}
      </nav>
    </div>
  )
}

export function WritingViewer({
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
        <button
          onClick={() => onCategoryClick?.(category)}
          className={cn(
            "text-[11px] font-medium px-2 py-0.5 rounded uppercase tracking-wide transition-colors hover:opacity-80",
            category === "thought" && "bg-blue-500/10 text-blue-600 dark:text-blue-400",
            category === "insight" && "bg-amber-500/10 text-amber-600 dark:text-amber-400",
            category === "log" && "bg-green-500/10 text-green-600 dark:text-green-400",
            category === "article" && "bg-purple-500/10 text-purple-600 dark:text-purple-400"
          )}
        >
          {category}
        </button>

        {/* Title */}
        <h1 className="text-2xl font-bold text-foreground mt-2 mb-3 leading-tight">
          {title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[11px] font-medium">
              {author[0]}
            </div>
            <span>{author}</span>
          </div>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {date}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {readingTime} min read
          </span>
        </div>

        {/* Tags — clickable */}
        {tags.length > 0 && (
          <div className="flex items-center gap-1.5 mt-3 flex-wrap">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => onTagClick?.(tag)}
                className="inline-flex items-center gap-0.5 text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-md hover:bg-muted hover:text-foreground transition-colors"
              >
                <Tag className="h-3 w-3" />
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content area: article + ToC sidebar */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-8">
          {/* Main content */}
          <div>
            {/* Excerpt block */}
            {excerpt && (
              <div className="bg-secondary/50 border-l-4 border-[#8FA68E] p-4 mb-6 rounded-r-lg">
                <p className="text-muted-foreground italic text-sm">{excerpt}</p>
              </div>
            )}

            {/* Markdown content */}
            <MarkdownPreview source={content} />
          </div>

          {/* ToC sidebar */}
          <aside>
            <TableOfContents headings={toc} />
          </aside>
        </div>
      </div>
    </article>
  )
}
