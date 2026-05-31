"use client"

import Link from "next/link"
import { Heart, MessageCircle, Bookmark, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import type { FeedPost } from "./types"

interface FeedCardProps {
  post: FeedPost
  variant?: "default" | "compact" | "featured"
}

const tagColorMap: Record<string, string> = {
  ai: "#8FA68E",
  coding: "#7A9CAE",
  design: "#D4845E",
  product: "#E89B73",
  career: "#9BB5C4",
  tutorial: "#A8C5A8",
  news: "#8B7355",
  experience: "#6B8E9B",
}

function getTagColor(tagName: string): string {
  return tagColorMap[tagName.toLowerCase()] || "#8FA68E"
}

const categoryStyles: Record<string, string> = {
  article: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  log: "bg-green-500/10 text-green-600 dark:text-green-400",
  news: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  thought: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  insight: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
}

export function FeedCard({ post, variant = "default" }: FeedCardProps) {
  if (variant === "compact") {
    return (
      <Link href={`/feed/${post.slug}`}>
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow border-border/50">
          <div className="p-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm font-medium flex-shrink-0">
                {post.author.name[0]}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground line-clamp-1 mb-1">
                  {post.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{post.author.name}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readTime}min
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/feed/${post.slug}`}>
      <div
        className={cn(
          "group rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-all duration-300 border-border/50",
          post.isEditorsPick && "border-[#D4845E]/30 ring-1 ring-[#D4845E]/10"
        )}
      >
        <div className="p-6">
          {/* Header: badges + date + tags inline */}
          <div className="flex items-center gap-x-3 gap-y-1.5 flex-wrap mb-3">
            <div className="flex items-center gap-2">
              {post.isEditorsPick && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-[#D4845E]/10 text-[#D4845E]">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Editor&apos;s Pick
                </span>
              )}
              {post.category && (
                <span className={cn("text-xs px-2 py-0.5 rounded-full", categoryStyles[post.category] || "bg-muted text-muted-foreground")}>
                  {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">{post.date}</span>
            {post.tags && post.tags.length > 0 && (
              <>
                <span className="text-muted-foreground/20 hidden sm:inline">|</span>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded-md"
                    style={{
                      backgroundColor: `${getTagColor(tag)}20`,
                      color: getTagColor(tag),
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </>
            )}
          </div>

          {/* 标题 */}
          <h3 className="text-xl font-semibold mb-3 group-hover:text-[#8FA68E] transition-colors line-clamp-2">
            {post.title}
          </h3>

          {/* 摘要 */}
          <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
            {post.summary}
          </p>

          {/* 底部：作者信息 + 元数据 */}
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-medium">
                {post.author.name[0]}
              </div>
              <div className="text-sm">
                <span className="font-medium">{post.author.name}</span>
                <span className="text-muted-foreground"> · </span>
                <span className="text-muted-foreground">
                  {post.readTime || 1} min read
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-muted-foreground">
              <button className="flex items-center gap-1 text-sm hover:text-[#D4845E] transition-colors">
                <Heart className="h-4 w-4" />
                <span>0</span>
              </button>
              <button className="flex items-center gap-1 text-sm hover:text-[#8FA68E] transition-colors">
                <MessageCircle className="h-4 w-4" />
                <span>0</span>
              </button>
              <button className="hover:text-[#7A9CAE] transition-colors">
                <Bookmark className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
