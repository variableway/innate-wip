# Markdown CMS 实施方案 - 支持 Server 和 Static 双模式

**目标**: 实现外部 Markdown 文件管理，同时支持 Server 渲染和 Static 生成

---

## 架构设计

### 核心思想

```
┌─────────────────────────────────────────────────────────────┐
│                    Content Layer                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   content/               ← Markdown 源文件                  │
│   ├── posts/                                              │
│   │   ├── 2026-03-27-claude-artifacts.md                   │
│   │   └── ...                                             │
│   └── authors/                                            │
│       └── authors.json                                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    Build Process                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Option A: Static Generation (SSG)                         │
│   ├── 构建时读取所有 Markdown                               │
│   ├── 解析 frontmatter                                      │
│   ├── 生成静态页面 (generateStaticParams)                   │
│   └── 输出到 .next/static                                   │
│                                                             │
│   Option B: Server Rendering (SSR)                          │
│   ├── 运行时读取 Markdown 文件                              │
│   ├── 支持 ISR (Incremental Static Regeneration)            │
│   └── 支持按需生成                                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    Runtime Layer                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   lib/content/                                              │
│   ├── index.ts           ← 统一 API 接口                   │
│   ├── loader.ts          ← 文件加载器 (fs/cache)           │
│   ├── parser.ts          ← Markdown 解析器                 │
│   └── cache.ts           ← 缓存层                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 文件结构设计

### 1. 内容目录

```
content/
├── posts/                          # 文章目录
│   ├── 2026-03-27-claude-artifacts-prototyping.md
│   ├── 2026-03-26-react-19-use-hook.md
│   ├── 2026-03-25-ai-coding-week-3.md
│   └── ...
│
├── authors/                        # 作者信息
│   └── authors.json
│
├── series/                         # 系列/专栏 (可选)
│   └── ai-coding-basics.json
│
└── config.json                     # 内容配置
```

### 2. Markdown 文件格式

```markdown
---
title: "Today I learned: 使用 Claude 的 Artifacts 功能快速原型设计"
slug: "claude-artifacts-prototyping"
date: "2026-03-27"
updated: "2026-03-27"
author: "Alex Chen"
category: "log"
tags: ["ai", "tutorial", "claude"]
excerpt: "今天尝试了 Claude 的 Artifacts 功能，发现它在快速原型设计上非常强大..."
cover: "/images/posts/claude-artifacts.png"
featured: false
editorsPick: true
readingTime: 3
status: "published"  # published | draft | archived
---

# Today I learned: 使用 Claude 的 Artifacts 功能快速原型设计

今天尝试了 Claude 的 Artifacts 功能，发现它在快速原型设计上非常强大。

## 使用场景

需要给客户展示一个数据仪表盘的初步设计...

## 效率提升

至少提升了 **3 倍**！

```jsx
// Claude 生成的示例代码
function Dashboard() {
  return (
    <div className="p-4">
      <h1>数据仪表盘</h1>
    </div>
  )
}
```

## 总结

- 快速原型验证
- 客户演示
- 团队协作
```

### 3. 作者信息

```json
// content/authors/authors.json
{
  "alex-chen": {
    "name": "Alex Chen",
    "avatar": "/avatars/alex-chen.jpg",
    "bio": "Frontend Engineer & AI Enthusiast",
    "social": {
      "twitter": "@alexchen",
      "github": "alexchen"
    }
  },
  "sarah-li": {
    "name": "Sarah Li",
    "avatar": "/avatars/sarah-li.jpg",
    "bio": "Full Stack Developer",
    "social": {
      "twitter": "@sarahli"
    }
  }
}
```

---

## 核心模块实现

### 模块 1: Content Loader (内容加载器)

```typescript
// lib/content/loader.ts

import fs from 'fs/promises'
import path from 'path'
import { cache } from 'react'

const CONTENT_DIR = path.join(process.cwd(), 'content')

