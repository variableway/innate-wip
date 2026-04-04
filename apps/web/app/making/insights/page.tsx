"use client"

import Link from "next/link"
import { Lightbulb, ChevronRight, Calendar } from "lucide-react"
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  Badge,
} from "@innate/ui"
import { insights } from "@/lib/making/data"

export default function InsightsPage() {
  const sortedInsights = [...insights].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-semibold">Insights</h1>
            <Badge variant="secondary" className="text-xs">
              {sortedInsights.length}
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {sortedInsights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </div>
    </div>
  )
}

function InsightCard({ insight }: { insight: typeof insights[0] }) {
  return (
    <Link href={`/making/insights/${insight.id}`}>
      <Card className="group hover:shadow-md transition-all cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-xs capitalize">
                  {insight.category}
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {insight.date}
                </span>
              </div>
              <CardTitle className="text-base group-hover:text-primary transition-colors">
                {insight.title}
              </CardTitle>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 ml-2" />
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {insight.summary}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
