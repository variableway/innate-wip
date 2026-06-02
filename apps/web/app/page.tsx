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
      <div className="max-w-6xl mx-auto px-5 py-12 md:px-8 md:py-16">
        {/* ============================================================ */}
        {/*  Hero + Bento Grid                                           */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[minmax(140px,auto)]">
          {/* ── Hero tile (spans 2 cols on md, 3 on lg) ── */}
          <Link
            href="/writing"
            className="group relative md:col-span-2 lg:col-span-3 rounded-xl p-6 md:p-8 overflow-hidden card-hover bg-card"
            style={{ boxShadow: '0 0 0 1px var(--border)' }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)]/[0.04] rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]">
                  <PenLine className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-4xl font-semibold text-foreground tracking-tight leading-tight">
                    Innate
                  </h1>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Personal knowledge hub & project tracker
                  </p>
                </div>
              </div>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-xl">
                A unified workspace that aggregates GitHub issues, project
                documentation, weekly progress summaries, technical
                cheatsheets, curated collections, and blog writing — all in
                one place with AI-powered analysis.
              </p>
              <div className="mt-6 flex items-center gap-5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-[var(--accent)]" />
                  {totalContent.toLocaleString()} pieces of content
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-[var(--accent)]" />
                  Statically generated
                </span>
              </div>
            </div>
          </Link>

          {/* ── Stats tile ── */}
          <div className="rounded-xl p-6 flex flex-col justify-between bg-card card-hover" style={{ boxShadow: '0 0 0 1px var(--border)' }}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground/70 uppercase tracking-wider">
                Content
              </span>
              <Compass className="h-4 w-4 text-muted-foreground/30" />
            </div>
            <div className="mt-2">
              <div className="text-3xl font-semibold text-foreground tracking-tight">
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
          />

          {/* ── Better Stack Guides tile (tall) ── */}
          <BentoCard
            href="/betterstack-guides"
            icon={<Terminal className="h-5 w-5" />}
            title="Better Stack Guides"
            description="410+ technical guides scraped from the Better Stack community covering logging, monitoring, Docker, scaling, and more."
            count={stats.guides}
            countLabel="guides"
            tall
          />

          {/* ── Cheatsheets tile ── */}
          <BentoCard
            href="/cheatsheets"
            icon={<FileText className="h-5 w-5" />}
            title="Cheatsheets"
            description="300+ quick reference guides."
            count={stats.cheatsheets}
            countLabel="sheets"
          />

          {/* ── Making tile (wide, spans 2 cols) ── */}
          <Link
            href="/making"
            className="group md:col-span-2 rounded-xl p-6 overflow-hidden bg-card card-hover"
            style={{ boxShadow: '0 0 0 1px var(--border)' }}
          >
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary">
                  <Code2 className="h-4 w-4 text-foreground" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-[var(--accent)] transition-colors duration-200">
                    Making
                  </h3>
                  <p className="text-[11px] text-muted-foreground/60">
                    Projects, weekly reports, insights & issues
                  </p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-[var(--accent)] group-hover:translate-x-0.5 transition-all duration-200" />
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
          />

          {/* ── Collections tile ── */}
          <BentoCard
            href="/collections"
            icon={<Globe className="h-5 w-5" />}
            title="Collections"
            description="Ideas and experiments from AI agents."
            count={stats.collections}
            countLabel="items"
          />

          {/* ── Awesome tile (wide, shows categories) ── */}
          <Link
            href="/awesome"
            className="group md:col-span-2 lg:col-span-2 rounded-xl p-6 overflow-hidden bg-card card-hover"
            style={{ boxShadow: '0 0 0 1px var(--border)' }}
          >
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary">
                  <Tag className="h-4 w-4 text-foreground" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-[var(--accent)] transition-colors duration-200">
                    Awesome
                  </h3>
                  <p className="text-[11px] text-muted-foreground/60">
                    {stats.awesome} curated items across {awesomeCategories.length} categories
                  </p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-[var(--accent)] group-hover:translate-x-0.5 transition-all duration-200" />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {awesomeCategories.slice(0, 8).map((cat) => (
                <span
                  key={cat.slug}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary text-muted-foreground/70"
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
          <div className="rounded-xl p-6 flex flex-col justify-between bg-card card-hover" style={{ boxShadow: '0 0 0 1px var(--border)' }}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground/70 uppercase tracking-wider">
                Code
              </span>
              <GitBranch className="h-4 w-4 text-muted-foreground/30" />
            </div>
            <div className="mt-2">
              <div className="text-3xl font-semibold text-foreground tracking-tight">
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
            className="group rounded-xl p-6 flex flex-col justify-between bg-card card-hover"
            style={{ boxShadow: '0 0 0 1px var(--border)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground/70 uppercase tracking-wider">
                RSS
              </span>
              <BarChart3 className="h-4 w-4 text-muted-foreground/30 group-hover:text-[var(--accent)] transition-colors duration-200" />
            </div>
            <div className="mt-2">
              <div className="text-sm font-semibold text-foreground group-hover:text-[var(--accent)] transition-colors duration-200">
                Subscribe
              </div>
              <div className="text-xs text-muted-foreground/60 mt-0.5">
                Writing & Issues feeds
              </div>
            </div>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-6 border-t border-[var(--border-strong)] text-center">
          <p className="text-xs text-muted-foreground/40">
            Built with Next.js, React 19, TypeScript & Tailwind CSS — Statically generated for GitHub Pages
          </p>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  BentoCard — standardized card component                           */
/* ------------------------------------------------------------------ */

interface BentoCardProps {
  href: string
  icon: React.ReactNode
  title: string
  description: string
  count: number
  countLabel: string
  tall?: boolean
}

function BentoCard({
  href,
  icon,
  title,
  description,
  count,
  countLabel,
  tall,
}: BentoCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative rounded-xl p-6 overflow-hidden bg-card card-hover",
        tall && "md:row-span-2"
      )}
      style={{ boxShadow: '0 0 0 1px var(--border)' }}
    >
      {/* subtle top-right glow */}
      <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-[0.04] bg-[var(--accent)] group-hover:opacity-[0.08] transition-opacity duration-300" />

      <div className="relative flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary shrink-0">
            <span className="text-foreground">{icon}</span>
          </div>
          <span className="text-[11px] font-medium text-muted-foreground/60 bg-secondary px-2 py-0.5 rounded-full">
            {count} {countLabel}
          </span>
        </div>

        <h3 className="text-sm font-semibold text-foreground mb-1">
          <span className="group-hover:text-[var(--accent)] transition-colors duration-200">
            {title}
          </span>
        </h3>

        <p className="text-xs text-muted-foreground/70 leading-relaxed">
          {description}
        </p>

        <div className="mt-auto pt-4 flex items-center gap-1 text-xs text-muted-foreground/50 group-hover:text-[var(--accent)] transition-colors duration-200">
          <span>Explore</span>
          <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform duration-200" />
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
    <div className="flex flex-col items-center justify-center rounded-xl bg-secondary/60 p-3">
      <span className="text-muted-foreground/40 mb-1">{icon}</span>
      <span className="text-sm font-semibold text-foreground tracking-tight">{value}</span>
      <span className="text-[10px] text-muted-foreground/50">{label}</span>
    </div>
  )
}
