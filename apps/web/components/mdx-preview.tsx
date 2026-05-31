"use client"

import { useEffect, useState } from "react"
import { evaluate } from "@mdx-js/mdx"
import * as runtime from "react/jsx-runtime"
import remarkGfm from "remark-gfm"
import rehypePrettyCode from "rehype-pretty-code"
import rehypeSlug from "rehype-slug"
import { remarkMermaid } from "@/lib/remark-mermaid"
import { MermaidBlock } from "./mermaid-block"

interface MdxPreviewProps {
  source: string
}

const components = { MermaidBlock }

export function MdxPreview({ source }: MdxPreviewProps) {
  const [Content, setContent] = useState<React.ComponentType<any> | null>(null)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    let cancelled = false

    evaluate(source, {
      ...runtime,
      remarkPlugins: [remarkGfm, remarkMermaid],
      rehypePlugins: [
        [
          rehypePrettyCode,
          {
            theme: {
              light: "github-light",
              dark: "github-dark",
            },
            keepBackground: true,
            defaultLang: "plaintext",
          },
        ],
        rehypeSlug,
      ],
    })
      .then((result) => {
        if (!cancelled) {
          setContent(() => result.default)
        }
      })
      .catch((err) => {
        console.error("MDX evaluation error:", err)
        if (!cancelled) {
          setError(err.message || "Failed to render MDX")
        }
      })

    return () => {
      cancelled = true
    }
  }, [source])

  if (error) {
    return (
      <div className="my-6 p-4 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/30">
        <p className="text-sm font-medium text-red-600 dark:text-red-400">MDX Error</p>
        <pre className="mt-2 text-xs text-red-500 overflow-x-auto">{error}</pre>
      </div>
    )
  }

  if (!Content) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="markdown-content">
      <Content components={components} />
    </div>
  )
}
