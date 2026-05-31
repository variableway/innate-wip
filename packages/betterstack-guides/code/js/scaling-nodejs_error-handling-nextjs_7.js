# Source: https://betterstack.com/community/guides/scaling-nodejs/error-handling-nextjs/
# Original language: javascript
# Normalized: js
# Block index: 7

[label app/blog/[slug]/not-found.js]
import Link from 'next/link';
import { SearchBox } from '@/components/SearchBox';
import { RecentPosts } from '@/components/RecentPosts';

export default function BlogPostNotFound() {
  return (
    <div className="content-not-found">
      <h2>Blog Post Not Found</h2>
      <p>The post you're looking for doesn't exist or was moved.</p>
      
      <div className="recovery-options">
        <SearchBox placeholder="Search blog posts..." />
        <RecentPosts count={3} />
        
        <div className="navigation-links">
          <Link href="/blog">All Blog Posts</Link>
          <Link href="/blog/categories">Browse Categories</Link>
        </div>
      </div>
    </div>
  );
}