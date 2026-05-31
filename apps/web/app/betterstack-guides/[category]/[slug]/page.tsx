import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getAllGuideMetas, getGuideBySlug } from "@/lib/betterstack/data"
import { extractToc } from "@/lib/content/parser"
import { ServerMarkdown } from "@/components/server-markdown"
import { TableOfContents } from "@/components/table-of-contents"
import { ArrowLeft, BookOpen } from "lucide-react"

interface Props {
  params: Promise<{ category: string; slug: string }>
}

export async function generateStaticParams() {
  const guides = await getAllGuideMetas()
  return guides.map((g) => ({ category: g.category, slug: g.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params
  const guide = await getGuideBySlug(category, slug)
  if (!guide) return { title: "Not Found" }
  return {
    title: `${guide.title} | Better Stack Guides | Innate`,
  }
}

export default async function GuidePage({ params }: Props) {
  const { category, slug } = await params
  const guide = await getGuideBySlug(category, slug)
  if (!guide) notFound()

  const toc = extractToc(guide.content)

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-1 overflow-hidden justify-center">
        <div className="w-full max-w-5xl overflow-y-auto px-6 py-6">
          <article className="flex flex-col h-full">
            {/* Header */}
            <div className="border-b border-border pb-4 mb-6">
              <Link
                href="/betterstack-guides"
                className="inline-flex items-center gap-1 text-xs text-muted-foreground/70 hover:text-foreground transition-colors mb-3 font-medium"
              >
                <ArrowLeft className="h-3 w-3" />
                Back to Guides
              </Link>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] font-medium px-2 py-0.5 rounded uppercase tracking-wide bg-[#8FA68E]/10 text-[#6b856a] dark:text-[#a8c4a7]">
                  {guide.category}
                </span>
              </div>

              <h1 className="text-2xl font-bold text-foreground leading-tight">
                {guide.title}
              </h1>

              <p className="text-xs text-muted-foreground/60 mt-2">
                Source:{" "}
                <a
                  href={`https://betterstack.com${guide.filePath.replace(/.*packages\/betterstack-guides\/guides/, "").replace(".md", "/")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#8FA68E] hover:underline"
                >
                  betterstack.com
                </a>
              </p>
            </div>

            {/* Content with ToC */}
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-8">
                <div className="markdown-content">
                  <ServerMarkdown content={guide.content} />
                </div>
                <aside>
                  <TableOfContents headings={toc} />
                </aside>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  )
}
