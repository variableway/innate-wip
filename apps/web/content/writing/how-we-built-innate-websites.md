---
title: "How We Built This Website"
slug: how-we-built-innate-websites
date: 2026-04-14
author: Innate Team
category: article
tags: [nextjs, tailwind, monorepo, architecture, static-site]
status: published
excerpt: "A behind-the-scenes look at the tech stack, architecture, and decisions behind the Innate website."
---

## The Stack

The Innate website is built with a modern, opinionated stack designed for developer experience and performance:

- **Next.js 16** with App Router and Turbopack
- **React 19** with Server Components
- **TypeScript 6** for type safety
- **Tailwind CSS 4** with OKLCH color tokens
- **pnpm workspaces** for monorepo management
- **Radix UI** for accessible headless components

## Why This Stack

### Next.js 16 + App Router

We chose Next.js for its mature static site generation and flexible rendering modes. The App Router gives us:

- **Server Components by default** — content-heavy pages like blog posts and tutorials render on the server, shipping zero client JS
- **File-based routing** — each directory under `app/` is a route, making the structure self-documenting
- **Multiple build modes** — we can build as a static site (`next build` with static export), or with ISR for dynamic content

### Tailwind CSS 4

Tailwind 4 with OKLCH color space gives us perceptually uniform colors across light and dark themes. We define design tokens as CSS variables and reference them through Tailwind utilities.

### Monorepo with pnpm

The project is structured as a pnpm workspace monorepo:

```
innate-websites/
├── apps/web/           # Next.js application
├── packages/ui/        # Shared UI component library
├── packages/utils/     # Shared utilities (cn, etc.)
└── packages/tsconfig/  # Shared TypeScript config
```

This lets us share components and utilities across packages without publishing to npm. Changes in `packages/ui` are immediately available in `apps/web`.

## Architecture

### Layout System

The app uses a composable layout system with three layers:

1. **LeftBar** — a narrow 56px icon bar for primary navigation (Home, Making, Writing)
2. **Sidebar** — a wider 224px panel that shows contextual navigation based on the current route
3. **Main content** — the fluid content area

A `layout-config.ts` file controls which layers appear on each route, so the Making section can show its own sidebar items while the Writing section shows a different set.

### Content System

All long-form content lives as Markdown files in `content/` directories:

```
content/
├── posts/       # Feed/blog posts
├── tutorials/   # Tutorial content
├── writing/     # Writing section posts
└── authors/     # Author metadata (JSON)
```

Each Markdown file has YAML frontmatter with metadata:

```yaml
---
title: "Post Title"
slug: post-slug
date: 2026-04-14
author: Innate Team
category: thought
tags: [tag1, tag2]
status: published
excerpt: Short summary for list views
---
```

We use **gray-matter** for frontmatter parsing and **unified/remark** for Markdown-to-HTML conversion with GitHub Flavored Markdown and syntax highlighting. The content pipeline is:

1. Read `.md` files from disk with `fs/promises`
2. Parse frontmatter with `gray-matter`
3. Convert body to HTML with `unified` + `remark-parse` + `remark-gfm` + `remark-rehype` + `rehype-highlight`
4. Cache results with React `cache()` for SSR deduplication

### Rendering Modes

The app supports three modes:

- **Development** — full dynamic rendering with Turbopack HMR
- **Static Export** — `STATIC_EXPORT=true next build` generates a fully static site
- **Server Mode** — `SERVER_MODE=true next build` enables ISR with revalidation

## Key Components

### Two-Column Writing Layout

The Writing section uses a client-side two-column layout:

- **Left column** — scrollable list of posts with title, excerpt, category badge, and tags
- **Right column** — rendered Markdown content with a sticky Table of Contents sidebar
- **Mobile** — single column with list/detail navigation

The ToC is extracted from heading elements and uses `IntersectionObserver` to highlight the current section as you scroll.

### Sidebar Navigation

The sidebar is route-aware. When you navigate to `/making`, it shows Making-specific sub-items (Projects, Weekly, Insights, Issues). When you navigate to `/writing`, it shows the Writing section. This is handled by the layout configuration system, not by separate sidebar components for each section.

## Styling Approach

We use Tailwind utility classes almost exclusively. Custom CSS is minimal — limited to:

- CSS variables for theming (OKLCH color tokens)
- `tw-animate-css` for animation utilities
- Prose classes from Tailwind Typography for rendered Markdown content

Dark mode is handled by `next-themes` with system preference detection.

## What We Would Do Differently

1. **MDX instead of MD** — MDX would let us embed React components in blog posts (interactive code blocks, custom callouts). We stuck with plain Markdown for simplicity.

2. **Database-backed content** — For a team, a headless CMS would be better than Markdown files for content management. But for a solo developer or small team, files in Git are hard to beat for simplicity.

3. **More shared abstractions** — Some page patterns (list + detail, data loading, metadata) could be abstracted further. We chose explicit over abstract to keep things understandable.

## Try It Yourself

The full source is available in our monorepo. Clone it, run `pnpm install && pnpm dev`, and you have a running copy in seconds.

> The best way to learn a stack is to build something real with it. Start with a simple page, add a layout, throw in some content. The architecture emerges from the doing.
