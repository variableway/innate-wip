# Source: https://betterstack.com/community/guides/scaling-nodejs/error-handling-nextjs/
# Original language: javascript
# Normalized: js
# Block index: 8

[label app/blog/[slug]/page.js]
import { notFound } from 'next/navigation';

export default async function BlogPost({ params }) {
  const post = await getBlogPost(params.slug);
  
  if (!post) {
    notFound(); // Activates the not-found.js component
  }
  
  return <BlogPostLayout post={post} />;
}