import Link from "next/link"
import {
  getWritingMeta,
} from "@/lib/content"
import {
  issues,
  projectAnalyses,
  weeklySummaries,
  insights,
} from "@/lib/making/data"
import { getAllCollections } from "@/lib/collections/data"
import { getCheatsheetCount } from "@/lib/cheatsheets/data"
import { getAllAwesomeItems } from "@/lib/awesome/data"
import { getGuideCount } from "@/lib/betterstack/data"
import {
  PenLine,
  Globe,
  Newspaper,
  FolderGit2,
  Calendar,
  Lightbulb,
  CheckSquare,
  FileText,
  BookOpen,
  Tag,
  ArrowRight,
  Sparkles,
  Hash,
  Layers,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface FeatureCardProps {
  href: string
  icon: React.ReactNode
  title: string
  description: string
  count?: number
  countLabel?: string
  color?: string
}

function FeatureCard({ href, icon, title, description, count, countLabel, color = "#8FA68E" }: FeatureCardProps) {
  return (
    <Link
      href={href}
      className="group block rounded-xl border border-border bg-card p-5 hover:shadow-md hover:border-[#8FA68E]/30 transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg shrink-0"
          style={{ backgroundColor: `${color}15` }}
        >
          <span style={{ color }}>{icon}</span>
        </div>
        {count !== undefined && (
          <span className="text-[11px] font-medium text-muted-foreground/60 bg-muted px-2 py-0.5 rounded-full">
            {count} {countLabel}
          </span>
        )}
      </div>
      <h3 className="text-sm font-semibold text-foreground group-hover:text-[#8FA68E] transition-colors mb-1">
        {title}
      </h3>
      <p className="text-xs text-muted-foreground/70 leading-relaxed">
        {description}
      </p>
      <div className="mt-3 flex items-center gap-1 text-xs text-[#8FA68E] opacity-0 group-hover:opacity-100 transition-opacity">
        <span>Explore</span>
        <ArrowRight className="h-3 w-3" />
      </div>
    </Link>
  )
}

interface StatCardProps {
  value: number
  label: string
  icon: React.ReactNode
}

function StatCard({ value, label, icon }: StatCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#8FA68E]/10 shrink-0">
        <span className="text-[#8FA68E]">{icon}</span>
      </div>
      <div>
        <div className="text-lg font-bold text-foreground leading-none">{value.toLocaleString()}</div>
        <div className="text-[11px] text-muted-foreground/70 mt-0.5">{label}</div>
      </div>
    </div>
  )
}

