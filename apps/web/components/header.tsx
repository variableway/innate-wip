"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Sun,
  Moon,
  PanelLeftOpen,
  PanelLeftClose,
  ChevronDown,
  BookOpen,
  PenLine,
  Globe,
  Newspaper,
  Hammer,
  FolderGit2,
  Calendar,
  Lightbulb,
  CheckSquare,
  FileText,
  Tag,
  Search,
} from "lucide-react"
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@innate/ui"

interface HeaderProps {
  collapsed: boolean
  onToggleSidebar: () => void
  isMobile: boolean
  categories: Array<{
    slug: string
    name: string
    icon: string
    color: string
    count: number
  }>
}

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

interface NavCategory {
  label: string
  icon: React.ReactNode
  items: NavItem[]
}

export function Header({ collapsed, onToggleSidebar, isMobile, categories }: HeaderProps) {
  const { setTheme, resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/") return pathname === href
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  const isCategoryActive = (items: NavItem[]) =>
    items.some((item) => isActive(item.href))

  const navCategories: NavCategory[] = [
    {
      label: "Content",
      icon: <BookOpen className="h-3.5 w-3.5" />,
      items: [
        { label: "Writing", href: "/writing", icon: <PenLine className="h-3.5 w-3.5" /> },
        { label: "Collections", href: "/collections", icon: <Globe className="h-3.5 w-3.5" /> },
      ],
    },
    {
      label: "Feed",
      icon: <Newspaper className="h-3.5 w-3.5" />,
      items: [
        { label: "Feed", href: "/feed", icon: <Newspaper className="h-3.5 w-3.5" /> },
      ],
    },
    {
      label: "Making",
      icon: <Hammer className="h-3.5 w-3.5" />,
      items: [
        { label: "Projects", href: "/making/projects", icon: <FolderGit2 className="h-3.5 w-3.5" /> },
        { label: "Weekly", href: "/making/weekly", icon: <Calendar className="h-3.5 w-3.5" /> },
        { label: "Insights", href: "/making/insights", icon: <Lightbulb className="h-3.5 w-3.5" /> },
        { label: "Issues", href: "/making/issues", icon: <CheckSquare className="h-3.5 w-3.5" /> },
      ],
    },
    {
      label: "Cheatsheets",
      icon: <FileText className="h-3.5 w-3.5" />,
      items: [
        { label: "Cheatsheets", href: "/cheatsheets", icon: <BookOpen className="h-3.5 w-3.5" /> },
        { label: "Better Stack Guides", href: "/betterstack-guides", icon: <FileText className="h-3.5 w-3.5" /> },
      ],
    },
    {
      label: "Awesome",
      icon: <Tag className="h-3.5 w-3.5" />,
      items: [
        { label: "All Items", href: "/awesome", icon: <Tag className="h-3.5 w-3.5" /> },
        ...categories.map((cat) => ({
          label: cat.name,
          href: `/awesome/${cat.slug}`,
          icon: (
            <span style={{ color: cat.color }}>
              <Tag className="h-3.5 w-3.5" />
            </span>
          ),
        })),
      ],
    },
  ]

  return (
    <header
      className={cn(
        "h-14 border-b border-[var(--border-strong)] bg-card/80 backdrop-blur-md flex items-center px-4 shrink-0 z-20",
        "md:px-6"
      )}
    >
      <div className="flex items-center justify-between w-full">
        {/* Left: toggle + nav */}
        <div className="flex items-center gap-1 min-w-0">
          {!isMobile && (
            <button
              onClick={onToggleSidebar}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors mr-1 focus-ring"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </button>
          )}

          <nav className="flex items-center gap-0.5">
            {navCategories.map((cat) => (
              <DropdownMenu key={cat.label}>
                <DropdownMenuTrigger asChild>
                  <button
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-default",
                      isCategoryActive(cat.items)
                        ? "text-foreground bg-secondary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    )}
                  >
                    {cat.icon}
                    <span>{cat.label}</span>
                    <ChevronDown className="h-3 w-3 opacity-60" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="min-w-[160px]">
                  {cat.items.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-2 cursor-pointer",
                          isActive(item.href) && "text-[var(--accent)] font-medium"
                        )}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ))}
          </nav>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
            className="hidden md:flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-xs text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors border border-[var(--border-strong)] focus-ring"
            aria-label="Open command palette"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="text-[11px]">Search</span>
            <kbd className="hidden lg:inline-flex h-4 min-w-[1rem] items-center justify-center rounded border border-[var(--border-strong)] bg-muted px-1 text-[10px] font-medium text-muted-foreground">
              ⌘K
            </kbd>
          </button>
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="relative w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors focus-ring"
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </button>
        </div>
      </div>
    </header>
  )
}
