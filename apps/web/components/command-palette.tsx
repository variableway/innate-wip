"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@innate/ui"
import { PenLine, Tag, Search } from "lucide-react"

export interface SearchItem {
  type: "awesome" | "writing"
  title: string
  subtitle?: string
  href: string
}

interface CommandPaletteProps {
  searchData: SearchItem[]
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function CommandPalette({ searchData, open: openProp, onOpenChange }: CommandPaletteProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [query, setQuery] = useState("")
  const open = openProp ?? internalOpen
  const openRef = useRef(open)
  openRef.current = open

  const setOpen = (next: boolean | ((prev: boolean) => boolean)) => {
    const resolved = typeof next === "function" ? next(openRef.current) : next
    if (onOpenChange) {
      onOpenChange(resolved)
    } else {
      setInternalOpen(resolved)
    }
  }

  const router = useRouter()

  // Reset query whenever the palette closes
  useEffect(() => {
    if (!open) setQuery("")
  }, [open])

  // ⌘K / Ctrl+K toggles the palette
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    const tokens = q.split(/\s+/).filter(Boolean)
    return searchData
      .map((item) => {
        const haystack = `${item.title} ${item.subtitle ?? ""}`.toLowerCase()
        const score = tokens.reduce(
          (acc, t) => acc + (haystack.includes(t) ? 1 : 0),
          0
        )
        return { item, score }
      })
      .filter((r) => r.score === tokens.length)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20)
      .map((r) => r.item)
  }, [query, searchData])

  const run = (href: string) => {
    setOpen(false)
    router.push(href)
  }

  const writingResults = results.filter((r) => r.type === "writing")
  const awesomeResults = results.filter((r) => r.type === "awesome")

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-xl w-[calc(100vw-2rem)]"
    >
      <CommandInput
        autoFocus
        placeholder="Search posts, awesome lists..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {query.trim() === "" ? (
          <CommandEmpty className="py-8">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Search className="h-5 w-5 opacity-40" />
              <span>Start typing to search.</span>
            </div>
          </CommandEmpty>
        ) : results.length === 0 ? (
          <CommandEmpty>No results found.</CommandEmpty>
        ) : (
          <>
            {writingResults.length > 0 && (
              <CommandGroup heading="Writing">
                {writingResults.map((r) => (
                  <CommandItem key={r.href} onSelect={() => run(r.href)}>
                    <PenLine className="h-4 w-4" />
                    <div className="flex flex-col min-w-0">
                      <span className="truncate">{r.title}</span>
                      {r.subtitle && (
                        <span className="text-[11px] text-muted-foreground truncate">
                          {r.subtitle}
                        </span>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {awesomeResults.length > 0 && (
              <CommandGroup heading="Awesome">
                {awesomeResults.map((r) => (
                  <CommandItem key={r.href} onSelect={() => run(r.href)}>
                    <Tag className="h-4 w-4" />
                    <div className="flex flex-col min-w-0">
                      <span className="truncate">{r.title}</span>
                      {r.subtitle && (
                        <span className="text-[11px] text-muted-foreground truncate">
                          {r.subtitle}
                        </span>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </>
        )}
      </CommandList>
    </CommandDialog>
  )
}