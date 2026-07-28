# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Innate** is a personal website and project tracking platform that aggregates GitHub Issues, project documentation, and weekly progress summaries with AI analysis. Deployed as a static site to GitHub Pages.

## Commands

```bash
pnpm install                    # Install dependencies
pnpm dev                        # Start Next.js dev server (apps/web)
./run.sh web dev                # Alternative: run specific app
pnpm build                      # Build all packages
pnpm lint                       # Lint all packages
pnpm clean                      # Clean all build artifacts and node_modules
```

### Web app specific (run from apps/web)

```bash
pnpm build:static               # Static export for GitHub Pages (STATIC_EXPORT=true)
pnpm build:server               # Server mode build
pnpm start:static               # Serve static export locally (npx serve dist)
```

### Data management (run from apps/web)

```bash
node scripts/fetch-issues.js    # Fetch GitHub issues into data/
node scripts/fetch-agents.js    # Fetch project AGENTS.md files
node scripts/fetch-projects.js  # Fetch project metadata
node scripts/generate-weekly.js # Generate weekly summaries
node scripts/generate-insights.js # Generate insights
node scripts/run-all.sh         # Run all data scripts
```

## Architecture

### Monorepo (pnpm workspaces)

- **`apps/web/`** — Main Next.js 16 app (`@innate/web`)
- **`packages/ui/`** — 不在本仓库；`@innate/ui` 通过 `workspace:*` 直接引用 `<innate-base>/packages/ui`（需位于 innate-base 的 `apps/innate-wip` 路径下）
- **`packages/utils/`** — 同上，`@innate/utils` 直接引用 `<innate-base>/packages/utils`
- **`packages/tsconfig/`** — Shared TypeScript configs (base, nextjs, react-library)
- **`packages/task-watcher/`** — CLI tool for task syncing (`@innate/task-watcher`)

### Web app structure (`apps/web/`)

- **`app/`** — Next.js App Router pages
  - `making/` — Core features: issues, projects, weekly summaries, insights
  - `writing/`, `tutorials/`, `feed/`, `course/`, `learning-library/` — Content sections
  - `collections/` — Collection pages
- **`content/`** — Markdown/MDX content files (posts, tutorials, writing)
- **`data/`** — JSON data files (issues, projects, weekly summaries, insights) — gitignored
- **`scripts/`** — Node.js scripts for fetching GitHub data and generating summaries
- **`components/`** — React components including `making/` feature components and markdown renderers
- **`lib/making/`** — Data layer (types, static data imports, server-side loading)

### Key path aliases (configured in apps/web/tsconfig.json)

- `@/*` → `apps/web/*` (local imports)
- `@allone/ui` → `packages/ui/src`
- `@allone/utils` → `packages/utils/src`

### Build modes

The app supports two build modes controlled by environment variables:
- **Static export** (default for production): `STATIC_EXPORT=true next build` — outputs to `dist/`
- **Server mode**: `SERVER_MODE=true next build` — enables ISR
- **GitHub Pages**: adds `basePath` and `assetPrefix` via `GITHUB_PAGES=true`

### Data flow

1. Scripts fetch data from GitHub API → write to `apps/web/data/*.json`
2. `lib/making/data.ts` imports JSON statically for build-time rendering
3. `ServerMarkdown` component renders markdown to HTML at build time
4. Interactive features use client-side components

### UI component library

`@innate/ui`（Base UI 组件库）通过 `workspace:*` 直接引用 `<innate-base>/packages/ui`，本仓库不含副本。新增组件在 innate-base 根包中维护。Uses CVA + tailwind-merge for variant styling.

## Tech Stack

- Next.js 16, React 19, TypeScript 6
- Tailwind CSS 4, Base UI, Lucide React icons
- unified/remark/rehype for markdown processing
- pnpm workspaces, deployed to GitHub Pages via GitHub Actions
