"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@allone/utils"
import { CheckSquare, Calendar, Hammer, FolderGit2, Lightbulb, PenLine, Globe, Rss, ChevronRight, BookOpen } from "lucide-react"
import { InnateLogoIcon } from "./innate-logo"

// Writing category
const writingCategory = {
  id: "writing",
  label: "Writing",
  icon: PenLine,
  href: "/writing",
}

// Making category with sub-items
const makingCategory = {
  id: "making",
  label: "Making",
  icon: Hammer,
  href: "/making",
  subItems: [
    {
      id: "projects",
      label: "项目",
      icon: FolderGit2,
      href: "/making/projects",
    },
    {
      id: "weekly",
      label: "周记录",
      icon: Calendar,
      href: "/making/weekly",
    },
    {
      id: "insights",
      label: "Insights",
      icon: Lightbulb,
      href: "/making/insights",
    },
    {
      id: "issues",
      label: "做什么",
      icon: CheckSquare,
      href: "/making/issues",
    },
  ],
}

export function Sidebar() {
  const pathname = usePathname()
  const [rssOpen, setRssOpen] = useState(false)
  const [makingOpen, setMakingOpen] = useState(true)

  // Auto-expand making when on a making sub-route
  useEffect(() => {
    if (pathname.startsWith("/making")) {
      setMakingOpen(true)
    }
  }, [pathname])

  return (
    <aside className="w-56 bg-card flex flex-col self-stretch">
      {/* Brand */}
      <div className="p-3">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            pathname === "/"
              ? "bg-primary text-primary-foreground"
              : "text-foreground hover:bg-secondary"
          )}
        >
          <InnateLogoIcon className="h-4 w-4" />
          <span>Innate</span>
        </Link>
      </div>

      {/* Divider */}
      <div className="mx-3 h-px bg-border" />

      {/* Making Category */}
      <div className="p-3 flex-1">
        <h3 className="text-xs font-medium text-muted-foreground px-3 mb-2">
          Category
        </h3>
        <nav className="flex flex-col gap-1">
          {/* Main Making Item - collapsible */}
          <button
            onClick={() => setMakingOpen(!makingOpen)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full text-left",
              pathname === makingCategory.href || pathname.startsWith(makingCategory.href + "/")
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <makingCategory.icon className="h-4 w-4" />
            <span className="flex-1">{makingCategory.label}</span>
            <ChevronRight className={cn("h-3 w-3 transition-transform", makingOpen && "rotate-90")} />
          </button>

          {/* Sub Items */}
          {makingOpen && (
            <div className="ml-4 mt-1 space-y-1">
              {makingCategory.subItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors",
                      pathname === item.href || pathname.startsWith(item.href + "/")
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          )}

          {/* Writing Item */}
          <Link
            href={writingCategory.href}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors mt-2",
              pathname === writingCategory.href || pathname.startsWith(writingCategory.href + "/")
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <writingCategory.icon className="h-4 w-4" />
            <span>{writingCategory.label}</span>
          </Link>

          {/* Cheatsheets Item */}
          <Link
            href="/cheatsheets"
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors mt-1",
              pathname === "/cheatsheets" || pathname.startsWith("/cheatsheets/")
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <BookOpen className="h-4 w-4" />
            <span>Cheatsheets</span>
          </Link>

          {/* Collections Item */}
          <Link
            href="/collections"
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors mt-1",
              pathname === "/collections" || pathname.startsWith("/collections/")
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <Globe className="h-4 w-4" />
            <span>Collections</span>
          </Link>
        </nav>
      </div>

      {/* RSS Feeds */}
      <div className="p-3 mt-auto">
        <div className="mx-1 h-px bg-border mb-3" />
        <button
          onClick={() => setRssOpen(!rssOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors w-full"
        >
          <Rss className="h-3.5 w-3.5" />
          <span className="flex-1 text-left">RSS Feeds</span>
          <ChevronRight className={cn("h-3 w-3 transition-transform", rssOpen && "rotate-90")} />
        </button>
        {rssOpen && (
          <nav className="flex flex-col gap-1 mt-1">
            <Link
              href="/feed/rss.xml"
              target="_blank"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <Rss className="h-3 w-3 text-orange-500" />
              <span>Writing</span>
            </Link>
            <Link
              href="/making/issues/rss.xml"
              target="_blank"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <Rss className="h-3 w-3 text-orange-500" />
              <span>Issues</span>
            </Link>
          </nav>
        )}
      </div>
    </aside>
  )
}
