"use client"

import Link from "next/link"
import { Calendar, ChevronRight, Sparkles, TrendingUp, User } from "lucide-react"
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  Badge,
  cn
} from "@innate/ui"
import { weeklySummaries, getIssuesForWeekly } from "@/lib/making/data"

export default function WeeklyPage() {
  const sortedWeeklies = [...weeklySummaries].sort((a, b) => 
    new Date(b.dateRange.end).getTime() - new Date(a.dateRange.end).getTime()
  )

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-semibold">周记录</h1>
            <Badge variant="secondary" className="text-xs">
              {sortedWeeklies.length}
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {sortedWeeklies.map((weekly) => (
            <WeeklyCard key={weekly.id} weekly={weekly} />
          ))}
        </div>
      </div>
    </div>
  )
}

function WeeklyCard({ weekly }: { weekly: typeof weeklySummaries[0] }) {
  const completedIssues = getIssuesForWeekly(weekly)
  
  return (
    <Link href={`/making/weekly/${weekly.id}`}>
      <Card className="group hover:shadow-md transition-all cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-xs">
                  Week {weekly.weekNumber}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {weekly.dateRange.start} ~ {weekly.dateRange.end}
                </span>
              </div>
              <CardTitle className="text-base group-hover:text-primary transition-colors">
                {weekly.title}
              </CardTitle>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 space-y-3">
          {/* Summary */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {weekly.summary}
          </p>

          {/* Completed Issues Count */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Completed {completedIssues.length} issues</span>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-4 pt-2 border-t border-border">
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-green-500" />
              <span className="text-xs">{weekly.evaluations.strengths.length} strengths</span>
            </div>
            <div className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-blue-500" />
              <span className="text-xs">{weekly.mindsetAnalysis.strengths.length} mindset +</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
