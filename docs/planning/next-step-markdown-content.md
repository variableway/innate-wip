# Next Step: Markdown Content System

## 概述

本文档指导如何使用静态 Markdown 文件作为网站内容（教程、文档、博客等）。

---

## 方案对比

### 推荐方案: Next.js MDX

```bash
# 安装依赖
pnpm add @next/mdx @mdx-js/loader @mdx-js/react
pnpm add gray-matter  # 解析 Frontmatter
pnpm add shiki        # 代码高亮
```

**优点**:
- 原生 Next.js 支持
- 构建时渲染，性能好
- 支持 React 组件嵌入 Markdown
- 类型安全

**缺点**:
- 内容更新需要重新构建
- 不适合频繁变动的内容

---

## 实施步骤

### Step 1: 配置 Next.js 支持 MDX

```javascript
// next.config.mjs
import withMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
}

export default withMDX({
  extension: /\.mdx?$/,
})(nextConfig)
```

### Step 2: 创建内容目录结构

```
apps/web/
├── content/
│   ├── tutorials/
│   │   ├── getting-started.mdx
│   │   ├── ai-coding-basics.mdx
│   │   └── advanced/
│   │       └── architecture-patterns.mdx
│   └── docs/
│       └── api-reference.mdx
├── lib/
│   └── content.ts      # 内容读取工具
├── app/
│   ├── tutorials/
│   │   ├── page.tsx    # 教程列表页
│   │   └── [slug]/
│   │       └── page.tsx # 教程详情页
```

### Step 3: 定义 Frontmatter 规范

```markdown
---
title: "AI Coding 入门指南"
description: "从零开始学习 AI 辅助编程"
date: "2026-03-27"
category: "tutorial"
level: "入门"
tags: ["ai", "coding", "beginner"]
author: "Superlinear Academy"
coverImage: "/images/ai-coding-cover.jpg"
---

# AI Coding 入门指南

正文内容...
```

### Step 4: 创建内容读取工具

```typescript
// lib/content.ts
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDirectory = path.join(process.cwd(), 'content')

export interface ContentMeta {
  slug: string
  title: string
  description: string
  date: string
  category: string
  level?: string
  tags?: string[]
  author?: string
}

// 获取所有内容
export function getAllContent(type: string): ContentMeta[] {
  const typeDir = path.join(contentDirectory, type)
  const files = fs.readdirSync(typeDir)
  
  return files
    .filter(file => file.endsWith('.mdx') || file.endsWith('.md'))
    .map(file => {
      const slug = file.replace(/\.mdx?$/, '')
      const filePath = path.join(typeDir, file)
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      const { data } = matter(fileContent)
      
      return {
        slug,
        ...data,
      } as ContentMeta
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// 获取单篇内容
export function getContentBySlug(type: string, slug: string) {
  const filePath = path.join(contentDirectory, type, `${slug}.mdx`)
  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(fileContent)
  
  return {
    meta: data as ContentMeta,
    content,
  }
}
```

### Step 5: 创建动态渲染组件

```tsx
// components/mdx-content.tsx
import { MDXRemote } from 'next-mdx-remote/rsc'
import { CodeBlock } from './code-block'
import { TableOfContents } from './toc'

const components = {
  // 自定义代码块
  pre: CodeBlock,
  // 自定义标题（用于 TOC 生成）
  h2: (props: any) => <h2 id={props.id} {...props} />,
  h3: (props: any) => <h3 id={props.id} {...props} />,
}

interface MDXContentProps {
  content: string
}

export function MDXContent({ content }: MDXContentProps) {
  return (
    <div className="prose prose-lg max-w-none">
      <MDXRemote source={content} components={components} />
    </div>
  )
}
```

### Step 6: 创建内容页面

#### 列表页

```tsx
// app/tutorials/page.tsx
import Link from 'next/link'
import { getAllContent } from '@/lib/content'
import { Card, CardHeader, CardTitle, CardDescription } from '@allone/ui'

export default function TutorialsPage() {
  const tutorials = getAllContent('tutorials')
  
  return (
    <div className="max-w-7xl mx-auto py-6 px-6">
      <h1 className="text-2xl font-bold mb-6">Tutorials</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutorials.map((tutorial) => (
          <Link key={tutorial.slug} href={`/tutorials/${tutorial.slug}`}>
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="text-sm text-muted-foreground mb-2">
                  {tutorial.level} • {tutorial.date}
                </div>
                <CardTitle>{tutorial.title}</CardTitle>
                <CardDescription>{tutorial.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
```

#### 详情页

```tsx
// app/tutorials/[slug]/page.tsx
import { getAllContent, getContentBySlug } from '@/lib/content'
import { MDXContent } from '@/components/mdx-content'
import { TableOfContents } from '@/components/toc'

interface PageProps {
  params: { slug: string }
}

export async function generateStaticParams() {
  const tutorials = getAllContent('tutorials')
  return tutorials.map((t) => ({ slug: t.slug }))
}

export default function TutorialPage({ params }: PageProps) {
  const { meta, content } = getContentBySlug('tutorials', params.slug)
  
  return (
    <div className="max-w-7xl mx-auto py-6 px-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <article>
            <header className="mb-8">
              <h1 className="text-3xl font-bold mb-4">{meta.title}</h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <span>{meta.author}</span>
                <span>•</span>
                <span>{meta.date}</span>
                <span>•</span>
                <span>{meta.level}</span>
              </div>
            </header>
            
            <MDXContent content={content} />
          </article>
        </div>
        
        {/* TOC Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <TableOfContents content={content} />
          </div>
        </aside>
      </div>
    </div>
  )
}
```

