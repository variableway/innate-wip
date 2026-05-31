"use client"

import { useState, useMemo } from "react"
import { FeedCard } from "./feed-card"
import { FeedFilter } from "./feed-filter"
import type { FeedPost, FeedFilterType } from "./types"
import { Loader2 } from "lucide-react"

interface FeedListProps {
  posts: FeedPost[]
}

// 按时间分组
function groupPostsByTime(posts: FeedPost[]) {
  const groups: { label: string; posts: FeedPost[] }[] = []

  const today = posts.filter((_, i) => i < 2)
  const yesterday = posts.filter((_, i) => i >= 2 && i < 4)
  const earlier = posts.filter((_, i) => i >= 4)

  if (today.length > 0) {
    groups.push({ label: "Today", posts: today })
  }
  if (yesterday.length > 0) {
    groups.push({ label: "Yesterday", posts: yesterday })
  }
  if (earlier.length > 0) {
    groups.push({ label: "Earlier", posts: earlier })
  }

  return groups
}

export function FeedList({ posts }: FeedListProps) {
  const [filter, setFilter] = useState<FeedFilterType>("all")
  const [displayCount, setDisplayCount] = useState(6)
  const [isLoading, setIsLoading] = useState(false)

  // Extract unique categories from posts
  const categories = useMemo(() => {
    const cats = new Set<string>()
    for (const post of posts) {
      if (post.category) cats.add(post.category)
    }
    return Array.from(cats).sort()
  }, [posts])

  // 筛选文章
  const filteredPosts = useMemo(() => {
    if (filter === "all") return posts
    if (filter === "editors-pick") return posts.filter((p) => p.isEditorsPick)
    return posts.filter((p) => p.category === filter)
  }, [posts, filter])

  // 按时间分组
  const groupedPosts = useMemo(() => {
    return groupPostsByTime(filteredPosts)
  }, [filteredPosts])

  // 加载更多
  const handleLoadMore = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setDisplayCount((prev) => prev + 6)
    setIsLoading(false)
  }

  // 是否还有更多
  const hasMore = displayCount < filteredPosts.length

  // 编辑精选（置顶显示）
  const editorsPicks = filteredPosts.filter((p) => p.isEditorsPick).slice(0, 2)

  return (
    <div className="space-y-8">
      {/* 筛选器 */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm py-4 border-b border-border/50">
        <FeedFilter currentFilter={filter} onFilterChange={setFilter} categories={categories} />
      </div>

      {/* 编辑精选 */}
      {filter !== "editors-pick" && editorsPicks.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <span className="w-2 h-2 bg-[#D4845E] rounded-full" />
            Editor&apos;s Pick
          </h2>
          <div className="space-y-4">
            {editorsPicks.map((post) => (
              <FeedCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      )}

      {/* 按时间分组的文章列表 */}
      {groupedPosts.map((group) => (
        <div key={group.label} className="space-y-4">
          <h2 className="text-sm font-medium text-muted-foreground sticky top-16 bg-background/95 backdrop-blur-sm py-2">
            {group.label}
          </h2>
          <div className="space-y-4">
            {group.posts.slice(0, displayCount).map((post) => (
              <FeedCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      ))}

      {/* 加载更多 */}
      {hasMore && (
        <div className="flex justify-center py-8">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 min-w-[200px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load more"
            )}
          </button>
        </div>
      )}

      {/* 无结果 */}
      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No posts found.</p>
        </div>
      )}
    </div>
  )
}
