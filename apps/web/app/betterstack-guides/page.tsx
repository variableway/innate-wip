import { Metadata } from "next"
import Link from "next/link"
import {
  getAllGuideMetas,
  getGuideCategories,
  getGuideCount,
} from "@/lib/betterstack/data"
import {
  BookOpen,
  Terminal,
  Database,
  Server,
  Cloud,
  Shield,
  Cpu,
  Code,
  BarChart3,
  Globe,
  Layers,
  ArrowRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Better Stack Guides | Innate",
  description: "Curated technical guides from Better Stack Community.",
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  logging: <Terminal className="h-4 w-4" />,
  monitoring: <BarChart3 className="h-4 w-4" />,
  "scaling-nodejs": <Code className="h-4 w-4" />,
  "scaling-go": <Cpu className="h-4 w-4" />,
  "scaling-php": <Server className="h-4 w-4" />,
  "scaling-docker": <Cloud className="h-4 w-4" />,
  "database-platforms": <Database className="h-4 w-4" />,
  observability: <Layers className="h-4 w-4" />,
  "web-servers": <Globe className="h-4 w-4" />,
}

const CATEGORY_COLORS: Record<string, string> = {
  logging: "#22c55e",
  monitoring: "#3b82f6",
  "scaling-nodejs": "#f59e0b",
  "scaling-go": "#06b6d4",
  "scaling-php": "#8b5cf6",
  "scaling-docker": "#14b8a6",
  "database-platforms": "#ec4899",
  observability: "#f97316",
  "web-servers": "#6366f1",
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#14b8a6]/10">
              <BookOpen className="h-5 w-5 text-[#14b8a6]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                Better Stack Guides
              </h1>
              <p className="text-xs text-muted-foreground/60">
                {total} technical guides from{" "}
                <a
                  href="https://betterstack.com/community/guides"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#14b8a6] hover:underline"
                >
                  betterstack.com/community/guides
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Category pills */}
        <div className="flex items-center gap-x-2 gap-y-1.5 flex-wrap mb-8">
          {categories.map((cat) => {
            const color = CATEGORY_COLORS[cat] || "#8FA68E"
            return (
              <a
                key={cat}
                href={`#${cat}`}
                className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              >
                <span style={{ color }}>{CATEGORY_ICONS[cat] || <BookOpen className="h-3 w-3" />}</span>
                <span className="capitalize">{cat.replace(/-/g, " ")}</span>
              </a>
            )
          })}
        </div>

        {/* Categories */}
        <div className="space-y-10">
          {grouped.map(({ category, items }) =>
            items.length === 0 ? null : (
              <div key={category} id={category}>
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="flex h-7 w-7 items-center justify-center rounded-lg"
                    style={{
                      backgroundColor: `${CATEGORY_COLORS[category] || "#8FA68E"}15`,
                      color: CATEGORY_COLORS[category] || "#8FA68E",
                    }}
                  >
                    {CATEGORY_ICONS[category] || <BookOpen className="h-3.5 w-3.5" />}
                  </div>
                  <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                    {category.replace(/-/g, " ")}
                  </h2>
                  <span className="text-[10px] text-muted-foreground/50 font-normal">
                    {items.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {items.map((item) => (
                    <Link
                      key={`${item.category}/${item.slug}`}
                      href={`/betterstack-guides/${item.category}/${item.slug}`}
                      className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 hover:shadow-md hover:border-[#8FA68E]/30 transition-all duration-200"
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-foreground group-hover:text-[#8FA68E] transition-colors line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-[10px] text-muted-foreground/50 mt-1.5 uppercase tracking-wide">
                          {item.category.replace(/-/g, " ")}
                        </p>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-[#8FA68E] group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
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
