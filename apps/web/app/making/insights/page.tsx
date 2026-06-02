import Link from "next/link"
import { Lightbulb, Calendar, ArrowRight, FileText } from "lucide-react"
import { Badge } from "@innate/ui"
import { insights } from "@/lib/making/data"

export default function InsightsPage() {
  const sorted = [...insights].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const categories = Array.from(new Set(insights.map((i) => i.category)))

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f97316]/10">
              <Lightbulb className="h-5 w-5 text-[#f97316]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">Insights</h1>
              <p className="text-xs text-muted-foreground/60">
                {sorted.length} insights across {categories.length} categories
              </p>
            </div>
          </div>
        </div>

        {/* Category pills */}
        <div className="flex items-center gap-x-2 gap-y-1.5 flex-wrap mb-8">
          {categories.map((cat) => (
            <span
              key={cat}
              className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-muted text-muted-foreground capitalize"
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Insights list */}
        <div className="space-y-3">
          {sorted.map((insight) => (
            <Link
              key={insight.id}
              href={`/making/insights/${insight.id}`}
              className="group flex items-start gap-4 rounded-xl p-5 bg-card card-hover"
              style={{ boxShadow: '0 0 0 1px var(--border)' }}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f97316]/10">
                <FileText className="h-4 w-4 text-[#f97316]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-[10px] capitalize">
                    {insight.category}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground/50 flex items-center gap-1">
                    <Calendar className="h-2.5 w-2.5" />
                    {insight.date}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-foreground group-hover:text-[var(--accent)] transition-colors duration-200 line-clamp-1">
                  {insight.title}
                </h3>
                {insight.summary && (
                  <p className="text-xs text-muted-foreground/60 mt-1 line-clamp-2">
                    {insight.summary}
                  </p>
                )}
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-[var(--accent)] group-hover:translate-x-0.5 transition-all duration-200 shrink-0 mt-1" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
