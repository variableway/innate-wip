"use client"

import { useState, useEffect, useMemo } from "react"
import { CollectionItem } from "@/lib/collections/types"
import { CollectionsCardGrid } from "@/components/collections/collections-card-grid"
import { CollectionsList } from "@/components/collections/collections-list"
import { CollectionViewer } from "@/components/collections/collection-viewer"
import { Globe, X, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@allone/utils"

const PAGE_SIZE = 10

const sourceColors: Record<string, string> = {
  kimi: "bg-violet-500/10 text-violet-600 dark:text-violet-400 hover:bg-violet-500/20",
  feishu: "bg-sky-500/10 text-sky-600 dark:text-sky-400 hover:bg-sky-500/20",
  other: "bg-gray-500/10 text-gray-600 dark:text-gray-400 hover:bg-gray-500/20",
}

interface CollectionsPageClientProps {
  collections: CollectionItem[]
  categories: string[]
  tags: string[]
  sources: string[]
}

export function CollectionsPageClient({
  collections,
  categories,
  tags,
  sources,
}: CollectionsPageClientProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isMobileDetail, setIsMobileDetail] = useState(false)
  const [filterTag, setFilterTag] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState<string | null>(null)
  const [filterSource, setFilterSource] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const filteredCollections = useMemo(() => {
    return collections.filter((item) => {
      if (filterCategory && item.category !== filterCategory) return false
      if (filterTag && !item.tags.includes(filterTag)) return false
      if (filterSource && item.source !== filterSource) return false
      return true
    })
  }, [collections, filterCategory, filterTag, filterSource])

  // Pagination: only used in list mode (when an item is selected)
  const totalPages = Math.ceil(filteredCollections.length / PAGE_SIZE)
  const paginatedItems = useMemo(() => {
    if (activeId === null) return filteredCollections // card mode shows all
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredCollections.slice(start, start + PAGE_SIZE)
  }, [filteredCollections, currentPage, activeId])

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [filterCategory, filterTag, filterSource])

  const activeItem = filteredCollections.find((c) => c.id === activeId) || null

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

  const handleSelect = (id: string) => {
    setActiveId(id)
    setCurrentPage(1)
    if (window.innerWidth < 768) {
      setIsMobileDetail(true)
    }
  }

  const handleBack = () => {
    setActiveId(null)
    setIsMobileDetail(false)
  }

  const handleTagClick = (tag: string) => {
    setFilterTag(tag)
    setFilterCategory(null)
    setFilterSource(null)
  }

  const clearFilters = () => {
    setFilterTag(null)
    setFilterCategory(null)
    setFilterSource(null)
  }

  const hasFilter = filterTag || filterCategory || filterSource

  return (
    <div className="flex flex-col h-full">
      {/* Page Header */}
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Globe className="h-5 w-5 text-[#8FA68E]" />
          <div>
            <h1 className="text-lg font-bold text-foreground">Collections</h1>
            <p className="text-xs text-muted-foreground">
              Random ideas and experiments from AI agents.
            </p>
          </div>
        </div>

        {/* Filter bar */}
        <div className="mt-3 space-y-2">
          {/* Sources */}
          {sources.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mr-1">
                Source
              </span>
              {sources.map((source) => (
                <button
                  key={source}
                  onClick={() =>
                    filterSource === source ? setFilterSource(null) : setFilterSource(source)
                  }
                  className={cn(
                    "text-[10px] font-medium px-2 py-0.5 rounded-full transition-colors",
                    filterSource === source
                      ? "bg-foreground text-background"
                      : sourceColors[source] || "bg-muted text-muted-foreground hover:bg-secondary"
                  )}
                >
                  {source}
                </button>
              ))}
            </div>
          )}

          {/* Categories */}
          {categories.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mr-1">
                Category
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() =>
                    filterCategory === cat ? setFilterCategory(null) : setFilterCategory(cat)
                  }
                  className={cn(
                    "text-[10px] font-medium px-2 py-0.5 rounded-full transition-colors",
                    filterCategory === cat
                      ? "bg-foreground text-background"
                      : "bg-muted text-muted-foreground hover:bg-secondary"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap">
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mr-1">
                Tags
              </span>
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => (filterTag === tag ? setFilterTag(null) : handleTagClick(tag))}
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
          )}

          {/* Active filter indicator */}
          {hasFilter && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>
                Showing {filteredCollections.length} of {collections.length} items
                {filterSource && ` from "${filterSource}"`}
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

      {/* Content area */}
      {activeId === null ? (
        /* Card mode - default, no item selected */
        <div className="flex-1 overflow-y-auto">
          {filteredCollections.length > 0 ? (
            <CollectionsCardGrid
              items={filteredCollections}
              onSelect={handleSelect}
              onTagClick={handleTagClick}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Globe className="h-12 w-12 mb-3 opacity-30" />
              <p className="text-sm">No items match this filter</p>
              <button
                onClick={clearFilters}
                className="text-xs text-[#8FA68E] hover:text-[#8FA68E]/80 mt-1"
              >
                Clear filter
              </button>
            </div>
          )}
        </div>
      ) : (
        /* List + Viewer mode - item selected */
        <div className="flex flex-1 overflow-hidden">
          {/* Left column - Narrow list */}
          <div
            className={cn(
              "w-full md:w-56 lg:w-64 shrink-0 border-r border-border flex flex-col",
              isMobileDetail ? "hidden md:flex" : "flex"
            )}
          >
            {/* Back to cards button */}
            <div className="px-3 py-2 border-b border-border">
              <button
                onClick={handleBack}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="h-3 w-3" />
                Back to grid
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-2 py-1">
              {paginatedItems.length > 0 ? (
                <CollectionsList
                  items={paginatedItems}
                  activeId={activeId}
                  onSelect={handleSelect}
                  onTagClick={handleTagClick}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Globe className="h-8 w-8 mb-2 opacity-30" />
                  <p className="text-sm">No items</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-3 py-2 border-t border-border flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">
                  {currentPage}/{totalPages}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage <= 1}
                    className={cn(
                      "p-1 rounded transition-colors",
                      currentPage <= 1
                        ? "text-muted-foreground/30 cursor-not-allowed"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    )}
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages}
                    className={cn(
                      "p-1 rounded transition-colors",
                      currentPage >= totalPages
                        ? "text-muted-foreground/30 cursor-not-allowed"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    )}
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right column - Viewer */}
          <div
            className={cn(
              "flex-1 overflow-hidden",
              isMobileDetail ? "block" : "hidden md:block"
            )}
          >
            {activeItem ? (
              <CollectionViewer
                item={activeItem}
                onBack={handleBack}
                isMobile={isMobileDetail}
                onTagClick={handleTagClick}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Globe className="h-12 w-12 mb-3 opacity-30" />
                <p className="text-sm">Select an item to view</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