export default async function HomePage() {
  const posts = await getWritingMeta()
  const collections = getAllCollections()
  const cheatsheetCount = await getCheatsheetCount()
  const awesomeItems = await getAllAwesomeItems()
  const guideCount = await getGuideCount()

  const stats = {
    posts: posts.length,
    collections: collections.length,
    projects: projectAnalyses.length,
    weekly: weeklySummaries.length,
    insights: insights.length,
    issues: issues.length,
    cheatsheets: cheatsheetCount,
    guides: guideCount,
    awesome: awesomeItems.length,
  }

  const totalContent = stats.posts + stats.collections + stats.guides + stats.cheatsheets + stats.insights + stats.weekly

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto px-5 py-8 md:px-8">
        {/* Hero */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#8FA68E]">
              <PenLine className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">Innate</h1>
              <p className="text-xs text-muted-foreground/70">Personal knowledge hub & project tracker</p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            Innate is a unified personal website that aggregates GitHub issues, project documentation,
            weekly progress summaries, technical cheatsheets, curated collections, and blog writing —
            all in one place with AI-powered analysis.
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6">
            <StatCard value={totalContent} label="Total Content" icon={<Layers className="h-4 w-4" />} />
            <StatCard value={stats.posts} label="Articles" icon={<PenLine className="h-4 w-4" />} />
            <StatCard value={stats.guides} label="Guides" icon={<BookOpen className="h-4 w-4" />} />
            <StatCard value={stats.cheatsheets} label="Cheatsheets" icon={<FileText className="h-4 w-4" />} />
            <StatCard value={stats.issues} label="Issues" icon={<CheckSquare className="h-4 w-4" />} />
          </div>
        </section>

        {/* Content Section */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4 text-[#8FA68E]" />
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Content</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <FeatureCard
              href="/writing"
              icon={<PenLine className="h-5 w-5" />}
              title="Writing"
              description="Blog posts, thoughts, and technical articles with RSS feed support."
              count={stats.posts}
              countLabel="posts"
              color="#8FA68E"
            />
            <FeatureCard
              href="/collections"
              icon={<Globe className="h-5 w-5" />}
              title="Collections"
              description="Curated ideas and experiments from AI agents and daily discoveries."
              count={stats.collections}
              countLabel="items"
              color="#6366f1"
            />
          </div>
        </section>

        {/* Feed Section */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Newspaper className="h-4 w-4 text-[#8FA68E]" />
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Feed</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <FeatureCard
              href="/feed"
              icon={<Newspaper className="h-5 w-5" />}
              title="Content Discovery"
              description="Browse all articles and posts in a unified discovery feed."
              count={stats.posts}
              countLabel="articles"
              color="#f59e0b"
            />
          </div>
        </section>

        {/* Making Section */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Hash className="h-4 w-4 text-[#8FA68E]" />
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Making</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <FeatureCard
              href="/making/projects"
              icon={<FolderGit2 className="h-5 w-5" />}
              title="Projects"
              description="Project showcase with AI-generated analysis from AGENTS.md files."
              count={stats.projects}
              countLabel="projects"
              color="#3b82f6"
            />
            <FeatureCard
              href="/making/weekly"
              icon={<Calendar className="h-5 w-5" />}
              title="Weekly"
              description="AI-generated weekly progress summaries and mindset analysis."
              count={stats.weekly}
              countLabel="weeks"
              color="#8b5cf6"
            />
            <FeatureCard
              href="/making/insights"
              icon={<Lightbulb className="h-5 w-5" />}
              title="Insights"
              description="Key learnings and observations from ongoing work."
              count={stats.insights}
              countLabel="insights"
              color="#f97316"
            />
            <FeatureCard
              href="/making/issues"
              icon={<CheckSquare className="h-5 w-5" />}
              title="Issues"
              description="GitHub issues tracker synced from multiple repositories."
              count={stats.issues}
              countLabel="issues"
              color="#22c55e"
            />
          </div>
        </section>

        {/* Cheatsheets Section */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-4 w-4 text-[#8FA68E]" />
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Cheatsheets</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FeatureCard
              href="/cheatsheets"
              icon={<FileText className="h-5 w-5" />}
              title="Cheatsheets"
              description="300+ quick reference guides for developer tools and frameworks."
              count={stats.cheatsheets}
              countLabel="sheets"
              color="#06b6d4"
            />
            <FeatureCard
              href="/betterstack-guides"
              icon={<BookOpen className="h-5 w-5" />}
              title="Better Stack Guides"
              description="410+ technical guides covering logging, monitoring, scaling, and more."
              count={stats.guides}
              countLabel="guides"
              color="#14b8a6"
            />
          </div>
        </section>

        {/* Awesome Section */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="h-4 w-4 text-[#8FA68E]" />
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Awesome</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <FeatureCard
              href="/awesome"
              icon={<Tag className="h-5 w-5" />}
              title="All Awesome Items"
              description="Curated list of awesome tools, libraries, and resources by category."
              count={stats.awesome}
              countLabel="items"
              color="#ec4899"
            />
          </div>
        </section>

        {/* Footer Note */}
        <div className="mt-10 pt-6 border-t border-border/50 text-center">
          <p className="text-xs text-muted-foreground/50">
            Built with Next.js, React, TypeScript & Tailwind CSS — Statically generated for GitHub Pages
          </p>
        </div>
      </div>
    </div>
  )
}
