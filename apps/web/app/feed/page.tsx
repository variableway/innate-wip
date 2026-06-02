import { Metadata } from 'next'
import { FeedList } from "@/components/feed/feed-list"
import { getWritingMeta } from "@/lib/content"
import { Newspaper, PenLine, Star, Hash, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: 'Feed | Innate',
  description: 'Discover stories, thinking, and expertise from writers on any topic.',
}

function StatPill({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground/70">
      <span className="text-[var(--accent)]">{icon}</span>
      <span className="font-semibold text-foreground">{value}</span>
      <span>{label}</span>
    </div>
  )
}

export default async function FeedPage() {
  const postsMeta = await getWritingMeta({ status: 'published' })

  const posts = postsMeta.map((meta) => ({
    slug: meta.slug,
    title: meta.title,
    summary: meta.excerpt || '',
    date: new Date(meta.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    author: {
      name: meta.author,
      avatar: '',
      role: '',
    },
    category: meta.category,
    tags: meta.tags,
    readTime: meta.readingTime,
    isEditorsPick: meta.editorsPick || false,
  }))

  const categories = Array.from(new Set(posts.map((p) => p.category).filter(Boolean)))
  const editorsPicks = posts.filter((p) => p.isEditorsPick).length
  const totalReadTime = posts.reduce((sum, p) => sum + (p.readTime || 1), 0)

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto py-8 px-6">
        {/* Hero Header */}
        <div className="mb-8 pb-6 border-b border-border/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-subtle)]">
              <Newspaper className="h-5 w-5 text-[var(--accent)]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">Feed</h1>
              <p className="text-sm text-muted-foreground/70">
                Discover stories, thinking, and expertise.
              </p>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-x-4 gap-y-1 flex-wrap mt-3">
            <StatPill icon={<PenLine className="h-3.5 w-3.5" />} value={posts.length} label="posts" />
            <span className="text-muted-foreground/20">|</span>
            <StatPill icon={<Hash className="h-3.5 w-3.5" />} value={categories.length} label="categories" />
            <span className="text-muted-foreground/20">|</span>
            <StatPill icon={<Star className="h-3.5 w-3.5" />} value={editorsPicks} label="picks" />
            <span className="text-muted-foreground/20">|</span>
            <StatPill icon={<Clock className="h-3.5 w-3.5" />} value={totalReadTime} label="min read" />
          </div>
        </div>

        {/* Feed List */}
        <FeedList posts={posts} />
      </div>
    </div>
  )
}
