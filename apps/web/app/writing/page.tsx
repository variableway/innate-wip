import { Metadata } from "next"
import { getWritingMeta, getWriting, extractToc } from "@/lib/content"
import { BlogPageClient } from "@/components/blog-page-client"

export const metadata: Metadata = {
  title: "Writing | Innate",
  description: "Thoughts, ideas, and experiences shared with the world.",
}

export default async function WritingPage() {
  const postsMeta = await getWritingMeta({ status: "published" })

  const postsWithContent = await Promise.all(
    postsMeta.map(async (meta) => {
      const post = await getWriting(meta.slug)
      const toc = post ? extractToc(post.content) : []
      return {
        slug: meta.slug,
        title: meta.title,
        excerpt: meta.excerpt || "",
        date: new Date(meta.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        category: meta.category,
        tags: meta.tags,
        readingTime: meta.readingTime || 1,
        author: meta.author,
        content: post?.content || "",
        toc,
        type: meta.type,
      }
    })
  )

  return <BlogPageClient posts={postsWithContent} />
}
