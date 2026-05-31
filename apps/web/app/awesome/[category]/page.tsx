import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  getAwesomeCategory,
  getAwesomeCategories,
  getAwesomeItemsByCategory,
} from "@/lib/awesome/data"
import {
  Code,
  Briefcase,
  MessageSquare,
  BarChart3,
  Settings,
  Tag,
  Github,
  ArrowLeft,
} from "lucide-react"
import { AwesomeItemsClient } from "@/components/awesome/awesome-items-client"

const iconMap: Record<string, React.ReactNode> = {
  code: <Code className="h-5 w-5" />,
  briefcase: <Briefcase className="h-5 w-5" />,
  "message-square": <MessageSquare className="h-5 w-5" />,
  "bar-chart": <BarChart3 className="h-5 w-5" />,
  settings: <Settings className="h-5 w-5" />,
}

interface Props {
  params: Promise<{ category: string }>
}

export async function generateStaticParams() {
  const slugs = await getAwesomeCategories()
  return slugs.map((c) => ({ category: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const cat = await getAwesomeCategory(category)
  if (!cat) return { title: "Not Found" }
  return {
    title: `${cat.name} | Awesome | Innate`,
    description: cat.description,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params
  const cat = await getAwesomeCategory(category)
  if (!cat) notFound()

  const items = await getAwesomeItemsByCategory(category)
  const categories = await getAwesomeCategories()

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto px-5 py-6 md:px-8">
        {/* Back + Header */}
        <div className="mb-6">
          <Link
            href="/awesome"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground/70 hover:text-foreground transition-colors mb-3 font-medium"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to Awesome
          </Link>

          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
            >
              {iconMap[cat.icon] || <Tag className="h-5 w-5" />}
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">{cat.name}</h1>
              <p className="text-xs text-muted-foreground/60">
                {items.length} {items.length === 1 ? "item" : "items"}
              </p>
            </div>
          </div>
        </div>

        {/* Items with search */}
        <AwesomeItemsClient items={items} categories={categories} />
      </div>
    </div>
  )
}
