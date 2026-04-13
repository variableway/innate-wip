"use client"

import { MarkdownPreview } from "@/components/markdown-preview"

interface TutorialContentProps {
  content: string
}

export function TutorialContent({ content }: TutorialContentProps) {
  return <MarkdownPreview source={content} />
}
