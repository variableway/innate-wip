import { ArrowLeft } from "lucide-react"
import {
  Badge,
  Button,
  ScrollArea,
} from "@innate/ui"
import { MarkdownPreview } from "../markdown-preview"
import { TableOfContents, type TocItem } from "../table-of-contents"
import { AppLink as Link } from "../../lib/routing"

export interface BlogViewerProps {
  title: string
  slug?: string
  content: string
  excerpt: string
  date: string
  author: string
  category: string
  tags: string[]
  readingTime: number
  toc: TocItem[]
  onBack?: () => void
  showToc?: boolean
  showDedicatedLink?: boolean
  onTagClick?: (tag: string) => void
  onCategoryClick?: (category: string) => void
}

export function BlogViewer({
  title,
  slug,
  content,
  date,
  author,
  category,
  tags,
  readingTime,
  toc,
  onBack,
  showToc = false,
  showDedicatedLink = false,
  onTagClick,
  onCategoryClick,
}: BlogViewerProps) {
  return (
    <article className="flex h-full min-h-0 flex-col">
      <header className="shrink-0 border-b border-border px-6 py-5 md:px-8">
        {onBack ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="mb-3 md:hidden"
          >
            <ArrowLeft data-icon="inline-start" />
            Back
          </Button>
        ) : null}
        <h1 className="text-foreground text-2xl font-semibold tracking-tight md:text-[1.75rem]">
          {title}
        </h1>
        <p className="text-muted-foreground mt-1.5 text-sm">
          Updated {date}
          <span className="mx-1.5">·</span>
          {readingTime} min read
          <span className="mx-1.5">·</span>
          {author}
        </p>
      </header>

      <ScrollArea className="min-h-0 flex-1">
        <div className="px-6 py-6 md:px-8 md:py-8">
          <div
            className={
              showToc
                ? "grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_12.5rem]"
                : undefined
            }
          >
            <MarkdownPreview source={content} />
            {showToc ? (
              <aside className="hidden lg:block">
                <TableOfContents headings={toc} />
              </aside>
            ) : null}
          </div>
        </div>
      </ScrollArea>

      <footer className="flex shrink-0 flex-wrap items-center gap-1.5 border-t border-border px-6 py-3 md:px-8">
        <Badge
          variant="secondary"
          render={
            onCategoryClick ? (
              <button type="button" onClick={() => onCategoryClick(category)} />
            ) : undefined
          }
        >
          {category}
        </Badge>
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="outline"
            render={
              onTagClick ? (
                <button type="button" onClick={() => onTagClick(tag)} />
              ) : undefined
            }
          >
            {tag}
          </Badge>
        ))}
        {showDedicatedLink && slug ? (
          <Link
            href={`/${slug}`}
            className="text-muted-foreground hover:text-foreground ml-auto text-xs underline-offset-4 hover:underline"
          >
            Open dedicated page
          </Link>
        ) : null}
      </footer>
    </article>
  )
}
