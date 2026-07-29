"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  PenLine,
  Menu,
  Github,
  Rss,
  BookOpen,
  Globe,
  Newspaper,
  ChevronRight,
} from "lucide-react"
import type { SitePlugin } from "@/lib/plugins/types"
import { PluginIcon } from "@/lib/plugins/icons"

interface Category {
  slug: string
  name: string
  icon: string
  color: string
  count: number
}

interface SidebarProps {
  categories: Category[]
  plugins: SitePlugin[]
  collapsed: boolean
  isMobile: boolean
}

function SidebarContent({
  plugins,
  collapsed,
  mobile,
}: {
  categories: Category[]
  plugins: SitePlugin[]
  collapsed: boolean
  mobile?: boolean
}) {
  const pathname = usePathname()
  const [contentOpen, setContentOpen] = useState(true)
  const [feedOpen, setFeedOpen] = useState(true)
  const [rssOpen, setRssOpen] = useState(false)
  const [pluginOpen, setPluginOpen] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (pathname.startsWith("/writing") || pathname.startsWith("/collections")) {
      setContentOpen(true)
    }
    if (pathname.startsWith("/feed")) {
      setFeedOpen(true)
    }
    for (const plugin of plugins) {
      const active = plugin.nav.items.some(
        (item) => pathname === item.href || pathname.startsWith(`${item.href}/`)
      )
      if (active) {
        setPluginOpen((prev) => ({ ...prev, [plugin.id]: true }))
      }
    }
  }, [pathname, plugins])

  const isWriting = pathname === "/writing" || pathname.startsWith("/writing/")
  const isCollections =
    pathname === "/collections" || pathname.startsWith("/collections/")
  const isFeed = pathname === "/feed" || pathname.startsWith("/feed/")

  const categoryActive = (isActive: boolean) =>
    isActive
      ? "bg-[var(--accent-subtle)] text-[var(--accent)] font-semibold"
      : "text-muted-foreground hover:bg-secondary/80 hover:text-foreground"

  const itemActive = (isActive: boolean) =>
    isActive
      ? "bg-[var(--accent-subtle)] text-[var(--accent)] font-medium nav-item"
      : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground nav-item"

  const isHrefActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`)

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-[var(--border-strong)] bg-card transition-all duration-200 ease-out",
        collapsed && !mobile ? "w-14" : "w-60"
      )}
    >
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

      <nav className="flex-1 overflow-y-auto py-3">
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
                <ChevronRight
                  className={cn(
                    "h-3 w-3 transition-transform duration-200",
                    contentOpen && "rotate-90"
                  )}
                />
              </>
            )}
          </button>

          {contentOpen && !collapsed && (
            <div className="ml-2 mt-1 space-y-1 pb-1">
              <Link
                href="/writing"
                data-active={isWriting}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors",
                  itemActive(isWriting)
                )}
              >
                <PenLine className="h-3.5 w-3.5 shrink-0" />
                <span>Writing</span>
              </Link>
              <Link
                href="/collections"
                data-active={isCollections}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors",
                  itemActive(isCollections)
                )}
              >
                <Globe className="h-3.5 w-3.5 shrink-0" />
                <span>Collections</span>
              </Link>
            </div>
          )}
        </div>

        <div className="mx-3 my-1.5 border-t border-[var(--border-strong)]" />

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
                <ChevronRight
                  className={cn(
                    "h-3 w-3 transition-transform duration-200",
                    feedOpen && "rotate-90"
                  )}
                />
              </>
            )}
          </button>

          {feedOpen && !collapsed && (
            <div className="ml-2 mt-1 space-y-1 pb-1">
              <Link
                href="/feed"
                data-active={isFeed}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors",
                  itemActive(isFeed)
                )}
              >
                <Newspaper className="h-3.5 w-3.5 shrink-0" />
                <span>Feed</span>
              </Link>
            </div>
          )}
        </div>

        {plugins.map((plugin) => {
          const items = [...plugin.nav.items].sort(
            (a, b) => (a.order ?? 0) - (b.order ?? 0)
          )
          const sectionActive = items.some((item) => isHrefActive(item.href))
          const open = pluginOpen[plugin.id] ?? true

          return (
            <div key={plugin.id}>
              <div className="mx-3 my-1.5 border-t border-[var(--border-strong)]" />
              <div className="px-2 mb-1.5">
                <button
                  onClick={() =>
                    setPluginOpen((prev) => ({
                      ...prev,
                      [plugin.id]: !open,
                    }))
                  }
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors w-full text-left",
                    categoryActive(sectionActive),
                    collapsed && "justify-center px-0"
                  )}
                  title={plugin.nav.sectionLabel}
                >
                  <PluginIcon
                    name={plugin.nav.sectionIcon}
                    className="h-4 w-4 shrink-0"
                  />
                  {!collapsed && (
                    <>
                      <span className="flex-1">{plugin.nav.sectionLabel}</span>
                      <ChevronRight
                        className={cn(
                          "h-3 w-3 transition-transform duration-200",
                          open && "rotate-90"
                        )}
                      />
                    </>
                  )}
                </button>

                {open && !collapsed && (
                  <div className="ml-2 mt-1 space-y-1 pb-1">
                    {items.map((item) => {
                      const active = isHrefActive(item.href)
                      return (
                        <Link
                          key={item.id}
                          href={item.href}
                          data-active={active}
                          className={cn(
                            "flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors",
                            itemActive(active)
                          )}
                        >
                          <PluginIcon name={item.icon} />
                          <span>{item.label}</span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </nav>

      <div className="shrink-0 border-t border-[var(--border-strong)] p-2 space-y-0.5">
        {!collapsed && (
          <button
            onClick={() => setRssOpen(!rssOpen)}
            className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-colors w-full"
          >
            <Rss className="h-4 w-4 shrink-0" />
            <span className="flex-1 text-left">RSS Feeds</span>
            <ChevronRight
              className={cn(
                "h-3 w-3 transition-transform duration-200",
                rssOpen && "rotate-90"
              )}
            />
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
          </div>
        )}
        <a
          href="https://github.com/variableway/innate-wip"
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-colors",
            collapsed && "justify-center px-0"
          )}
          title="GitHub Repository"
        >
          <Github className="h-4 w-4 shrink-0" />
          {!collapsed && <span>GitHub</span>}
        </a>
      </div>
    </aside>
  )
}

export function Sidebar({ categories, plugins, collapsed, isMobile }: SidebarProps) {
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
                plugins={plugins}
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
      plugins={plugins}
      collapsed={collapsed}
    />
  )
}
