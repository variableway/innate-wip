"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from "@innate/ui"
import {
  PenLine,
  Globe,
  Newspaper,
  FolderGit2,
  Calendar,
  Lightbulb,
  CheckSquare,
  FileText,
  BookOpen,
  Tag,
  Home,
  Sun,
  Moon,
  Rss,
  Code,
  Search,
} from "lucide-react"
import { useTheme } from "next-themes"

interface CommandPaletteProps {
  categories: Array<{
    slug: string
    name: string
    icon: string
    color: string
    count: number
  }>
}

export function CommandPalette({ categories }: CommandPaletteProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const { theme, setTheme, resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const run = (href: string) => {
    setOpen(false)
    router.push(href)
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigate">
          <CommandItem onSelect={() => run("/")}>
            <Home className="h-4 w-4" />
            <span>Home</span>
            <CommandShortcut>⌘H</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => run("/writing")}>
            <PenLine className="h-4 w-4" />
            <span>Writing</span>
          </CommandItem>
          <CommandItem onSelect={() => run("/feed")}>
            <Newspaper className="h-4 w-4" />
            <span>Feed</span>
          </CommandItem>
          <CommandItem onSelect={() => run("/collections")}>
            <Globe className="h-4 w-4" />
            <span>Collections</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Making">
          <CommandItem onSelect={() => run("/making/projects")}>
            <FolderGit2 className="h-4 w-4" />
            <span>Projects</span>
          </CommandItem>
          <CommandItem onSelect={() => run("/making/weekly")}>
            <Calendar className="h-4 w-4" />
            <span>Weekly</span>
          </CommandItem>
          <CommandItem onSelect={() => run("/making/insights")}>
            <Lightbulb className="h-4 w-4" />
            <span>Insights</span>
          </CommandItem>
          <CommandItem onSelect={() => run("/making/issues")}>
            <CheckSquare className="h-4 w-4" />
            <span>Issues</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Knowledge">
          <CommandItem onSelect={() => run("/cheatsheets")}>
            <FileText className="h-4 w-4" />
            <span>Cheatsheets</span>
          </CommandItem>
          <CommandItem onSelect={() => run("/betterstack-guides")}>
            <BookOpen className="h-4 w-4" />
            <span>Better Stack Guides</span>
          </CommandItem>
          <CommandItem onSelect={() => run("/awesome")}>
            <Tag className="h-4 w-4" />
            <span>Awesome</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Awesome Categories">
          {categories.map((cat) => (
            <CommandItem
              key={cat.slug}
              onSelect={() => run(`/awesome/${cat.slug}`)}
            >
              <Tag className="h-4 w-4" style={{ color: cat.color }} />
              <span>{cat.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => setTheme(isDark ? "light" : "dark")}>
            {isDark ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            <span>Toggle Theme</span>
          </CommandItem>
          <CommandItem onSelect={() => run("/rss.xml")}>
            <Rss className="h-4 w-4" />
            <span>Open RSS Feed</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
