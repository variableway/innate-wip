import { Metadata } from "next"
import Link from "next/link"
import {
  getAwesomeCategories,
  getAllAwesomeItems,
} from "@/lib/awesome/data"
import { AwesomeItemsClient } from "@/components/awesome-items-client"
import {
  Code,
  Briefcase,
  MessageSquare,
  BarChart3,
  Settings,
  Tag,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Awesome | Innate",
  description: "Curated list of awesome tools, skills, and resources.",
}

const iconMap: Record<string, React.ReactNode> = {
  code: <Code className="h-5 w-5" />,
  briefcase: <Briefcase className="h-5 w-5" />,
  "message-square": <MessageSquare className="h-5 w-5" />,
  "bar-chart": <BarChart3 className="h-5 w-5" />,
  settings: <Settings className="h-5 w-5" />,
}

export default async function AwesomePage() {
  const categories = await getAwesomeCategories()
  const items = await getAllAwesomeItems()

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto px-5 py-6 md:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Awesome</h1>
          <p className="text-sm text-muted-foreground/70 mt-1">
            Curated list of {items.length} awesome tools, skills, and resources.
          </p>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
          {categories.map((cat) => {
            const count = items.filter((i) => i.category === cat.slug).length
            return (
              <Link
                key={cat.slug}
                href={`/awesome/${cat.slug}`}
                className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:shadow-md hover:border-[#8FA68E]/30 transition-all duration-200"
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-transform group-hover:scale-105"
                  style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                >
                  {iconMap[cat.icon] || <Tag className="h-5 w-5" />}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-[#8FA68E] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-muted-foreground/60 mt-0.5">
                    {count} items
                  </p>
                </div>
              </Link>
            )
          })}
        </div>

        {/* All Items with search */}
        <AwesomeItemsClient items={items} categories={categories} />
      </div>
    </div>
  )
}