---

## 增强功能

### 1. 代码高亮

```tsx
// components/code-block.tsx
import { codeToHtml } from 'shiki'

interface CodeBlockProps {
  children: {
    props: {
      className?: string
      children: string
    }
  }
}

export async function CodeBlock({ children }: CodeBlockProps) {
  const { className, children: code } = children.props
  const lang = className?.replace('language-', '') || 'text'
  
  const html = await codeToHtml(code, {
    lang,
    theme: 'github-dark',
  })
  
  return <div dangerouslySetInnerHTML={{ __html: html }} />
}
```

### 2. 目录生成

```tsx
// components/toc.tsx
import { useMemo } from 'react'

interface TOCItem {
  id: string
  text: string
  level: number
}

export function TableOfContents({ content }: { content: string }) {
  const headings = useMemo(() => {
    const regex = /^(#{2,3})\s+(.+)$/gm
    const items: TOCItem[] = []
    let match
    
    while ((match = regex.exec(content)) !== null) {
      const level = match[1].length
      const text = match[2]
      const id = text.toLowerCase().replace(/\s+/g, '-')
      items.push({ id, text, level })
    }
    
    return items
  }, [content])
  
  return (
    <nav className="text-sm">
      <h3 className="font-semibold mb-4">目录</h3>
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: (heading.level - 2) * 16 }}
          >
            <a
              href={`#${heading.id}`}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
```

### 3. 前后导航

```tsx
// components/prev-next-nav.tsx
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ContentMeta } from '@/lib/content'

interface PrevNextNavProps {
  prev: ContentMeta | null
  next: ContentMeta | null
}

export function PrevNextNav({ prev, next }: PrevNextNavProps) {
  return (
    <div className="flex items-center justify-between mt-12 pt-8 border-t">
      {prev ? (
        <Link
          href={`/tutorials/${prev.slug}`}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          <div className="text-left">
            <div className="text-xs">Previous</div>
            <div className="font-medium">{prev.title}</div>
          </div>
        </Link>
      ) : (
        <div />
      )}
      
      {next ? (
        <Link
          href={`/tutorials/${next.slug}`}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <div className="text-right">
            <div className="text-xs">Next</div>
            <div className="font-medium">{next.title}</div>
          </div>
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <div />
      )}
    </div>
  )
}
```

---

## 与现有项目集成

### 1. 添加导航入口

在 LeftBar 中添加教程入口：

```typescript
// components/leftbar.tsx
const leftBarItems: LeftBarItem[] = [
  // ... existing items
  {
    id: "tutorials",
    icon: <BookOpen className="h-5 w-5" />,
    label: "Tutorials",
    href: "/tutorials",
  },
]
```

### 2. 使用现有布局

新创建的页面会自动使用 `AppLayout`，根据配置显示 LeftBar 和 Sidebar。

### 3. 内容分类显示在 Sidebar

可以根据 Markdown 的 Frontmatter 动态生成 Sidebar 内容：

```typescript
// components/sidebar.tsx (更新)
import { getAllContent } from '@/lib/content'

export function Sidebar() {
  const pathname = usePathname()
  const tutorials = getAllContent('tutorials')
  
  // 如果当前是教程页面，显示教程分类
  if (pathname.startsWith('/tutorials')) {
    return (
      <aside className="w-64 border-r border-border bg-card flex flex-col h-full">
        <div className="p-4">
          <h2 className="font-semibold">Tutorials</h2>
        </div>
        <nav className="flex-1 overflow-y-auto px-4">
          {tutorials.map((tutorial) => (
            <Link
              key={tutorial.slug}
              href={`/tutorials/${tutorial.slug}`}
              className={cn(
                "block py-2 text-sm",
                pathname === `/tutorials/${tutorial.slug}`
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tutorial.title}
            </Link>
          ))}
        </nav>
      </aside>
    )
  }
  
  // ... existing sidebar content
}
```

---

## 示例 Markdown 文件

```markdown
---
title: "AI Coding 第一课：环境配置"
description: "学习如何配置 AI 辅助开发环境"
date: "2026-03-27"
category: "tutorial"
level: "入门"
tags: ["ai", "setup", "beginner"]
author: "Superlinear Academy"
---

## 课程介绍

欢迎学习 AI Coding 系列课程！在本课中，我们将...

## 前置要求

- 基础的编程知识
- 一台可以上网的电脑

## 环境配置

### 1. 安装 Node.js

```bash
# 使用 nvm 安装
nvm install 20
nvm use 20
```

### 2. 配置编辑器

推荐使用 VS Code 配合以下插件：

- GitHub Copilot
- IntelliCode

## 下一步

完成环境配置后，进入 [第二课：基础命令](../lesson-2)。
```

---

## 总结

通过上述步骤，你可以：

1. ✅ 使用 Markdown/MDX 编写内容
2. ✅ 自动生成内容列表和导航
3. ✅ 支持代码高亮和目录
4. ✅ 与现有布局系统无缝集成
5. ✅ 类型安全的开发体验

**建议从简单的博客/教程开始，逐步完善功能。**
