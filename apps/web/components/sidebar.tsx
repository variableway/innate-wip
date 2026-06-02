"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  PenLine,
  Menu,
  Code,
  Briefcase,
  MessageSquare,
  BarChart3,
  Settings,
  Github,
  Tag,
  Rss,
  Hammer,
  FolderGit2,
  Calendar,
  Lightbulb,
  CheckSquare,
  BookOpen,
  Globe,
  Newspaper,
  ChevronRight,
  FileText,
} from "lucide-react"

const iconMap: Record<string, React.ReactNode> = {
  code: <Code className="h-4 w-4" />,
  briefcase: <Briefcase className="h-4 w-4" />,
  "message-square": <MessageSquare className="h-4 w-4" />,
  "bar-chart": <BarChart3 className="h-4 w-4" />,
  settings: <Settings className="h-4 w-4" />,
}

interface Category {
  slug: string
  name: string
  icon: string
  color: string
  count: number
}

interface SidebarProps {
  categories: Category[]
  collapsed: boolean
  isMobile: boolean
}

function SidebarContent({
  categories,
  collapsed,
  mobile,
}: {
  categories: Category[]
  collapsed: boolean
  mobile?: boolean
}) {
  const pathname = usePathname()
  const [contentOpen, setContentOpen] = useState(true)
  const [feedOpen, setFeedOpen] = useState(true)
  const [makingOpen, setMakingOpen] = useState(true)
  const [cheatsheetsOpen, setCheatsheetsOpen] = useState(true)
  const [awesomeOpen, setAwesomeOpen] = useState(true)
  const [rssOpen, setRssOpen] = useState(false)

  // Auto-expand relevant sections based on current route
  useEffect(() => {
    if (pathname.startsWith("/writing") || pathname.startsWith("/collections")) {
      setContentOpen(true)
    }
    if (pathname.startsWith("/feed")) {
      setFeedOpen(true)
    }
    if (pathname.startsWith("/making")) {
      setMakingOpen(true)
    }
    if (pathname.startsWith("/cheatsheets") || pathname.startsWith("/betterstack-guides")) {
      setCheatsheetsOpen(true)
    }
    if (pathname.startsWith("/awesome")) {
      setAwesomeOpen(true)
    }
  }, [pathname])

  const isWriting = pathname === "/writing" || pathname.startsWith("/writing/")
  const isCollections = pathname === "/collections" || pathname.startsWith("/collections/")
  const isFeed = pathname === "/feed" || pathname.startsWith("/feed/")
  const isAwesomeRoot = pathname === "/awesome"
  const isMaking = pathname === "/making" || pathname.startsWith("/making/")
  const isCheatsheets = pathname === "/cheatsheets" || pathname.startsWith("/cheatsheets/")
  const isBetterstack = pathname === "/betterstack-guides" || pathname.startsWith("/betterstack-guides/")

  const categoryActive = (isActive: boolean) =>
    isActive
      ? "bg-[var(--accent-subtle)] text-[var(--accent)] font-semibold"
      : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"

  const itemActive = (isActive: boolean) =>
    isActive
      ? "bg-[var(--accent-subtle)] text-[var(--accent)] font-medium nav-item"
      : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground nav-item"

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-[var(--border-strong)] bg-card transition-all duration-200 ease-out",
        collapsed && !mobile ? "w-14" : "w-60"
      )}
    >
      {/* Header — just logo */}
      <div
        className={cn(
          "flex h-14 shrink-0 items-center border-b border-[var(--border-strong)] px-3",
          collapsed && !mobile ? "justify-center" : "justify-start"
        )}
      >
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2.5",
            collapsed && !mobile && "justify-center"
          )}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)]">
            <PenLine className="h-4 w-4 text-white" />
          </div>
          {!collapsed && !mobile && (
            <span className="text-sm font-semibold tracking-tight">Innate</span>
          )}
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3">
        {/* Content Category */}
        <div className="px-2 mb-1.5">
          <button
            onClick={() => setContentOpen(!contentOpen)}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors w-full text-left",
              categoryActive(isWriting || isCollections),
              collapsed && "justify-center px-0"
            )}
            title="Content"
          >
            <BookOpen className="h-4 w-4 shrink-0" />
            {!collapsed && (
              <>
                <span className="flex-1">Content</span>
                <ChevronRight className={cn("h-3 w-3 transition-transform duration-200", contentOpen && "rotate-90")} />
              </>
            )}
          </button>

          {contentOpen && !collapsed && (
            <div className="ml-2 mt-1 space-y-1 pb-1">
              <Link
                href="/writing"
                data-active={isWriting}
                className={cn("flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors", itemActive(isWriting))}
              >
                <PenLine className="h-3.5 w-3.5 shrink-0" />
                <span>Writing</span>
              </Link>
              <Link
                href="/collections"
                data-active={isCollections}
                className={cn("flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors", itemActive(isCollections))}
              >
                <Globe className="h-3.5 w-3.5 shrink-0" />
                <span>Collections</span>
              </Link>
            </div>
          )}
        </div>

        <div className="mx-3 my-1.5 border-t border-[var(--border-strong)]" />

        {/* Feed Category */}
        <div className="px-2 mb-1.5">
          <button
            onClick={() => setFeedOpen(!feedOpen)}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors w-full text-left",
              categoryActive(isFeed),
              collapsed && "justify-center px-0"
            )}
            title="Feed"
          >
            <Newspaper className="h-4 w-4 shrink-0" />
            {!collapsed && (
              <>
                <span className="flex-1">Feed</span>
                <ChevronRight className={cn("h-3 w-3 transition-transform duration-200", feedOpen && "rotate-90")} />
              </>
            )}
          </button>

          {feedOpen && !collapsed && (
            <div className="ml-2 mt-1 space-y-1 pb-1">
              <Link
                href="/feed"
                data-active={isFeed}
                className={cn("flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors", itemActive(isFeed))}
              >
                <Newspaper className="h-3.5 w-3.5 shrink-0" />
                <span>Feed</span>
              </Link>
            </div>
          )}
        </div>

        <div className="mx-3 my-1.5 border-t border-[var(--border-strong)]" />

        {/* Making Category */}
        <div className="px-2 mb-1.5">
          <button
            onClick={() => setMakingOpen(!makingOpen)}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors w-full text-left",
              categoryActive(isMaking),
              collapsed && "justify-center px-0"
            )}
            title="Making"
          >
            <Hammer className="h-4 w-4 shrink-0" />
            {!collapsed && (
              <>
                <span className="flex-1">Making</span>
                <ChevronRight className={cn("h-3 w-3 transition-transform duration-200", makingOpen && "rotate-90")} />
              </>
            )}
          </button>

          {makingOpen && !collapsed && (
            <div className="ml-2 mt-1 space-y-1 pb-1">
              <Link
                href="/making/projects"
                data-active={pathname === "/making/projects" || pathname.startsWith("/making/projects/")}
                className={cn("flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors", itemActive(pathname === "/making/projects" || pathname.startsWith("/making/projects/")))}
              >
                <FolderGit2 className="h-3.5 w-3.5 shrink-0" />
                <span>Projects</span>
              </Link>
              <Link
                href="/making/weekly"
                data-active={pathname === "/making/weekly" || pathname.startsWith("/making/weekly/")}
                className={cn("flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors", itemActive(pathname === "/making/weekly" || pathname.startsWith("/making/weekly/")))}
              >
                <Calendar className="h-3.5 w-3.5 shrink-0" />
                <span>Weekly</span>
              </Link>
              <Link
                href="/making/insights"
                data-active={pathname === "/making/insights" || pathname.startsWith("/making/insights/")}
                className={cn("flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors", itemActive(pathname === "/making/insights" || pathname.startsWith("/making/insights/")))}
              >
                <Lightbulb className="h-3.5 w-3.5 shrink-0" />
                <span>Insights</span>
              </Link>
              <Link
                href="/making/issues"
                data-active={pathname === "/making/issues" || pathname.startsWith("/making/issues/")}
                className={cn("flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors", itemActive(pathname === "/making/issues" || pathname.startsWith("/making/issues/")))}
              >
                <CheckSquare className="h-3.5 w-3.5 shrink-0" />
                <span>Issues</span>
              </Link>
            </div>
          )}
        </div>

        <div className="mx-3 my-1.5 border-t border-[var(--border-strong)]" />

        {/* Cheatsheets Category */}
        <div className="px-2 mb-1.5">
          <button
            onClick={() => setCheatsheetsOpen(!cheatsheetsOpen)}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors w-full text-left",
              categoryActive(isCheatsheets || isBetterstack),
              collapsed && "justify-center px-0"
            )}
            title="Cheatsheets"
          >
            <FileText className="h-4 w-4 shrink-0" />
            {!collapsed && (
              <>
                <span className="flex-1">Cheatsheets</span>
                <ChevronRight className={cn("h-3 w-3 transition-transform duration-200", cheatsheetsOpen && "rotate-90")} />
              </>
            )}
          </button>

          {cheatsheetsOpen && !collapsed && (
            <div className="ml-2 mt-1 space-y-1 pb-1">
              <Link
                href="/cheatsheets"
                data-active={isCheatsheets}
                className={cn("flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors", itemActive(isCheatsheets))}
              >
                <BookOpen className="h-3.5 w-3.5 shrink-0" />
                <span>Cheatsheets</span>
              </Link>
              <Link
                href="/betterstack-guides"
                data-active={isBetterstack}
                className={cn("flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors", itemActive(isBetterstack))}
              >
                <FileText className="h-3.5 w-3.5 shrink-0" />
                <span>Better Stack Guides</span>
              </Link>
            </div>
          )}
        </div>

        <div className="mx-3 my-1.5 border-t border-[var(--border-strong)]" />

        {/* Awesome Category */}
        <div className="px-2 mb-1.5">
          <button
            onClick={() => setAwesomeOpen(!awesomeOpen)}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors w-full text-left",
              categoryActive(isAwesomeRoot || pathname.startsWith("/awesome/")),
              collapsed && "justify-center px-0"
            )}
            title="Awesome"
          >
            <Tag className="h-4 w-4 shrink-0" />
            {!collapsed && (
              <>
                <span className="flex-1">Awesome</span>
                <ChevronRight className={cn("h-3 w-3 transition-transform duration-200", awesomeOpen && "rotate-90")} />
              </>
            )}
          </button>

          {awesomeOpen && !collapsed && (
            <div className="ml-2 mt-1 space-y-1 pb-1">
              <Link
                href="/awesome"
                data-active={isAwesomeRoot}
                className={cn("flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors", itemActive(isAwesomeRoot))}
              >
                <Tag className="h-3.5 w-3.5 shrink-0" />
                <span>All Items</span>
              </Link>
              {categories.map((cat) => {
                const isActive = pathname === `/awesome/${cat.slug}`
                return (
                  <Link
                    key={cat.slug}
                    href={`/awesome/${cat.slug}`}
                    data-active={isActive}
                    className={cn("flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors", itemActive(isActive))}
                  >
                    <span className="shrink-0" style={{ color: isActive ? cat.color : undefined }}>
                      {iconMap[cat.icon] || <Tag className="h-3.5 w-3.5" />}
                    </span>
                    <span className="flex-1 truncate">{cat.name}</span>
                    <span className="text-[10px] text-muted-foreground/50 tabular-nums">
                      {cat.count}
                    </span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </nav>

      {/* Footer */}
      <div className="shrink-0 border-t border-[var(--border-strong)] p-2 space-y-0.5">
        {!collapsed && (
          <button
            onClick={() => setRssOpen(!rssOpen)}
            className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-colors w-full"
          >
            <Rss className="h-4 w-4 shrink-0" />
            <span className="flex-1 text-left">RSS Feeds</span>
            <ChevronRight className={cn("h-3 w-3 transition-transform duration-200", rssOpen && "rotate-90")} />
          </button>
        )}
        {collapsed && (
          <a
            href="/rss.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-colors justify-center px-0"
            title="RSS Feed"
          >
            <Rss className="h-4 w-4 shrink-0" />
          </a>
        )}
        {rssOpen && !collapsed && (
          <div className="ml-2 space-y-0.5">
            <a
              href="/rss.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground hover:bg-secondary/60 hover:text-foreground transition-colors"
            >
              <Rss className="h-3 w-3 text-orange-500 shrink-0" />
              <span>Writing</span>
            </a>
            <a
              href="/making/issues/rss.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground hover:bg-secondary/60 hover:text-foreground transition-colors"
            >
              <Rss className="h-3 w-3 text-orange-500 shrink-0" />
              <span>Issues</span>
            </a>
          </div>
        )}
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-colors",
            collapsed && "justify-center px-0"
          )}
          title="GitHub"
        >
          <Github className="h-4 w-4 shrink-0" />
          {!collapsed && <span>GitHub</span>}
        </a>
      </div>
    </aside>
  )
}

export function Sidebar({ categories, collapsed, isMobile }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  if (isMobile) {
    return (
      <>
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed left-4 top-3 z-50 flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-strong)] bg-card/90 backdrop-blur text-muted-foreground shadow-sm hover:text-foreground transition-colors md:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-4 w-4" />
        </button>

        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden transition-opacity"
              onClick={() => setMobileOpen(false)}
            />
            <div className="fixed left-0 top-0 z-50 h-dvh w-60 bg-card shadow-2xl md:hidden animate-in slide-in-from-left duration-200">
              <SidebarContent
                categories={categories}
                collapsed={false}
                mobile
              />
            </div>
          </>
        )}
      </>
    )
  }

  return (
    <SidebarContent
      categories={categories}
      collapsed={collapsed}
    />
  )
}
