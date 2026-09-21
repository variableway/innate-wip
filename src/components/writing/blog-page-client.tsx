import { useEffect, useMemo, useState } from "react"
import {
  BookMarked,
  FileText,
  PenLine,
  Search,
} from "lucide-react"
import {
  Button,
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  Kbd,
  ScrollArea,
  Separator,
  cn,
  useIsMobile,
} from "@innate/ui"
import { BlogList, type BlogListItem } from "./blog-list"
import { BlogViewer } from "./blog-viewer"
import {
  countByCategory,
  filterWritingPosts,
} from "../../lib/writing/filter-posts"

export interface BlogPostFull extends BlogListItem {
  content: string
  author: string
  toc: Array<{ id: string; text: string; level: number }>
  type: "md" | "mdx"
}

interface BlogPageClientProps {
  posts: BlogPostFull[]
}

export function BlogPageClient({ posts }: BlogPageClientProps) {
  const isMobile = useIsMobile()
  const [query, setQuery] = useState("")
  const [filterTag, setFilterTag] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState<string | null>(null)
  const [activeSlug, setActiveSlug] = useState(posts[0]?.slug ?? "")
  const [mobileDetail, setMobileDetail] = useState(false)

  const notebooks = useMemo(() => countByCategory(posts), [posts])
  const recent = useMemo(() => posts.slice(0, 5), [posts])
  const filteredPosts = useMemo(
    () =>
      filterWritingPosts(posts, {
        query,
        category: filterCategory,
        tag: filterTag,
      }),
    [posts, query, filterCategory, filterTag]
  )

  useEffect(() => {
    if (filteredPosts.length === 0) return
    if (!filteredPosts.some((post) => post.slug === activeSlug)) {
      setActiveSlug(filteredPosts[0]!.slug)
    }
  }, [filteredPosts, activeSlug])

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        document.getElementById("writing-search")?.focus()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const activePost = filteredPosts.find((post) => post.slug === activeSlug)

  function selectPost(slug: string) {
    setActiveSlug(slug)
    if (isMobile) setMobileDetail(true)
  }

  function showAll() {
    setFilterCategory(null)
    setFilterTag(null)
  }

  const listTitle = filterCategory
    ? filterCategory
    : filterTag
      ? `#${filterTag}`
      : "All Notes"

  const sidebar = (
    <WritingNav
      total={posts.length}
      notebooks={notebooks}
      recent={recent}
      activeSlug={activeSlug}
      filterCategory={filterCategory}
      query={query}
      onQueryChange={setQuery}
      onShowAll={showAll}
      onSelectCategory={(id) => {
        setFilterCategory(id)
        setFilterTag(null)
      }}
      onSelectRecent={selectPost}
    />
  )

  const listPane = (
    <section className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden border-r border-border bg-background">
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-border px-4">
        <h2 className="text-sm font-semibold capitalize">{listTitle}</h2>
        <span className="text-muted-foreground text-xs tabular-nums">
          {filteredPosts.length}
        </span>
      </div>
      <ScrollArea className="min-h-0 flex-1">
        {filteredPosts.length > 0 ? (
          <BlogList
            items={filteredPosts}
            activeSlug={activeSlug}
            onSelect={selectPost}
            onTagClick={(tag) => {
              setFilterTag(tag)
              setFilterCategory(null)
            }}
          />
        ) : (
          <Empty className="h-full border-0">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileText />
              </EmptyMedia>
              <EmptyTitle>No notes match</EmptyTitle>
              <EmptyDescription>
                Try another search, category, or tag.
              </EmptyDescription>
            </EmptyHeader>
            <Button type="button" variant="ghost" size="sm" onClick={showAll}>
              Clear filters
            </Button>
          </Empty>
        )}
      </ScrollArea>
    </section>
  )

  const detailPane = (
    <section className="bg-background flex h-full min-h-0 min-w-0 flex-col overflow-hidden">
      {activePost ? (
        <BlogViewer
          title={activePost.title}
          slug={activePost.slug}
          content={activePost.content}
          excerpt={activePost.excerpt}
          date={activePost.date}
          author={activePost.author}
          category={activePost.category}
          tags={activePost.tags}
          readingTime={activePost.readingTime}
          toc={activePost.toc}
          showDedicatedLink
          onBack={() => setMobileDetail(false)}
          onTagClick={(tag) => {
            setFilterTag(tag)
            setFilterCategory(null)
            setMobileDetail(false)
          }}
          onCategoryClick={(category) => {
            setFilterCategory(category)
            setFilterTag(null)
            setMobileDetail(false)
          }}
        />
      ) : (
        <Empty className="h-full border-0">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileText />
            </EmptyMedia>
            <EmptyTitle>Select a note</EmptyTitle>
            <EmptyDescription>
              Choose an article from the list.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </section>
  )

  return (
    <div
      className={cn(
        "grid h-full min-h-0 w-full overflow-hidden",
        "grid-cols-1 md:grid-cols-[22rem_minmax(0,1fr)] xl:grid-cols-[16rem_22rem_minmax(0,1fr)]"
      )}
    >
      <aside className="hidden min-h-0 min-w-0 overflow-hidden xl:block">
        {sidebar}
      </aside>
      <div
        className={cn(
          "min-h-0 min-w-0 overflow-hidden",
          isMobile && mobileDetail && "hidden"
        )}
      >
        {listPane}
      </div>
      <div
        className={cn(
          "min-h-0 min-w-0 overflow-hidden",
          isMobile && !mobileDetail && "hidden"
        )}
      >
        {detailPane}
      </div>
    </div>
  )
}

function WritingNav({
  total,
  notebooks,
  recent,
  activeSlug,
  filterCategory,
  query,
  onQueryChange,
  onShowAll,
  onSelectCategory,
  onSelectRecent,
}: {
  total: number
  notebooks: Array<{ id: string; count: number }>
  recent: BlogListItem[]
  activeSlug: string
  filterCategory: string | null
  query: string
  onQueryChange: (value: string) => void
  onShowAll: () => void
  onSelectCategory: (id: string) => void
  onSelectRecent: (slug: string) => void
}) {
  return (
    <nav
      aria-label="Writing"
      className="bg-sidebar text-sidebar-foreground flex h-full min-h-0 flex-col border-r border-sidebar-border"
    >
      <div className="flex h-12 shrink-0 items-center gap-2 px-4">
        <PenLine className="size-4" data-icon />
        <span className="text-sm font-semibold">Writing</span>
      </div>
      <div className="px-3 pb-3">
        <InputGroup>
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupInput
            id="writing-search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search…"
            aria-label="Search notes"
          />
          <InputGroupAddon align="inline-end">
            <Kbd>⌘K</Kbd>
          </InputGroupAddon>
        </InputGroup>
      </div>
      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col gap-4 px-2 pb-4">
          <NavRow
            icon={FileText}
            label="Notes"
            count={total}
            active={!filterCategory}
            onClick={onShowAll}
          />
          <SectionLabel>Recent notes</SectionLabel>
          <ul className="flex flex-col gap-0.5">
            {recent.map((post) => (
              <li key={post.slug}>
                <button
                  type="button"
                  onClick={() => onSelectRecent(post.slug)}
                  className={cn(
                    "hover:bg-sidebar-accent w-full truncate rounded-md px-2 py-1.5 text-left text-[13px]",
                    post.slug === activeSlug && "bg-sidebar-accent font-medium"
                  )}
                >
                  {post.title}
                </button>
              </li>
            ))}
          </ul>
          <Separator className="mx-2" />
          <SectionLabel>Notebooks</SectionLabel>
          <ul className="flex flex-col gap-0.5">
            {notebooks.map((notebook) => (
              <li key={notebook.id}>
                <NavRow
                  icon={BookMarked}
                  label={notebook.id}
                  count={notebook.count}
                  active={filterCategory === notebook.id}
                  onClick={() => onSelectCategory(notebook.id)}
                />
              </li>
            ))}
          </ul>
        </div>
      </ScrollArea>
    </nav>
  )
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-muted-foreground px-2 text-[11px] font-semibold tracking-wider uppercase">
      {children}
    </p>
  )
}

function NavRow({
  icon: Icon,
  label,
  count,
  active,
  onClick,
}: {
  icon: typeof FileText
  label: string
  count: number
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-active={active}
      className={cn(
        "hover:bg-sidebar-accent flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm capitalize",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium"
      )}
    >
      <Icon className="size-4 shrink-0" data-icon="inline-start" />
      <span className="min-w-0 flex-1 truncate text-left">{label}</span>
      <span className="text-muted-foreground text-xs tabular-nums">{count}</span>
    </button>
  )
}
