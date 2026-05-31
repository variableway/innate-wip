"use client"

import { useEffect, useRef, useState } from "react"
import mermaid from "mermaid"

interface MermaidBlockProps {
  chart?: string
  children?: React.ReactNode
}

let mermaidInitialized = false

function initMermaid() {
  if (mermaidInitialized) return
  mermaid.initialize({
    startOnLoad: false,
    theme: "default",
    securityLevel: "strict",
  })
  mermaidInitialized = true
}

function getTextFromChildren(node: React.ReactNode): string {
  if (typeof node === "string") return node
  if (typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(getTextFromChildren).join("")
  if (node && typeof node === "object" && "props" in node) {
    return getTextFromChildren((node as any).props.children)
  }
  return ""
}

export function MermaidBlock({ chart, children }: MermaidBlockProps) {
  const chartSource = (chart || getTextFromChildren(children) || "").trim()
  const containerRef = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [isDark, setIsDark] = useState(false)

  // Detect dark mode
  useEffect(() => {
    const check = () => {
      setIsDark(document.documentElement.classList.contains("dark"))
    }
    check()
    const observer = new MutationObserver(check)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    initMermaid()

    let cancelled = false
    const id = `mermaid-${Math.random().toString(36).slice(2, 11)}`

    // Re-initialize with appropriate theme when dark mode changes
    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? "dark" : "default",
      securityLevel: "strict",
    })

    mermaid
      .render(id, chartSource)
      .then(({ svg }) => {
        if (!cancelled) setSvg(svg)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to render diagram")
      })

    return () => {
      cancelled = true
    }
  }, [chartSource, isDark])

  if (error) {
    return (
      <div className="my-6 p-4 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-900">
        <p className="text-sm text-red-600 dark:text-red-400 font-medium">Mermaid Error</p>
        <pre className="mt-2 text-xs text-red-500 dark:text-red-400 overflow-x-auto">{error}</pre>
      </div>
    )
  }

  if (!svg) {
    return (
      <div className="my-6 p-8 rounded-lg border border-border bg-muted flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="mermaid-diagram my-6 flex justify-center overflow-x-auto rounded-lg border border-border/50 bg-card/30 p-4"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
