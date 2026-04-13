"use client"

import { useState, useEffect } from "react"
import { WritingList, WritingListItem } from "@/components/writing/writing-list"
import { WritingViewer, WritingViewerProps } from "@/components/writing/writing-viewer"
import { FileText } from "lucide-react"

interface WritingPostFull extends WritingListItem {
  html: string
  author: string
  toc: Array<{ id: string; text: string; level: number }>
}

interface WritingPageClientProps {
  posts: WritingPostFull[]
}

export function WritingPageClient({ posts }: WritingPageClientProps) {
  const [activeSlug, setActiveSlug] = useState<string>(posts[0]?.slug || "")
  const [isMobileDetail, setIsMobileDetail] = useState(false)

  const activePost = posts.find((p) => p.slug === activeSlug)

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

  return (
    <div className="flex flex-col h-full">
      {/* Page Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
        <FileText className="h-5 w-5 text-[#8FA68E]" />
        <div>
          <h1 className="text-lg font-bold text-foreground">Writing</h1>
          <p className="text-xs text-muted-foreground">
            Thoughts, ideas, and experiences shared with the world.
          </p>
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
            <WritingList
              items={posts.map(({ html: _html, author: _author, toc: _toc, ...rest }) => rest)}
              activeSlug={activeSlug}
              onSelect={handleSelect}
            />
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
              html={activePost.html}
              excerpt={activePost.excerpt}
              date={activePost.date}
              author={activePost.author}
              category={activePost.category}
              tags={activePost.tags}
              readingTime={activePost.readingTime}
              toc={activePost.toc}
              onBack={handleBack}
              isMobile={true}
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
