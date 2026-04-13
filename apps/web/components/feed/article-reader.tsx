"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@allone/ui"
import { ArrowLeft, Heart, MessageCircle, Bookmark, Share2 } from "lucide-react"
import { MarkdownPreview } from "@/components/markdown-preview"
import { tags } from "@/lib/data"
import type { PostMeta } from "@/lib/content"

interface Author {
  name: string
  avatar?: string
  role?: string
}

interface RelatedPost extends PostMeta {
  slug: string
}

interface ArticleReaderProps {
  post: {
    slug: string
    title: string
    summary: string
    content: string
    html: string
    date: string
    author: Author
    category: string
    tags: string[]
    readTime: number
    toc: Array<{ id: string; text: string; level: number }>
  }
  relatedPosts?: RelatedPost[]
}

// 阅读进度条
function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = (scrollTop / docHeight) * 100
      setProgress(Math.min(scrollPercent, 100))
    }

    window.addEventListener("scroll", updateProgress)
    return () => window.removeEventListener("scroll", updateProgress)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-secondary z-50">
      <div
        className="h-full bg-[#8FA68E] transition-all duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

// 目录组件
function TableOfContents({ headings }: { headings: { level: number; text: string; id: string }[] }) {
  if (headings.length === 0) return null

  return (
    <div className="hidden lg:block sticky top-24 h-fit">
      <h3 className="text-sm font-semibold mb-4 text-muted-foreground">Table of Contents</h3>
      <nav className="space-y-2">
        {headings.map((heading, index) => (
          <a
            key={index}
            href={`#${heading.id}`}
            className={`block text-sm hover:text-[#8FA68E] transition-colors ${
              heading.level === 3 ? "ml-4 text-muted-foreground" : "text-foreground"
            }`}
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

// 相关文章组件
function RelatedArticles({ posts }: { posts: RelatedPost[] }) {
  if (posts.length === 0) return null

  return (
    <div className="mt-12 pt-8 border-t border-border">
      <h3 className="text-lg font-semibold mb-4">Related Articles</h3>
      <div className="space-y-4">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/feed/${post.slug}`}
            className="block p-4 rounded-lg border border-border hover:border-[#8FA68E]/50 hover:bg-secondary/30 transition-colors"
          >
            <div className="text-xs text-muted-foreground mb-1">
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </div>
            <h4 className="font-medium line-clamp-2">{post.title}</h4>
            {post.excerpt && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {post.excerpt}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}

export function ArticleReader({ post, relatedPosts = [] }: ArticleReaderProps) {
  // 获取标签颜色
  const getTagColor = (tagName: string) => {
    const tag = tags.find((t) => t.slug === tagName)
    return tag?.color || "#8FA68E"
  }

  return (
    <>
      <ReadingProgress />
      
      <article className="max-w-4xl mx-auto">
        {/* 头部导航 */}
        <div className="flex items-center justify-between mb-8 py-4 border-b border-border/50 sticky top-0 bg-background/95 backdrop-blur-sm z-40">
          <Link href="/feed">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Feed
            </Button>
          </Link>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-12">
          {/* 主内容 */}
          <div>
            {/* 文章头部 */}
            <header className="mb-8">
              {/* 分类和日期 */}
              <div className="flex items-center gap-3 mb-4">
                {post.category && (
                  <span className={`
                    text-xs px-2 py-1 rounded-full
                    ${post.category === "article" && "bg-[#8FA68E]/10 text-[#8FA68E]"}
                    ${post.category === "log" && "bg-[#7A9CAE]/10 text-[#7A9CAE]"}
                    ${post.category === "news" && "bg-[#D4845E]/10 text-[#D4845E]"}
                  `}>
                    {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                  </span>
                )}
                <span className="text-sm text-muted-foreground">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>

              {/* 标题 */}
              <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                {post.title}
              </h1>

              {/* 作者信息 */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-medium">
                  {post.author.name[0]}
                </div>
                <div>
                  <div className="font-medium">{post.author.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {post.readTime} min read · {post.author.role || 'Author'}
                  </div>
                </div>
              </div>

              {/* 标签 */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 rounded-md"
                      style={{
                        backgroundColor: `${getTagColor(tag)}20`,
                        color: getTagColor(tag),
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {/* 摘要 */}
            {post.summary && (
              <div className="bg-secondary/50 border-l-4 border-[#8FA68E] p-4 mb-8 rounded-r-lg">
                <p className="text-muted-foreground italic">{post.summary}</p>
              </div>
            )}

            {/* 文章内容 */}
            <MarkdownPreview source={post.content} />

            {/* 底部互动 */}
            <div className="flex items-center justify-between pt-8 mt-12 border-t border-border">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" className="gap-2">
                  <Heart className="h-4 w-4" />
                  Like
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Comment
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  Was this helpful?
                </Button>
              </div>
            </div>

            {/* 相关文章 */}
            <RelatedArticles posts={relatedPosts} />
          </div>

          {/* 侧边栏：目录 */}
          <aside className="hidden lg:block">
            <TableOfContents headings={post.toc} />
          </aside>
        </div>
      </article>
    </>
  )
}
