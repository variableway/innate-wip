import Link from "next/link"
import { getWritingMeta } from "@/lib/content"
import { getAllCollections } from "@/lib/collections/data"
import { getEnabledHomeTiles } from "@/lib/plugins/registry"
import {
  PenLine,
  Globe,
  Newspaper,
  ArrowRight,
  Layers,
  Zap,
  Compass,
  BarChart3,
  Puzzle,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default async function HomePage() {
  const posts = await getWritingMeta()
  const collections = getAllCollections()
  const pluginTiles = getEnabledHomeTiles()

  const stats = {
    posts: posts.length,
    collections: collections.length,
  }

  const totalContent = stats.posts + stats.collections

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto px-5 py-12 md:px-8 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[minmax(140px,auto)]">
          <Link
            href="/writing"
            className="group relative md:col-span-2 lg:col-span-3 rounded-xl p-6 md:p-8 overflow-hidden card-hover bg-card"
            style={{ boxShadow: "0 0 0 1px var(--border)" }}
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
                    Learning notes, ideas & project thoughts
                  </p>
                </div>
              </div>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-xl">
                A personal space for AI learning tutorials, daily ideas, and
                product / project analysis — with room for Making plugins later.
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

          <div
            className="rounded-xl p-6 flex flex-col justify-between bg-card card-hover"
            style={{ boxShadow: "0 0 0 1px var(--border)" }}
          >
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
                writing + collections
              </div>
            </div>
          </div>

          <BentoCard
            href="/writing"
            icon={<PenLine className="h-5 w-5" />}
            title="Writing"
            description="Tutorials, learning notes, and technical articles."
            count={stats.posts}
            countLabel="posts"
          />

          <BentoCard
            href="/collections"
            icon={<Globe className="h-5 w-5" />}
            title="Collections"
            description="Daily ideas and AI product / project analysis."
            count={stats.collections}
            countLabel="items"
          />

          <BentoCard
            href="/feed"
            icon={<Newspaper className="h-5 w-5" />}
            title="Feed"
            description="Unified content discovery."
            count={stats.posts}
            countLabel="articles"
          />

          {pluginTiles.map((tile) => (
            <Link
              key={tile.href}
              href={tile.href}
              className="group relative rounded-xl p-6 overflow-hidden bg-card card-hover"
              style={{ boxShadow: "0 0 0 1px var(--border)" }}
            >
              <div className="relative flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary shrink-0">
                    <Puzzle className="h-5 w-5 text-foreground" />
                  </div>
                  <span className="text-[11px] font-medium text-muted-foreground/60 bg-secondary px-2 py-0.5 rounded-full">
                    plugin
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:text-[var(--accent)] transition-colors duration-200">
                  {tile.title}
                </h3>
                <p className="text-xs text-muted-foreground/70 leading-relaxed">
                  {tile.description}
                </p>
              </div>
            </Link>
          ))}

          <Link
            href="/rss.xml"
            target="_blank"
            className="group rounded-xl p-6 flex flex-col justify-between bg-card card-hover"
            style={{ boxShadow: "0 0 0 1px var(--border)" }}
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
                Writing feed
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

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
      style={{ boxShadow: "0 0 0 1px var(--border)" }}
    >
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