// 缓存化的读取函数
export const readFile = cache(async (filePath: string) => {
  try {
    const fullPath = path.join(CONTENT_DIR, filePath)
    return await fs.readFile(fullPath, 'utf-8')
  } catch {
    return null
  }
})

// 获取所有文章 slug
export async function getAllPostSlugs(): Promise<string[]> {
  const postsDir = path.join(CONTENT_DIR, 'posts')
  const files = await fs.readdir(postsDir)
  return files
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace(/\.md$/, ''))
}

// 获取所有文章元数据（用于列表页）
export async function getAllPostsMeta() {
  const slugs = await getAllPostSlugs()
  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const content = await readFile(`posts/${slug}.md`)
      if (!content) return null
      const { meta } = parseFrontmatter(content)
      return { ...meta, slug }
    })
  )
  return posts.filter(Boolean)
}
```

### 模块 2: Markdown Parser

```typescript
// lib/content/parser.ts

import matter from 'gray-matter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeHighlight from 'rehype-highlight'
import rehypeStringify from 'rehype-stringify'

export interface PostMeta {
  title: string
  slug: string
  date: string
  updated?: string
  author: string
  category: 'article' | 'log' | 'news'
  tags: string[]
  excerpt?: string
  cover?: string
  featured?: boolean
  editorsPick?: boolean
  readingTime?: number
  status: 'published' | 'draft' | 'archived'
}

export interface ParsedPost {
  meta: PostMeta
  content: string        // Markdown 原文
  html: string          // 转换后的 HTML
}

// 解析 frontmatter
export function parseFrontmatter(content: string): { meta: PostMeta; body: string } {
  const { data, content: body } = matter(content)
  
  return {
    meta: {
      title: data.title,
      slug: data.slug,
      date: data.date,
      updated: data.updated,
      author: data.author,
      category: data.category || 'article',
      tags: data.tags || [],
      excerpt: data.excerpt,
      cover: data.cover,
      featured: data.featured || false,
      editorsPick: data.editorsPick || false,
      readingTime: data.readingTime || estimateReadingTime(body),
      status: data.status || 'published',
    },
    body,
  }
}

// Markdown 转 HTML
export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)           // 支持 GitHub Flavored Markdown
    .use(remarkRehype)        // Markdown 转 HTML
    .use(rehypeHighlight)     // 代码高亮
    .use(rehypeStringify)
    .process(markdown)
  
  return String(result)
}

// 估算阅读时长
function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.trim().split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}
```

### 模块 3: 统一 API 接口

```typescript
// lib/content/index.ts

import { readFile, getAllPostSlugs, getAllPostsMeta } from './loader'
import { parseFrontmatter, markdownToHtml, PostMeta, ParsedPost } from './parser'

// 获取单篇文章（完整内容）
export async function getPost(slug: string): Promise<ParsedPost | null> {
  const content = await readFile(`posts/${slug}.md`)
  if (!content) return null
  
  const { meta, body } = parseFrontmatter(content)
  const html = await markdownToHtml(body)
  
  return {
    meta,
    content: body,
    html,
  }
}

// 获取文章列表（仅元数据）
export async function getPosts(options?: {
  category?: string
  tag?: string
  featured?: boolean
  limit?: number
  offset?: number
}) {
  let posts = await getAllPostsMeta()
  
  // 过滤
  if (options?.category) {
    posts = posts.filter(p => p.category === options.category)
  }
  if (options?.tag) {
    posts = posts.filter(p => p.tags.includes(options.tag!))
  }
  if (options?.featured) {
    posts = posts.filter(p => p.featured || p.editorsPick)
  }
  
  // 排序（按日期倒序）
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  
  // 分页
  if (options?.offset) {
    posts = posts.slice(options.offset)
  }
  if (options?.limit) {
    posts = posts.slice(0, options.limit)
  }
  
  return posts
}

