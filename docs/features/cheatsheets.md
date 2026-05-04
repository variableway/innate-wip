# Cheatsheets

Quick reference guides for 300+ developer tools and frameworks at `/cheatsheets`.

## Features
- **Card view** — Grid layout with category grouping, featured badges, and keyword tags
- **List view** — Compact vertical list for quick scanning
- **Search** — Full-text search across titles, categories, keywords, and tags
- **Category filtering** — Filter by frontmatter `category` field
- **Static generation** — All detail pages pre-rendered via `generateStaticParams`

## Data Source
- `docs/cheatsheets/*.md` — Markdown files with frontmatter (title, category, tags, keywords, updated, weight, intro)

## Key Files
- `apps/web/lib/cheatsheets/data.ts` — Server-side markdown parsing with gray-matter
- `apps/web/lib/cheatsheets/types.ts` — CheatsheetMeta, Cheatsheet interfaces
- `apps/web/components/cheatsheets/cheatsheets-page-client.tsx` — Card/list view toggle
- `apps/web/components/cheatsheets/cheatsheet-detail-client.tsx` — Detail page renderer
