"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { CheatsheetMeta, ViewMode } from "@/lib/cheatsheets/types"
import { Badge } from "@innate/ui"
import { cn } from "@allone/utils"
import {
  BookOpen,
  LayoutGrid,
  List,
  X,
  Search,
  Tag,
} from "lucide-react"

interface CheatsheetsPageClientProps {
  cheatsheets: CheatsheetMeta[]
  categories: string[]
  total: number
}

export function CheatsheetsPageClient({
  cheatsheets,
  categories,
  total,
}: CheatsheetsPageClientProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("card")
  const [filterCategory, setFilterCategory] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    return cheatsheets.filter((item) => {
      if (filterCategory && item.category !== filterCategory) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          item.title.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.keywords.some((k) => k.toLowerCase().includes(q)) ||
          item.tags.some((t) => t.toLowerCase().includes(q))
        )
      }
      return true
    })
  }, [cheatsheets, filterCategory, search])

  const grouped = useMemo(() => {
    const map = new Map<string, CheatsheetMeta[]>()
    for (const item of filtered) {
      const cat = item.category
      if (!map.has(cat)) map.set(cat, [])
      map.get(cat)!.push(item)
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b))
  }, [filtered])

  const clearFilters = () => {
    setFilterCategory(null)
    setSearch("")
  }

  const hasFilter = filterCategory || search

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-blue-500" />
            <div>
              <h1 className="text-lg font-bold text-foreground">Cheatsheets</h1>
              <p className="text-xs text-muted-foreground">
                {total} quick reference guides
              </p>
            </div>
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
            <button
              onClick={() => setViewMode("card")}
              className={cn(
                "p-1.5 rounded-md transition-colors",
                viewMode === "card"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-1.5 rounded-md transition-colors",
                viewMode === "list"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-3 relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search cheatsheets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-sm bg-muted rounded-lg border-none outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/60"
          />
        </div>

        {/* Category filters */}
        <div className="mt-2 flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mr-1">
            Category
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() =>
                filterCategory === cat
                  ? setFilterCategory(null)
                  : setFilterCategory(cat)
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

        {hasFilter && (
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <span>
              Showing {filtered.length} of {total}
            </span>
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-blue-500 hover:text-blue-600"
            >
              <X className="h-3 w-3" />
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <BookOpen className="h-12 w-12 mb-3 opacity-30" />
            <p className="text-sm">No cheatsheets match your search</p>
            <button
              onClick={clearFilters}
              className="text-xs text-blue-500 mt-1"
            >
              Clear filters
            </button>
          </div>
        ) : viewMode === "card" ? (
          <div className="p-4">
            {grouped.map(([category, items]) => (
              <div key={category} className="mb-6">
                <h2 className="text-sm font-semibold text-muted-foreground mb-3 px-1">
                  {category}
                  <span className="ml-2 text-[10px] font-normal opacity-60">
                    {items.length}
                  </span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {items.map((item) => (
                    <CheatsheetCard key={item.slug} item={item} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4">
            {grouped.map(([category, items]) => (
              <div key={category} className="mb-4">
                <h2 className="text-sm font-semibold text-muted-foreground mb-2 px-1">
                  {category}
                </h2>
                <div className="divide-y divide-border">
                  {items.map((item) => (
                    <CheatsheetListItem key={item.slug} item={item} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function CheatsheetCard({ item }: { item: CheatsheetMeta }) {
  return (
    <Link href={`/cheatsheets/${item.slug}`}>
      <div className="group rounded-xl border border-border bg-card p-4 hover:shadow-md hover:border-primary/20 transition-all cursor-pointer h-full flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-sm font-semibold group-hover:text-primary transition-colors line-clamp-1">
            {item.title}
          </h3>
          {item.tags.includes("Featured") && (
            <Badge
              variant="secondary"
              className="text-[10px] shrink-0 ml-2 bg-blue-500/10 text-blue-600"
            >
              Featured
            </Badge>
          )}
        </div>

        {item.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-1">
            {item.description}
          </p>
        )}

        <div className="flex items-center gap-2 mt-auto pt-2 border-t border-border">
          <Badge variant="outline" className="text-[10px]">
            {item.category}
          </Badge>
          {item.updated && (
            <span className="text-[10px] text-muted-foreground">
              {item.updated}
            </span>
          )}
        </div>

        {item.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {item.keywords.slice(0, 3).map((kw) => (
              <span
                key={kw}
                className="text-[10px] text-muted-foreground/70 bg-muted px-1.5 py-0.5 rounded"
              >
                {kw}
              </span>
            ))}
            {item.keywords.length > 3 && (
              <span className="text-[10px] text-muted-foreground">
                +{item.keywords.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}

function CheatsheetListItem({ item }: { item: CheatsheetMeta }) {
  return (
    <Link href={`/cheatsheets/${item.slug}`}>
      <div className="group flex items-center gap-3 px-3 py-2.5 hover:bg-secondary/50 transition-colors cursor-pointer">
        <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" />
        <div className="flex-1 min-w-0">
          <span className="text-sm font-medium group-hover:text-primary transition-colors">
            {item.title}
          </span>
          {item.description && (
            <p className="text-xs text-muted-foreground truncate">
              {item.description.slice(0, 100)}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="outline" className="text-[10px]">
            {item.category}
          </Badge>
          {item.tags.includes("Featured") && (
            <Tag className="h-3 w-3 text-blue-500" />
          )}
        </div>
      </div>
    </Link>
  )
}