// 获取相关文章
export async function getRelatedPosts(currentSlug: string, tags: string[], limit = 3) {
  const allPosts = await getAllPostsMeta()
  
  return allPosts
    .filter(p => p.slug !== currentSlug && p.tags.some(t => tags.includes(t)))
    .slice(0, limit)
}

export { type PostMeta, type ParsedPost }
```

---

## 部署模式适配

### 模式 A: 静态生成 (Static Export)

**适用场景**:
- Vercel / Netlify / GitHub Pages
- CDN 部署
- 内容不频繁更新

**配置**:

```javascript
// next.config.js
const nextConfig = {
  output: 'export',  // 关键配置
  distDir: 'dist',
  
  // 静态生成所有文章页面
  async generateStaticParams() {
    const { getAllPostSlugs } = await import('./lib/content/loader')
    const slugs = await getAllPostSlugs()
    return slugs.map(slug => ({ slug }))
  },
}
```

**页面实现**:

```tsx
// app/feed/[slug]/page.tsx
import { getPost, getAllPostSlugs } from '@/lib/content'
import { ArticleReader } from '@/components/feed/article-reader'

// 生成所有静态页面
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

export default async function ArticlePage({
  params,
}: {
  params: { slug: string }
}) {
  const post = await getPost(params.slug)
  
  if (!post) {
    return <div>Post not found</div>
  }
  
  return <ArticleReader post={post} />
}
```

**构建命令**:
```bash
# 构建时读取所有 Markdown，生成静态 HTML
pnpm build

# 输出到 dist/ 目录
# 可以直接部署到任何静态托管服务
dist/
├── index.html
├── feed/
│   ├── index.html
│   └── [slug]/
│       ├── article-1.html
│       └── article-2.html
└── ...
```

### 模式 B: Server 渲染 (Node.js Server)

**适用场景**:
- VPS / Docker 部署
- 内容频繁更新
- 需要实时渲染

**配置**:

```javascript
// next.config.js
const nextConfig = {
  // 不设置 output: 'export'，使用默认 SSR
  
  // 启用 ISR 支持
  experimental: {
    incrementalCacheHandlerPath: require.resolve('./cache-handler.js'),
  },
}
```

**页面实现**:

```tsx
// app/feed/[slug]/page.tsx
import { getPost } from '@/lib/content'
import { ArticleReader } from '@/components/feed/article-reader'

// 生成部分静态页面（热门文章）
export async function generateStaticParams() {
  const { getPosts } = await import('@/lib/content')
  // 只预生成前 20 篇热门文章
  const posts = await getPosts({ featured: true, limit: 20 })
  return posts.map((post) => ({ slug: post.slug }))
}

// 配置 ISR
export const dynamicParams = true  // 允许访问未预生成的页面
export const revalidate = 60       // 每 60 秒重新验证

export default async function ArticlePage({
  params,
}: {
  params: { slug: string }
}) {
  const post = await getPost(params.slug)
  
  if (!post) {
    return <div>Post not found</div>
  }
  
  return <ArticleReader post={post} />
}
```

**构建和运行**:
```bash
# 构建
pnpm build

# 运行 Node.js 服务器
pnpm start

# 或使用 Docker
docker build -t innate-web .
docker run -p 3000:3000 innate-web
```

**Docker 配置**:

```dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app

# 复制依赖
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

# 复制代码
COPY . .

# 构建
RUN pnpm build

# 暴露端口
EXPOSE 3000

# 运行（Server 模式）
CMD ["pnpm", "start"]
```

### 模式 C: 混合模式 (ISR + 按需生成)

**最佳实践**:

```tsx
// app/feed/[slug]/page.tsx

// 预生成热门内容
export async function generateStaticParams() {
  const { getPosts } = await import('@/lib/content')
  const posts = await getPosts({ limit: 50 }) // 预生成前50篇
  return posts.map((post) => ({ slug: post.slug }))
}

