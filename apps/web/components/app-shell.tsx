"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { CommandPalette } from "@/components/command-palette"

interface AppShellProps {
  categories: Array<{
    slug: string
    name: string
    icon: string
    color: string
    count: number
  }>
  children: React.ReactNode
}

export function AppShell({ categories, children }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background">
      <Sidebar
        categories={categories}
        collapsed={collapsed}
        isMobile={isMobile}
      />
      <div className="flex flex-1 flex-col min-w-0">
        <Header
          collapsed={collapsed}
          onToggleSidebar={() => setCollapsed((c) => !c)}
          isMobile={isMobile}
          categories={categories}
        />
        <CommandPalette categories={categories} />
        <main className="flex-1 overflow-hidden relative">{children}</main>
      </div>
    </div>
  )
}
