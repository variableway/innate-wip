"use client"

import dynamic from "next/dynamic"
import { useTheme } from "next-themes"

/**
 * Shared dynamic wrapper for @uiw/react-markdown-preview.
 * All markdown rendering across the project should use this component.
 *
 * - GitHub-style rendering with syntax highlighting
 * - Dark mode support via next-themes
 * - Dynamic import to avoid SSR issues
 * - Transparent background by default
 */

const MarkdownPreviewLib = dynamic(() => import("@uiw/react-markdown-preview"), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse space-y-3 p-4">
      <div className="h-5 bg-secondary rounded w-3/4" />
      <div className="h-4 bg-secondary rounded w-full" />
      <div className="h-4 bg-secondary rounded w-5/6" />
    </div>
  ),
})

interface MarkdownPreviewProps {
  source: string
  className?: string
  style?: React.CSSProperties
}

export function MarkdownPreview({ source, className, style }: MarkdownPreviewProps) {
  const { resolvedTheme } = useTheme()
  const colorMode = resolvedTheme === "dark" ? "dark" : "light"

  return (
    <div data-color-mode={colorMode}>
      <MarkdownPreviewLib
        source={source}
        className="!bg-transparent !p-0"
        style={{ backgroundColor: "transparent", padding: 0, fontSize: 14, ...style }}
        wrapperElement={{ "data-color-mode": colorMode }}
      />
    </div>
  )
}
