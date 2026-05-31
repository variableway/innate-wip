import { Metadata } from "next"
import Link from "next/link"
import {
  getAllGuideMetas,
  getGuideCategories,
  getGuideCount,
} from "@/lib/betterstack/data"
import { BookOpen } from "lucide-react"

export const metadata: Metadata = {
  title: "Better Stack Guides | Innate",
  description: "Curated technical guides from Better Stack Community.",
}

export default async function BetterstackGuidesPage() {
  const guides = await getAllGuideMetas()
  const categories = await getGuideCategories()
  const total = await getGuideCount()

  const grouped = categories.map((cat) => ({
    category: cat,
    items: guides.filter((g) => g.category === cat),
  }))

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto px-5 py-6 md:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="h-6 w-6 text-[#8FA68E]" />
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Better Stack Guides
            </h1>
          </div>
          <p className="text-sm text-muted-foreground/70">
            {total} technical guides scraped from{" "}
            <a
              href="https://betterstack.com/community/guides"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8FA68E] hover:underline"
            >
              betterstack.com/community/guides
            </a>
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-8">
          {grouped.map(({ category, items }) =>
            items.length === 0 ? null : (
              <div key={category}>
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  {category}
                  <span className="ml-2 text-[10px] font-normal opacity-60">
                    {items.length}
                  </span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {items.map((item) => (
                    <Link
                      key={`${item.category}/${item.slug}`}
                      href={`/betterstack-guides/${item.category}/${item.slug}`}
                      className="group block rounded-xl border border-border bg-card p-4 hover:shadow-md hover:border-[#8FA68E]/30 transition-all duration-200"
                    >
                      <h3 className="text-sm font-semibold text-foreground group-hover:text-[#8FA68E] transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-[10px] text-muted-foreground/60 mt-2 uppercase tracking-wide">
                        {item.category}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}
