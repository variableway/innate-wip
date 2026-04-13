"use client"

import React from "react"
import { MarkdownPreview } from "@/components/markdown-preview"

interface MarkdownRendererProps {
  content: string
  className?: string
}

// Full markdown renderer - now uses @uiw/react-markdown-preview
export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return <MarkdownPreview source={content} className={className} />
}

// Simple version - shows a plain text preview
export function MarkdownRendererSimple({ content, className }: MarkdownRendererProps) {
  const preview = getPreviewText(content, 200)

  return (
    <span className={className}>
      {preview}
    </span>
  )
}

// Strip markdown to plain text for preview
function stripMarkdown(md: string): string {
  return md
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*\*?([^*]+)\*\*\*?/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

// Get preview text from markdown
function getPreviewText(content: string, maxLength: number = 200): string {
  const plain = stripMarkdown(content)
  return plain.length > maxLength ? plain.slice(0, maxLength) + '...' : plain
}
