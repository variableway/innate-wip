"use client"

import { useState, useEffect, useMemo } from "react"
import { BlogList, BlogListItem } from "@/components/blog-list"
import { BlogViewer } from "@/components/blog-viewer"
import { MarkdownPreview } from "@/components/markdown-preview"
import { TableOfContents } from "@/components/table-of-contents"
import { FileText, X, ExternalLink, ArrowLeft, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface BlogPostFull extends BlogListItem {
  content: string
  author: string
  toc: Array<{ id: string; text: string; level: number }>
  type: "md" | "mdx"
}

interface BlogPageClientProps {
  posts: BlogPostFull[]
}

const categoryColors: Record<string, { bg: string; text: string; ring: string }> = {
  thought: {
    bg: "bg-blue-500/8 hover:bg-blue-500/15",
    text: "text-blue-600 dark:text-blue-400",
    ring: "ring-blue-500/30",
  },
  insight: {
    bg: "bg-amber-500/8 hover:bg-amber-500/15",
    text: "text-amber-600 dark:text-amber-400",
    ring: "ring-amber-500/30",
  },
  log: {
    bg: "bg-green-500/8 hover:bg-green-500/15",
    text: "text-green-600 dark:text-green-400",
    ring: "ring-green-500/30",
  },
  article: {
    bg: "bg-purple-500/8 hover:bg-purple-500/15",
    text: "text-purple-600 dark:text-purple-400",
    ring: "ring-purple-500/30",
  },
}

export function BlogPageClient({ posts }: BlogPageClientProps) {
  const [activeSlug, setActiveSlug] = useState<string>(posts[0]?.slug || "")
  const [isMobileDetail, setIsMobileDetail] = useState(false)
  const [filterTag, setFilterTag] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState<string | null>(null)
  const [mobileTransitioning, setMobileTransitioning] = useState(false)

  const { categories, tags } = useMemo(() => {
    const catSet = new Set<string>()
    const tagSet = new Map<string, number>()
    for (const post of posts) {
      catSet.add(post.category)
      for (const t of post.tags) {
        tagSet.set(t, (tagSet.get(t) || 0) + 1)
      }
    }
    const sortedTags = [...tagSet.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag)
    return { categories: [...catSet].sort(), tags: sortedTags }
  }, [posts])

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      if (filterCategory && post.category !== filterCategory) return false
      if (filterTag && !post.tags.includes(filterTag)) return false
      return true
    })
  }, [posts, filterCategory, filterTag])

  useEffect(() => {
    if (filteredPosts.length > 0) {
      const currentStillVisible = filteredPosts.find((p) => p.slug === activeSlug)
      if (!currentStillVisible) {
        setActiveSlug(filteredPosts[0].slug)
      }
    }
  }, [filterCategory, filterTag])

  const activePost = filteredPosts.find((p) => p.slug === activeSlug)

  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth >= 768) {
        setIsMobileDetail(false)
      }
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleSelect = (slug: string) => {
    setActiveSlug(slug)
    if (window.innerWidth < 768) {
      setMobileTransitioning(true)
      setTimeout(() => {
        setIsMobileDetail(true)
        setMobileTransitioning(false)
      }, 50)
    }
  }

  const handleBack = () => {
    setMobileTransitioning(true)
    setTimeout(() => {
      setIsMobileDetail(false)
      setMobileTransitioning(false)
    }, 50)
  }

  const handleTagClick = (tag: string) => {
    setFilterTag(tag)
    setFilterCategory(null)
  }

  const handleCategoryClick = (cat: string) => {
    setFilterCategory(cat)
    setFilterTag(null)
  }

  const clearFilters = () => {
    setFilterTag(null)
    setFilterCategory(null)
  }

  const hasFilter = filterTag || filterCategory

  return (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="px-5 py-4 border-b border-border bg-card/50">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#8FA68E]/10">
            <FileText className="h-4 w-4 text-[#8FA68E]" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base font-bold text-foreground">Writing</h1>
            <p className="text-xs text-muted-foreground/70 truncate">
              Thoughts, ideas, and experiences shared with the world.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-3 space-y-2">
          {/* Categories */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {categories.map((cat) => {
              const colors = categoryColors[cat] || {
                bg: "bg-muted hover:bg-muted/80",
                text: "text-muted-foreground",
                ring: "ring-border",
              }
              const isActive = filterCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() =>
                    isActive ? setFilterCategory(null) : handleCategoryClick(cat)
                  }
                  className={cn(
                    "text-[11px] font-medium px-2.5 py-1 rounded-full transition-all",
                    isActive
                      ? `bg-foreground text-background ring-1 ring-foreground/20`
                      : `${colors.bg} ${colors.text}`
                  )}
                >
                  {cat}
                </button>
              )
            })}
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap">
              {tags.slice(0, 8).map((tag) => (
                <button
                  key={tag}
                  onClick={() =>
                    filterTag === tag ? setFilterTag(null) : handleTagClick(tag)
                  }
                  className={cn(
                    "text-[11px] px-2 py-0.5 rounded-full transition-all",
                    filterTag === tag
                      ? "bg-foreground text-background"
                      : "text-muted-foreground/70 bg-muted/50 hover:bg-secondary hover:text-foreground"
                  )}
                >
                  #{tag}
                </button>
              ))}
              {tags.length > 8 && (
                <span className="text-[11px] text-muted-foreground/40">
                  +{tags.length - 8}
                </span>
              )}
            </div>
          )}

          {/* Active filter indicator */}
          {hasFilter && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground/60">
                Showing {filteredPosts.length} of {posts.length}
                {filterCategory && ` in "${filterCategory}"`}
                {filterTag && ` tagged "${filterTag}"`}
              </span>
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs text-[#8FA68E] hover:text-[#6b856a] transition-colors font-medium"
              >
                <X className="h-3 w-3" />
                Clear
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content area */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* List pane */}
        <div
          className={cn(
            "w-full md:w-80 lg:w-88 shrink-0 border-r border-border overflow-y-auto transition-transform duration-200 ease-out",
            isMobileDetail ? "-translate-x-full md:translate-x-0 absolute md:relative inset-0 md:inset-auto z-10 bg-background" : "translate-x-0"
          )}
        >
          <div className="px-3 py-2">
            {filteredPosts.length > 0 ? (
              <BlogList
                items={filteredPosts.map(({ content: _c, author: _a, toc: _t, type: _ty, ...rest }) => rest)}
                activeSlug={activeSlug}
                onSelect={handleSelect}
                onTagClick={handleTagClick}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground/60">
                <BookOpen className="h-10 w-10 mb-3 opacity-20" />
                <p className="text-sm font-medium">No posts match this filter</p>
                <button
                  onClick={clearFilters}
                  className="text-xs text-[#8FA68E] hover:text-[#6b856a] mt-2 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Detail pane */}
        <div
          className={cn(
            "flex-1 overflow-y-auto transition-transform duration-200 ease-out bg-background",
            isMobileDetail
              ? "translate-x-0"
              : "translate-x-full md:translate-x-0 absolute md:relative inset-0 md:inset-auto"
          )}
        >
          <div className="px-5 py-5 md:px-8 md:py-8 max-w-4xl mx-auto w-full">
            {activePost ? (
              activePost.type === "mdx" ? (
                <MdxInlineViewer post={activePost} onBack={handleBack} onTagClick={handleTagClick} />
              ) : (
                <BlogViewer
                  title={activePost.title}
                  content={activePost.content}
                  excerpt={activePost.excerpt}
                  date={activePost.date}
                  author={activePost.author}
                  category={activePost.category}
                  tags={activePost.tags}
                  readingTime={activePost.readingTime}
                  toc={activePost.toc}
                  onBack={handleBack}
                  isMobile={true}
                  onTagClick={handleTagClick}
                  onCategoryClick={handleCategoryClick}
                />
              )
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function MdxInlineViewer({
  post,
  onBack,
  onTagClick,
}: {
  post: BlogPostFull
  onBack?: () => void
  onTagClick?: (tag: string) => void
}) {
  return (
    <article className="flex flex-col h-full">
      {/* Header matching BlogViewer style */}
      <div className="border-b border-border pb-4 mb-6">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-3 transition-colors md:hidden"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to list
          </button>
        )}

        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] font-medium px-2 py-0.5 rounded uppercase tracking-wide bg-purple-500/10 text-purple-600 dark:text-purple-400">
            {post.category}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">
            MDX
          </span>
        </div>

        <h1 className="text-2xl font-bold text-foreground leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[11px] font-medium">
              {post.author[0]}
            </div>
            <span>{post.author}</span>
          </div>
          <span>{post.date}</span>
          <span>{post.readingTime} min read</span>
        </div>

        {post.tags.length > 0 && (
          <div className="flex items-center gap-1.5 mt-3 flex-wrap">
            {post.tags.map((tag) => (
              <button
                key={tag}
                onClick={() => onTagClick?.(tag)}
                className="inline-flex items-center gap-0.5 text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-md hover:bg-muted hover:text-foreground transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content with ToC */}
      <div className="flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-8">
          <div>
            {post.excerpt && (
              <div className="bg-secondary/40 border-l-4 border-[#8FA68E] p-4 mb-6 rounded-r-lg">
                <p className="text-muted-foreground italic text-sm">{post.excerpt}</p>
              </div>
            )}
            <MarkdownPreview source={post.content} />
          </div>
          <aside>
            <TableOfContents headings={post.toc} />
          </aside>
        </div>
      </div>

      {/* Footer link */}
      <div className="mt-6 pt-4 border-t border-border">
        <Link
          href={`/writing/${post.slug}`}
          className="inline-flex items-center gap-1.5 text-sm text-[#8FA68E] hover:text-[#6b856a] transition-colors font-medium"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Open dedicated page
        </Link>
      </div>
    </article>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-muted-foreground/50">
      <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center mb-4">
        <FileText className="h-7 w-7 opacity-40" />
      </div>
      <p className="text-sm font-medium">Select a post to read</p>
      <p className="text-xs text-muted-foreground/40 mt-1">
        Choose an article from the list on the left
      </p>
    </div>
  )
}
