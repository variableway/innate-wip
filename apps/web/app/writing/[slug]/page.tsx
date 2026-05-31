import { Metadata } from "next"
import { notFound } from "next/navigation"
import { evaluate } from "@mdx-js/mdx"
import * as runtime from "react/jsx-runtime"
import remarkGfm from "remark-gfm"
import rehypePrettyCode from "rehype-pretty-code"
import rehypeSlug from "rehype-slug"
import { getWritingMeta, getWriting, extractToc } from "@/lib/content"
import { remarkMermaid } from "@/lib/remark-mermaid"
import { MermaidBlock } from "@/components/mermaid-block"
import { BlogViewer } from "@/components/writing/blog-viewer"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = await getWritingMeta()
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getWriting(slug)
  if (!post) return { title: "Not Found" }
  return {
    title: `${post.meta.title} | Innate`,
    description: post.meta.excerpt || post.meta.title,
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = await getWriting(slug)
  if (!post) notFound()

  const toc = extractToc(post.content)
  const dateStr = new Date(post.meta.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  if (post.type === "mdx") {
    const { default: Content } = await evaluate(post.content, {
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
    } as any)

    return (
      <div className="flex flex-col h-full">
        <div className="flex flex-1 overflow-hidden justify-center">
          <div className="w-full max-w-5xl overflow-y-auto px-6 py-6">
            <article className="flex flex-col h-full">
              <div className="border-b border-border pb-4 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded uppercase tracking-wide bg-purple-500/10 text-purple-600 dark:text-purple-400">
                    {post.meta.category}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                    MDX
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-foreground leading-tight">
                  {post.meta.title}
                </h1>
                <div className="flex items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground mt-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-[11px] font-medium">
                      {post.meta.author[0]}
                    </div>
                    <span>{post.meta.author}</span>
                  </div>
                  <span>{dateStr}</span>
                  <span>{post.meta.readingTime || 1} min read</span>
                  {post.meta.tags.length > 0 && (
                    <>
                      <span className="text-muted-foreground/20 hidden sm:inline">|</span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {post.meta.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-0.5 text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-8">
                  <div className="markdown-content">
                    {post.meta.excerpt && (
                      <div className="bg-secondary/50 border-l-4 border-[#8FA68E] p-4 mb-6 rounded-r-lg">
                        <p className="text-muted-foreground italic text-sm">{post.meta.excerpt}</p>
                      </div>
                    )}
                    <Content components={{ MermaidBlock }} />
                  </div>
                  <aside>
                    {/* ToC placeholder for MDX */}
                  </aside>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-1 overflow-hidden justify-center">
        <div className="w-full max-w-5xl overflow-y-auto px-6 py-6">
          <BlogViewer
            title={post.meta.title}
            content={post.content}
            excerpt={post.meta.excerpt || ""}
            date={dateStr}
            author={post.meta.author}
            category={post.meta.category}
            tags={post.meta.tags}
            readingTime={post.meta.readingTime || 1}
            toc={toc}
            isMobile={false}
          />
        </div>
      </div>
    </div>
  )
}
