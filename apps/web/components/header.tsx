"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Sun, Moon, PanelLeftOpen, PanelLeftClose } from "lucide-react"
import { useTheme } from "next-themes"

interface HeaderProps {
  collapsed: boolean
  onToggleSidebar: () => void
  isMobile: boolean
}

export function Header({ collapsed, onToggleSidebar, isMobile }: HeaderProps) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const pathname = usePathname()

  const isWriting = pathname === "/writing" || pathname.startsWith("/writing/")
  const isAwesome = pathname === "/awesome" || pathname.startsWith("/awesome/")

  return (
    <header
      className={cn(
        "h-14 border-b border-border bg-card/80 backdrop-blur-md flex items-center px-4 shrink-0 z-20",
        "md:px-6"
      )}
    >
      <div className="flex items-center justify-between w-full">
        {/* Left: toggle + nav */}
        <div className="flex items-center gap-1 min-w-0">
          {!isMobile && (
            <button
              onClick={onToggleSidebar}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors mr-1"
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
            <Link
              href="/writing"
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                isWriting
                  ? "text-foreground bg-secondary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              Writing
            </Link>
            <Link
              href="/awesome"
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                isAwesome
                  ? "text-foreground bg-secondary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              Awesome
            </Link>
          </nav>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="relative w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
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
