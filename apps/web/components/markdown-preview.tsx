"use client"

import { useEffect, useRef } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeSlug from "rehype-slug"
import rehypeHighlight from "rehype-highlight"
import mermaid from "mermaid"

interface MarkdownPreviewProps {
  source: string
  className?: string
  style?: React.CSSProperties
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

export function MarkdownPreview({ source, className, style }: MarkdownPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Progressive enhancement: find mermaid code blocks and render them
  useEffect(() => {
    if (!containerRef.current) return
    initMermaid()

    const isDark = document.documentElement.classList.contains("dark")
    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? "dark" : "default",
      securityLevel: "strict",
    })

    const blocks = containerRef.current.querySelectorAll(
      'pre code.language-mermaid'
    )

    const renders: Promise<void>[] = []

    blocks.forEach((block) => {
      const pre = block.parentElement
      if (!pre) return

      const chart = block.textContent || ""
      const id = `mermaid-${Math.random().toString(36).slice(2, 11)}`
      const wrapper = document.createElement("div")
      wrapper.className = "mermaid-diagram my-6 flex justify-center overflow-x-auto rounded-lg border border-border/50 bg-card/30 p-4"

      // Replace pre with placeholder immediately to prevent flash
      pre.replaceWith(wrapper)

      const renderPromise = mermaid
        .render(id, chart.trim())
        .then(({ svg }) => {
          wrapper.innerHTML = svg
        })
        .catch((err) => {
          wrapper.innerHTML = `<div class="p-4 rounded border border-red-200 bg-red-50 text-red-600 text-sm">Mermaid Error: ${err.message}</div>`
        })

      renders.push(renderPromise)
    })

    return () => {
      // Cleanup handled by DOM replacement
    }
  }, [source])

  return (
    <div
      ref={containerRef}
      className={`markdown-content !bg-transparent !p-0 ${className || ""}`}
      style={style}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeSlug]}
      >
        {source}
      </ReactMarkdown>
    </div>
  )
}
