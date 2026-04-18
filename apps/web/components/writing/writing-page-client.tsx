"use client"

import { useState, useEffect, useMemo } from "react"
import { WritingList, WritingListItem } from "@/components/writing/writing-list"
import { WritingViewer, WritingViewerProps } from "@/components/writing/writing-viewer"
import { FileText, X } from "lucide-react"
import { cn } from "@allone/utils"

interface WritingPostFull extends WritingListItem {
  content: string
  author: string
  toc: Array<{ id: string; text: string; level: number }>
}

interface WritingPageClientProps {
  posts: WritingPostFull[]
}

const categoryColors: Record<string, string> = {
  thought: "bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20",
  insight: "bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20",
  log: "bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20",
  article: "bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20",
}

export function WritingPageClient({ posts }: WritingPageClientProps) {
  const [activeSlug, setActiveSlug] = useState<string>(posts[0]?.slug || "")
  const [isMobileDetail, setIsMobileDetail] = useState(false)
  const [filterTag, setFilterTag] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState<string | null>(null)

  // Derive all unique categories and tags from posts
  const { categories, tags } = useMemo(() => {
    const catSet = new Set<string>()
    const tagSet = new Map<string, number>()
    for (const post of posts) {
      catSet.add(post.category)
      for (const t of post.tags) {
        tagSet.set(t, (tagSet.get(t) || 0) + 1)
      }
    }
    // Sort tags by frequency
    const sortedTags = [...tagSet.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag)
    return { categories: [...catSet].sort(), tags: sortedTags }
  }, [posts])

  // Filtered posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      if (filterCategory && post.category !== filterCategory) return false
      if (filterTag && !post.tags.includes(filterTag)) return false
      return true
    })
  }, [posts, filterCategory, filterTag])

  // When filter changes, reset active slug to first matching post
  useEffect(() => {
    if (filteredPosts.length > 0) {
      const currentStillVisible = filteredPosts.find((p) => p.slug === activeSlug)
      if (!currentStillVisible) {
        setActiveSlug(filteredPosts[0].slug)
      }
    }
  }, [filterCategory, filterTag])

  const activePost = filteredPosts.find((p) => p.slug === activeSlug)

  // Detect mobile
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
      setIsMobileDetail(true)
    }
  }

  const handleBack = () => {
    setIsMobileDetail(false)
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
      {/* Page Header */}
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-[#8FA68E]" />
          <div>
            <h1 className="text-lg font-bold text-foreground">Writing</h1>
            <p className="text-xs text-muted-foreground">
              Thoughts, ideas, and experiences shared with the world.
            </p>
          </div>
        </div>

        {/* Filter bar */}
        <div className="mt-3 space-y-2">
          {/* Categories */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mr-1">
              Category
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() =>
                  filterCategory === cat ? setFilterCategory(null) : handleCategoryClick(cat)
                }
                className={cn(
                  "text-[10px] font-medium px-2 py-0.5 rounded-full transition-colors",
                  filterCategory === cat
                    ? "bg-foreground text-background"
                    : categoryColors[cat] || "bg-muted text-muted-foreground hover:bg-secondary"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Tags */}
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mr-1">
              Tags
            </span>
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() =>
                  filterTag === tag ? setFilterTag(null) : handleTagClick(tag)
                }
                className={cn(
                  "text-[10px] px-2 py-0.5 rounded-full transition-colors",
                  filterTag === tag
                    ? "bg-foreground text-background"
                    : "text-muted-foreground bg-muted hover:bg-secondary"
                )}
              >
                #{tag}
              </button>
            ))}
          </div>

          {/* Active filter indicator */}
          {hasFilter && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>
                Showing {filteredPosts.length} of {posts.length} posts
                {filterCategory && ` in "${filterCategory}"`}
                {filterTag && ` tagged "${filterTag}"`}
              </span>
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-[#8FA68E] hover:text-[#8FA68E]/80 transition-colors"
              >
                <X className="h-3 w-3" />
                Clear
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Two-column layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left column - Blog list (hidden on mobile when viewing detail) */}
        <div
          className={`w-full md:w-80 lg:w-96 shrink-0 border-r border-border overflow-y-auto ${
            isMobileDetail ? "hidden md:block" : "block"
          }`}
        >
          <div className="px-3 py-2">
            {filteredPosts.length > 0 ? (
              <WritingList
                items={filteredPosts.map(({ content: _content, author: _author, toc: _toc, ...rest }) => rest)}
                activeSlug={activeSlug}
                onSelect={handleSelect}
                onTagClick={handleTagClick}
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <FileText className="h-8 w-8 mb-2 opacity-30" />
                <p className="text-sm">No posts match this filter</p>
                <button
                  onClick={clearFilters}
                  className="text-xs text-[#8FA68E] hover:text-[#8FA68E]/80 mt-1"
                >
                  Clear filter
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right column - Content viewer */}
        <div
          className={`flex-1 overflow-y-auto px-6 py-6 ${
            isMobileDetail ? "block" : "hidden md:block"
          }`}
        >
          {activePost ? (
            <WritingViewer
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
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <FileText className="h-12 w-12 mb-3 opacity-30" />
              <p className="text-sm">Select a post to read</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
