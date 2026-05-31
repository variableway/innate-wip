import Link from "next/link"
import { getWritingMeta } from "@/lib/content"
import { issues, projectAnalyses, weeklySummaries, insights } from "@/lib/making/data"
import { getAllCollections } from "@/lib/collections/data"
import { getCheatsheetCount } from "@/lib/cheatsheets/data"
import { getAllAwesomeItems, getAwesomeCategories } from "@/lib/awesome/data"
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
  Layers,
  Zap,
  Compass,
  Code2,
  Terminal,
  BarChart3,
  GitBranch,
  Cpu,
} from "lucide-react"
import { cn } from "@/lib/utils"

/* ------------------------------------------------------------------ */
/*  Data fetching                                                       */
/* ------------------------------------------------------------------ */

export default async function HomePage() {
  const posts = await getWritingMeta()
  const collections = getAllCollections()
  const cheatsheetCount = await getCheatsheetCount()
  const awesomeItems = await getAllAwesomeItems()
  const awesomeCategories = await getAwesomeCategories()
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

  const totalContent =
    stats.posts +
    stats.collections +
    stats.guides +
    stats.cheatsheets +
    stats.insights +
    stats.weekly

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto px-5 py-10 md:px-8">
        {/* ============================================================ */}
        {/*  Hero + Bento Grid                                           */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[minmax(140px,auto)]">
          {/* ── Hero tile (spans 2 cols on md, 3 on lg) ── */}
          <Link
            href="/writing"
            className="group relative md:col-span-2 lg:col-span-3 rounded-3xl border border-border bg-gradient-to-br from-[#8FA68E]/10 via-background to-background p-6 md:p-8 overflow-hidden hover:shadow-lg hover:border-[#8FA68E]/30 transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#8FA68E]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8FA68E]">
                  <PenLine className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                    Innate
                  </h1>
                  <p className="text-xs text-muted-foreground/70">
                    Personal knowledge hub & project tracker
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                A unified workspace that aggregates GitHub issues, project
                documentation, weekly progress summaries, technical
                cheatsheets, curated collections, and blog writing — all in
                one place with AI-powered analysis.
              </p>
              <div className="mt-5 flex items-center gap-4 text-xs text-muted-foreground/60">
                <span className="flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-[#8FA68E]" />
                  {totalContent.toLocaleString()} pieces of content
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-[#8FA68E]" />
                  Statically generated
                </span>
              </div>
            </div>
          </Link>

          {/* ── Stats tile ── */}
          <div className="rounded-3xl border border-border bg-card p-6 flex flex-col justify-between hover:shadow-md hover:border-[#8FA68E]/20 transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground/60 uppercase tracking-wider">
                Content
              </span>
              <Compass className="h-4 w-4 text-muted-foreground/30" />
            </div>
            <div className="mt-2">
              <div className="text-3xl font-bold text-foreground">
                {totalContent.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground/60 mt-0.5">
                articles + guides + cheatsheets
              </div>
            </div>
          </div>

          {/* ── Writing tile ── */}
          <BentoCard
            href="/writing"
            icon={<PenLine className="h-5 w-5" />}
            title="Writing"
            description="Blog posts, thoughts, and technical articles."
            count={stats.posts}
            countLabel="posts"
            color="#8FA68E"
            size="normal"
          />

          {/* ── Better Stack Guides tile (tall) ── */}
          <BentoCard
            href="/betterstack-guides"
            icon={<Terminal className="h-5 w-5" />}
            title="Better Stack Guides"
            description="410+ technical guides scraped from the Better Stack community covering logging, monitoring, Docker, scaling, and more."
            count={stats.guides}
            countLabel="guides"
            color="#14b8a6"
            size="tall"
          />

          {/* ── Cheatsheets tile ── */}
          <BentoCard
            href="/cheatsheets"
            icon={<FileText className="h-5 w-5" />}
            title="Cheatsheets"
            description="300+ quick reference guides."
            count={stats.cheatsheets}
            countLabel="sheets"
            color="#06b6d4"
            size="normal"
          />

          {/* ── Making tile (wide, spans 2 cols) ── */}
          <Link
            href="/making"
            className="group md:col-span-2 rounded-3xl border border-border bg-card p-6 overflow-hidden hover:shadow-lg hover:border-[#8FA68E]/20 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#8b5cf6]/10">
                  <Code2 className="h-4 w-4 text-[#8b5cf6]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-[#8b5cf6] transition-colors">
                    Making
                  </h3>
                  <p className="text-[11px] text-muted-foreground/60">
                    Projects, weekly reports, insights & issues
                  </p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-[#8b5cf6] group-hover:translate-x-0.5 transition-all" />
            </div>
            <div className="grid grid-cols-4 gap-3">
              <MiniStat
                icon={<FolderGit2 className="h-3.5 w-3.5" />}
                value={stats.projects}
                label="Projects"
              />
              <MiniStat
                icon={<Calendar className="h-3.5 w-3.5" />}
                value={stats.weekly}
                label="Weekly"
              />
              <MiniStat
                icon={<Lightbulb className="h-3.5 w-3.5" />}
                value={stats.insights}
                label="Insights"
              />
              <MiniStat
                icon={<CheckSquare className="h-3.5 w-3.5" />}
                value={stats.issues}
                label="Issues"
              />
            </div>
          </Link>

          {/* ── Feed tile ── */}
          <BentoCard
            href="/feed"
            icon={<Newspaper className="h-5 w-5" />}
            title="Feed"
            description="Unified content discovery."
            count={stats.posts}
            countLabel="articles"
            color="#f59e0b"
            size="normal"
          />

          {/* ── Collections tile ── */}
          <BentoCard
            href="/collections"
            icon={<Globe className="h-5 w-5" />}
            title="Collections"
            description="Ideas and experiments from AI agents."
            count={stats.collections}
            countLabel="items"
            color="#6366f1"
            size="normal"
          />

          {/* ── Awesome tile (wide, shows categories) ── */}
          <Link
            href="/awesome"
            className="group md:col-span-2 lg:col-span-2 rounded-3xl border border-border bg-card p-6 overflow-hidden hover:shadow-lg hover:border-[#8FA68E]/20 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ec4899]/10">
                  <Tag className="h-4 w-4 text-[#ec4899]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-[#ec4899] transition-colors">
                    Awesome
                  </h3>
                  <p className="text-[11px] text-muted-foreground/60">
                    {stats.awesome} curated items across {awesomeCategories.length} categories
                  </p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-[#ec4899] group-hover:translate-x-0.5 transition-all" />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {awesomeCategories.slice(0, 8).map((cat) => (
                <span
                  key={cat.slug}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground/70"
                >
                  {cat.name}
                </span>
              ))}
              {awesomeCategories.length > 8 && (
                <span className="text-[10px] text-muted-foreground/40 px-1">
                  +{awesomeCategories.length - 8}
                </span>
              )}
            </div>
          </Link>

          {/* ── Code blocks tile (decorative stat) ── */}
          <div className="rounded-3xl border border-border bg-gradient-to-br from-[#8FA68E]/5 to-background p-6 flex flex-col justify-between hover:shadow-md hover:border-[#8FA68E]/20 transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground/60 uppercase tracking-wider">
                Code
              </span>
              <GitBranch className="h-4 w-4 text-muted-foreground/30" />
            </div>
            <div className="mt-2">
              <div className="text-3xl font-bold text-foreground">
                8,598
              </div>
              <div className="text-xs text-muted-foreground/60 mt-0.5">
                code blocks · 23 languages
              </div>
            </div>
          </div>

          {/* ── RSS tile ── */}
          <Link
            href="/rss.xml"
            target="_blank"
            className="group rounded-3xl border border-border bg-card p-6 flex flex-col justify-between hover:shadow-md hover:border-orange-500/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground/60 uppercase tracking-wider">
                RSS
              </span>
              <BarChart3 className="h-4 w-4 text-muted-foreground/30 group-hover:text-orange-500 transition-colors" />
            </div>
            <div className="mt-2">
              <div className="text-sm font-semibold text-foreground group-hover:text-orange-500 transition-colors">
                Subscribe
              </div>
              <div className="text-xs text-muted-foreground/60 mt-0.5">
                Writing & Issues feeds
              </div>
            </div>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-border/50 text-center">
          <p className="text-xs text-muted-foreground/40">
            Built with Next.js, React 19, TypeScript & Tailwind CSS — Statically generated for GitHub Pages
          </p>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  BentoCard                                                         */
/* ------------------------------------------------------------------ */

interface BentoCardProps {
  href: string
  icon: React.ReactNode
  title: string
  description: string
  count: number
  countLabel: string
  color: string
  size?: "normal" | "tall"
}

function BentoCard({
  href,
  icon,
  title,
  description,
  count,
  countLabel,
  color,
  size = "normal",
}: BentoCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative rounded-3xl border border-border bg-card p-6 overflow-hidden hover:shadow-lg transition-all duration-300",
        "hover:border-[#8FA68E]/20"
      )}
    >
      {/* subtle top-right glow */}
      <div
        className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"
        style={{ backgroundColor: color }}
      />

      <div className="relative flex flex-col h-full">
        <div className="flex items-start justify-between mb-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl shrink-0"
            style={{ backgroundColor: `${color}15` }}
          >
            <span style={{ color }}>{icon}</span>
          </div>
          <span className="text-[11px] font-medium text-muted-foreground/50 bg-muted/60 px-2 py-0.5 rounded-full">
            {count} {countLabel}
          </span>
        </div>

        <h3
          className="text-sm font-semibold text-foreground transition-colors mb-1"
          style={{ color: "inherit" }}
        >
          <span className="group-hover:text-[#8FA68E] transition-colors">
            {title}
          </span>
        </h3>

        <p className="text-xs text-muted-foreground/60 leading-relaxed">
          {description}
        </p>

        <div className="mt-auto pt-3 flex items-center gap-1 text-xs text-muted-foreground/40 group-hover:text-[#8FA68E] transition-colors">
          <span>Explore</span>
          <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  )
}

/* ------------------------------------------------------------------ */
/*  MiniStat                                                          */
/* ------------------------------------------------------------------ */

function MiniStat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode
  value: number
  label: string
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-muted/40 p-3">
      <span className="text-muted-foreground/50 mb-1">{icon}</span>
      <span className="text-sm font-bold text-foreground">{value}</span>
      <span className="text-[10px] text-muted-foreground/50">{label}</span>
    </div>
  )
}
