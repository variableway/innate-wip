# Blog

A minimal, standalone blog built with Next.js + Tailwind CSS.

## Features

- **Markdown-based posts** — Write posts in Markdown with YAML frontmatter
- **Category & Tag filtering** — Filter posts by category or tags
- **Table of Contents** — Auto-generated ToC with scroll tracking
- **Dark mode** — System-aware dark mode support
- **Mobile responsive** — Two-column desktop, single-column mobile with back navigation
- **Reading time** — Auto-calculated reading time
- **Code highlighting** — Syntax highlighting for code blocks

## Project Structure

```
blog/
├── app/
│   ├── page.tsx              # Redirects to /writing
│   ├── writing/
│   │   └── page.tsx          # Main blog page (server)
│   ├── layout.tsx            # Root layout with theme provider
│   └── globals.css           # Tailwind + markdown styles
├── components/
│   ├── blog-page-client.tsx  # Main blog client logic
│   ├── blog-list.tsx         # Post list sidebar
│   ├── blog-viewer.tsx       # Post content viewer
│   ├── markdown-preview.tsx  # Markdown renderer
│   ├── table-of-contents.tsx # ToC with scroll tracking
│   ├── header.tsx            # Top navigation bar
│   └── theme-provider.tsx    # Dark mode provider
├── lib/
│   ├── content/
│   │   ├── loader.ts         # File system reading
│   │   ├── parser.ts         # Frontmatter + markdown parsing
│   │   ├── types.ts          # TypeScript types
│   │   └── index.ts          # Content API
│   └── utils.ts              # cn() utility
├── content/writing/          # Your blog posts (.md files)
└── package.json
```

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Writing a Post

Create a `.md` file in `content/writing/`:

```yaml
---
title: "Your Post Title"
slug: your-post-slug
date: 2026-05-30
author: Your Name
category: article
tags: [nextjs, react]
status: published
excerpt: A short summary for the list view.
---

Your markdown content here...
```

### Frontmatter Fields

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Post title |
| `slug` | Yes | URL-friendly identifier |
| `date` | Yes | Publish date (ISO or YYYY-MM-DD) |
| `author` | No | Author name (default: Anonymous) |
| `category` | No | Category name (default: article) |
| `tags` | No | Array of tag strings |
| `status` | No | `published` / `draft` / `archived` |
| `excerpt` | No | Short description for list view |
| `readingTime` | No | Override auto-calculated reading time |

## Tech Stack

- **Next.js 16** — React framework
- **Tailwind CSS 4** — Utility-first CSS
- **gray-matter** — YAML frontmatter parsing
- **react-markdown** — Markdown rendering
- **remark-gfm** — GitHub Flavored Markdown
- **rehype-highlight** — Code syntax highlighting
- **next-themes** — Dark mode
