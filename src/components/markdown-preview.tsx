import { Children, isValidElement, type ReactNode } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeSlug from "rehype-slug"
import rehypeHighlight from "rehype-highlight"
import { MermaidBlock } from "./mermaid-block"
import { AppLink as Link } from "../lib/routing"
import {
  extractMermaidChart,
  normalizeBlogMarkdown,
} from "../lib/content/mdx-source"

interface MarkdownPreviewProps {
  source: string
  className?: string
  style?: React.CSSProperties
}

function fencedCodeText(children: ReactNode): string {
  const child = Children.toArray(children)[0]
  if (!isValidElement(child)) return String(children ?? "").replace(/\n$/, "")
  return String(
    (child.props as { children?: unknown }).children ?? ""
  ).replace(/\n$/, "")
}

function fencedLanguage(children: ReactNode): string | undefined {
  const child = Children.toArray(children)[0]
  if (!isValidElement(child)) return undefined
  const className = (child.props as { className?: string }).className ?? ""
  return /language-(\w+)/.exec(className)?.[1]
}

export function MarkdownPreview({
  source,
  className,
  style,
}: MarkdownPreviewProps) {
  const markdown = normalizeBlogMarkdown(source)

  return (
    <div
      className={`markdown-content ${className || ""}`}
      style={style}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          [rehypeHighlight, { ignoreMissing: true, plainText: ["mermaid"] }],
          rehypeSlug,
        ]}
        components={{
          pre({ children }) {
            const lang = fencedLanguage(children)
            if (lang === "mermaid") {
              return (
                <MermaidBlock chart={extractMermaidChart(fencedCodeText(children))} />
              )
            }
            return <pre>{children}</pre>
          },
          a({ href, children }) {
            const external = Boolean(href?.startsWith("http"))
            if (href && !external && !href.startsWith("mailto:") && !href.startsWith("#")) {
              return <Link href={href}>{children}</Link>
            }
            return (
              <a
                href={href}
                {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
              >
                {children}
              </a>
            )
          },
          table({ children }) {
            return (
              <div className="markdown-table-wrap">
                <table>{children}</table>
              </div>
            )
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  )
}
