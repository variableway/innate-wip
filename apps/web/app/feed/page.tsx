import { Metadata } from 'next'
import { FeedList } from "@/components/feed/feed-list"
import { getWritingMeta } from "@/lib/content"
import { Home } from "lucide-react"

export const metadata: Metadata = {
  title: 'Feed | Innate',
  description: 'Discover stories, thinking, and expertise from writers on any topic.',
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

  return (
    <div className="max-w-3xl mx-auto py-6 px-6">
      {/* 页面头部 */}
      <div className="flex items-center gap-3 mb-8">
        <Home className="h-6 w-6 text-[#8FA68E]" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Feed</h1>
          <p className="text-sm text-muted-foreground">Discover stories, thinking, and expertise from writers on any topic.</p>
        </div>
      </div>

      {/* Feed 列表 */}
      <FeedList posts={posts} />
    </div>
  )
}