// ISR 配置
export const dynamicParams = true  // 未预生成的页面动态生成
export const revalidate = 3600     // 1小时后重新验证缓存

// 运行时缓存
export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)
  // ...
}
```

---

## 开发工作流

### 创建新文章

```bash
# 1. 创建 Markdown 文件
content/posts/2026-03-28-new-article.md

# 2. 编写内容（包含 frontmatter）
---
title: "New Article Title"
slug: "new-article"
date: "2026-03-28"
author: "Author Name"
category: "article"
tags: ["tag1", "tag2"]
---

# Article content here...

# 3. 提交到 Git

# 4. 部署
# - Static: 自动重新构建
# - Server: 文件立即可用（或等待 ISR 刷新）
```

### 内容预览（开发模式）

```bash
# 开发服务器实时预览
pnpm dev

# 修改 Markdown 文件后，页面自动刷新
```

---

## 实施计划

### Phase 1: 基础架构 (1 天)

- [ ] 1. 安装依赖
  ```bash
  pnpm add gray-matter unified remark-parse remark-gfm remark-rehype rehype-highlight rehype-stringify
  pnpm add -D @types/unist
  ```

- [ ] 2. 创建目录结构
  ```
  content/posts/
  lib/content/
  ├── index.ts
  ├── loader.ts
  ├── parser.ts
  └── types.ts
  ```

- [ ] 3. 迁移现有文章到 Markdown 文件

### Phase 2: 核心功能 (1-2 天)

- [ ] 4. 实现 loader.ts (文件读取)
- [ ] 5. 实现 parser.ts (frontmatter + markdown 解析)
- [ ] 6. 实现统一 API (index.ts)
- [ ] 7. 更新页面组件使用新 API

### Phase 3: 双模式适配 (1 天)

- [ ] 8. 配置 Static Export 模式
- [ ] 9. 配置 Server + ISR 模式
- [ ] 10. 创建 Dockerfile
- [ ] 11. 编写部署文档

### Phase 4: 优化 (可选)

- [ ] 12. 图片优化 (next/image)
- [ ] 13. RSS 生成
- [ ] 14. Sitemap 生成
- [ ] 15. 搜索功能 (全文索引)

---

## 配置示例

### next.config.js (可切换模式)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 模式切换：'export' | undefined
  // 注释掉 output 使用 Server 模式
  output: process.env.DEPLOY_MODE === 'static' ? 'export' : undefined,
  
  distDir: 'dist',
  
  images: {
    unoptimized: process.env.DEPLOY_MODE === 'static',
  },
  
  // 静态生成配置
  ...(process.env.DEPLOY_MODE === 'static' && {
    trailingSlash: true,
  }),
}

module.exports = nextConfig
```

### 环境变量

```bash
# .env.local
DEPLOY_MODE=static    # static | server
CONTENT_DIR=./content
```

### package.json scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "build:static": "DEPLOY_MODE=static next build",
    "build:server": "next build",
    "start": "next start",
    "export": "next build",
    "docker:build": "docker build -t innate-web .",
    "docker:run": "docker run -p 3000:3000 innate-web"
  }
}
```

---

## 总结

### 双模式支持的关键

| 特性 | Static | Server | 实现方式 |
|------|--------|--------|---------|
| 构建时生成 | ✅ | 部分 | generateStaticParams |
| 运行时读取 | ❌ | ✅ | fs.readFile |
| ISR 缓存 | ❌ | ✅ | revalidate |
| 按需生成 | ❌ | ✅ | dynamicParams |
| CDN 部署 | ✅ | ❌ | 输出静态文件 |
| 实时更新 | ❌ | ✅ | 文件修改立即可见 |

### 推荐方案

**开发**: 使用 Server 模式 (`pnpm dev`)
**生产**: 根据需求选择
- 内容不频繁更新 → Static (Vercel/Netlify)
- 内容频繁更新 → Server + ISR (VPS/Docker)

---

需要我开始实施这个方案吗？
