"use client"

import Link from "next/link"
import { Cheatsheet } from "@/lib/cheatsheets/types"
import { Badge } from "@innate/ui"
import { ArrowLeft, BookOpen, Calendar, Tag } from "lucide-react"
import { ServerMarkdown } from "@/components/server-markdown"

interface Props {
  cheatsheet: Cheatsheet
}

export function CheatsheetDetailClient({ cheatsheet }: Props) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border">
        <Link
          href="/cheatsheets"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Cheatsheets
        </Link>

        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5 text-blue-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-foreground mb-1">
              {cheatsheet.title}
            </h1>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs">
                {cheatsheet.category}
              </Badge>
              {cheatsheet.updated && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {cheatsheet.updated}
                </span>
              )}
              {cheatsheet.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded"
                >
                  <Tag className="h-2.5 w-2.5" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ServerMarkdown content={cheatsheet.content} />
          </div>
        </div>
      </div>
    </div>
  )
}
