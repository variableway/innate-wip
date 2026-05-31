"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useState } from "react"
import { 
  ArrowLeft, 
  Calendar, 
  CheckSquare, 
  Sparkles, 
  TrendingUp, 
  AlertCircle,
  Lightbulb,
  User,
  Brain,
  Target,
  ChevronRight,
  Zap,
  MessageSquare,
  Globe
} from "lucide-react"
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  Badge,
  Separator,
  Button,
  cn
} from "@innate/ui"
import { getWeeklyById, getIssuesForWeekly, weeklySummaries, projects } from "@/lib/making/data"
import { isBilingualText, type Issue } from "@/lib/making/types"

export function WeeklyDetail() {
  const params = useParams()
  const weekly = getWeeklyById(params.id as string)
  const [language, setLanguage] = useState<'zh' | 'en'>('zh')

  if (!weekly) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-medium text-foreground">Weekly not found</h2>
          <Link href="/making/weekly" className="text-sm text-primary hover:underline mt-2 inline-block">
            Back to weekly list
          </Link>
        </div>
      </div>
    )
  }

  const completedIssues = getIssuesForWeekly(weekly)

  // Helper to get text based on language
  const getText = (text: string | { zh: string; en: string }): string => {
    if (isBilingualText(text)) {
      return text[language]
    }
    return text
  }

  return (
    <div className="h-full flex">
      {/* Left: Week Navigation */}
      <div className="w-48 border-r border-border/60 bg-muted/30 flex flex-col shrink-0">
        <div className="p-3 border-b border-border/60">
          <Link 
            href="/making/weekly"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-2"
          >
            <ArrowLeft className="h-3 w-3" />
            Back
          </Link>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            <h1 className="font-semibold text-sm">Week {weekly.weekNumber}</h1>
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {weekly.dateRange.start} ~ {weekly.dateRange.end}
          </p>
        </div>

        {/* Week Navigation */}
        <div className="flex-1 p-1.5 space-y-0.5 overflow-y-auto">
          {weeklySummaries.map((w) => (
            <Link
              key={w.id}
              href={`/making/weekly/${w.id}`}
              className={cn(
                "block px-2.5 py-1.5 rounded-md text-xs transition-colors",
                w.id === weekly.id
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <div className="flex items-center justify-between">
                <span>Week {w.weekNumber}</span>
                {w.id === weekly.id && (
                  <div className="w-1 h-1 rounded-full bg-primary" />
                )}
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                {w.titleZh || w.title}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Right: Content */}
      <div className="flex-1 overflow-y-auto bg-background">
        <div className="max-w-4xl mx-auto p-6">
          {/* Title Section with Language Toggle */}
          <div className="mb-8 pb-6 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  Week {weekly.weekNumber}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {weekly.dateRange.start} ~ {weekly.dateRange.end}
                </span>
              </div>
              {/* Language Toggle */}
              <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
                <button
                  onClick={() => setLanguage('zh')}
                  className={cn(
                    "px-2 py-1 text-xs rounded-md transition-colors",
                    language === 'zh'
                      ? "bg-background text-foreground font-medium shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  中文
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={cn(
                    "px-2 py-1 text-xs rounded-md transition-colors",
                    language === 'en'
                      ? "bg-background text-foreground font-medium shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  EN
                </button>
              </div>
            </div>
            <h2 className="text-2xl font-bold">
              {language === 'zh' ? weekly.titleZh || weekly.title : weekly.title}
            </h2>
          </div>

          {/* Summary Section */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Target className="h-3.5 w-3.5 text-primary" />
              </div>
              <h3 className="text-sm font-bold">
                {language === 'zh' ? '总结' : 'Summary'}
              </h3>
            </div>
            <Card className="border-l-4 border-l-primary shadow-sm">
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {language === 'zh' ? weekly.summaryZh || weekly.summary : weekly.summary}
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Completed Issues */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckSquare className="h-3.5 w-3.5 text-green-500" />
              </div>
              <h3 className="text-sm font-bold">
                {language === 'zh' ? '完成的 Issues' : 'Completed Issues'}
              </h3>
              <Badge variant="secondary" className="text-xs ml-auto">
                {completedIssues.length}
              </Badge>
            </div>
            <div className="space-y-2">
              {completedIssues.map(issue => (
                <IssueCard key={issue.id} issue={issue} language={language} />
              ))}
              {completedIssues.length === 0 && (
                <div className="text-center py-8 bg-muted/30 rounded-lg border border-dashed border-border">
                  <CheckSquare className="h-8 w-8 text-muted-foreground/50 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {language === 'zh' ? '本周没有完成的 issues' : 'No completed issues this week'}
                  </p>
                </div>
              )}
            </div>
          </section>

          <Separator className="my-8" />

          {/* AI Evaluation Section */}
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Sparkles className="h-3.5 w-3.5 text-purple-500" />
              </div>
              <h3 className="text-sm font-bold">
                {language === 'zh' ? 'AI 评估' : 'AI Evaluation'}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Strengths */}
              <Card className="border-t-4 border-t-green-500 shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <CardTitle className="text-sm font-bold">
                      {language === 'zh' ? '优势' : 'Strengths'}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2">
                    {weekly.evaluations.strengths.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-green-500 shrink-0 text-xs mt-1">●</span>
                        <span className="leading-relaxed">{getText(item)}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Weaknesses */}
              <Card className="border-t-4 border-t-orange-500 shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                    <CardTitle className="text-sm font-bold">
                      {language === 'zh' ? '改进点' : 'Areas for Improvement'}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2">
                    {weekly.evaluations.weaknesses.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-orange-500 shrink-0 text-xs mt-1">●</span>
                        <span className="leading-relaxed">{getText(item)}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Suggestions */}
              <Card className="border-t-4 border-t-blue-500 shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-blue-500" />
                    <CardTitle className="text-sm font-bold">
                      {language === 'zh' ? '建议' : 'Suggestions'}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2">
                    {weekly.evaluations.improvements.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-blue-500 shrink-0 text-xs mt-1">→</span>
                        <span className="leading-relaxed">{getText(item)}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Mindset Analysis Section */}
          <section>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg bg-pink-500/10 flex items-center justify-center">
                <Brain className="h-3.5 w-3.5 text-pink-500" />
              </div>
              <h3 className="text-sm font-bold">
                {language === 'zh' ? '思维分析' : 'Mindset Analysis'}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Mindset Strengths */}
              <Card className="border-t-4 border-t-green-500 shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-green-500" />
                    <CardTitle className="text-sm font-bold">
                      {language === 'zh' ? '思维优势' : 'Thinking Strengths'}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2">
                    {weekly.mindsetAnalysis.strengths.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-green-500 shrink-0 text-xs mt-1">●</span>
                        <span className="leading-relaxed">{getText(item)}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Mindset Weaknesses */}
              <Card className="border-t-4 border-t-orange-500 shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-orange-500" />
                    <CardTitle className="text-sm font-bold">
                      {language === 'zh' ? '需要注意的模式' : 'Patterns to Watch'}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2">
                    {weekly.mindsetAnalysis.weaknesses.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-orange-500 shrink-0 text-xs mt-1">●</span>
                        <span className="leading-relaxed">{getText(item)}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Mindset Suggestions */}
              <Card className="border-t-4 border-t-purple-500 shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-purple-500" />
                    <CardTitle className="text-sm font-bold">
                      {language === 'zh' ? '成长建议' : 'Growth Suggestions'}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-2">
                    {weekly.mindsetAnalysis.suggestions.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-purple-500 shrink-0 text-xs mt-1">→</span>
                        <span className="leading-relaxed">{getText(item)}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

// Strip markdown syntax to get plain text preview
function stripMarkdown(md: string): string {
  return md
    // Remove headers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold/italic
    .replace(/\*\*\*?([^*]+)\*\*\*?/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // Remove inline code
    .replace(/`([^`]+)`/g, '$1')
    // Remove links, keep text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\[[^\]]*\]/g, '$1')
    // Remove list markers
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    // Remove blockquotes
    .replace(/^>\s*/gm, '')
    // Remove horizontal rules
    .replace(/^-{3,}$/gm, '')
    // Remove HTML tags
    .replace(/<[^>]+>/g, '')
    // Collapse multiple spaces
    .replace(/\s+/g, ' ')
    .trim()
}

// Extract meaningful content for preview (skip short headers)
function getFirstTwoParagraphs(content: string): string {
  if (!content) return ''
  
  // Split by double newlines to get paragraphs/sections
  const sections = content.split(/\n\n+/)
  const meaningfulSections: string[] = []
  
  for (const section of sections) {
    const trimmed = section.trim()
    if (!trimmed) continue
    
    // Skip pure whitespace
    if (!trimmed.replace(/\s/g, '')) continue
    
    // Strip markdown
    const plainText = stripMarkdown(trimmed)
    if (!plainText) continue
    
    // Skip very short sections (likely headers like "## Bug 描述" or "### 描述")
    if (plainText.length < 20) continue
    
    meaningfulSections.push(plainText)
    if (meaningfulSections.length >= 2) break
  }
  
  // If no meaningful sections found, fall back to first non-empty section
  if (meaningfulSections.length === 0) {
    for (const section of sections) {
      const plainText = stripMarkdown(section)
      if (plainText) {
        return plainText.slice(0, 200)
      }
    }
  }
  
  // Join with space and limit length
  const result = meaningfulSections.join(' ')
  return result.length > 300 ? result.slice(0, 300) + '...' : result
}

// Extracted IssueCard component
function IssueCard({ issue, language }: { issue: Issue; language: 'zh' | 'en' }) {
  const project = projects.find(p => p.id === issue.project)
  
  // Get first two paragraphs of description
  const previewContent = getFirstTwoParagraphs(issue.description || '')
  
  return (
    <Link href={`/making/issues/${issue.project}/${issue.number}`}>
      <Card className="hover:bg-muted/50 transition-colors cursor-pointer group border-l-2 border-l-transparent hover:border-l-green-500">
        <CardContent className="py-3 px-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center shrink-0 mt-0.5">
              <CheckSquare className="h-3 w-3 text-green-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-mono">
                  #{issue.number}
                </span>
                <span 
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: project?.color || '#888' }}
                />
                <span className="text-xs text-muted-foreground">
                  {project?.name || issue.project}
                </span>
              </div>
              <p className="text-sm font-bold mt-1 group-hover:text-primary transition-colors">
                {issue.title}
              </p>
              <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                {previewContent}
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
