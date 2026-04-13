"use client"

import { MarkdownPreview } from "@/components/markdown-preview"

interface ServerMarkdownProps {
  content: string
  className?: string
}

// Full markdown renderer - now uses @uiw/react-markdown-preview
export function ServerMarkdown({ content, className }: ServerMarkdownProps) {
  return <MarkdownPreview source={content} className={className} />
}

// Simple version for inline content - also uses the same renderer
export function ServerMarkdownSimple({ content, className }: ServerMarkdownProps) {
  return <MarkdownPreview source={content} className={className} />
}
