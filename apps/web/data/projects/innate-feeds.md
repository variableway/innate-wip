# AGENTS.md

> **项目事实来源：** [`docs/project/index.md`](docs/project/index.md) — spec、issues、多 Agent 交接日志均在该目录。下文为仓库地图与开发命令（L2），新任务请先读 project 文档再动手。

Workspace guide for `innate-feeds`. This repository contains a full-stack web application for discovering and browsing GitHub trending and starred repositories.

## Project overview

**Innate Feeds** is a full-stack web app that:

- Displays GitHub trending repositories (daily, weekly, monthly snapshots).
- Displays GitHub starred repositories for the authenticated user.
- Supports filtering by language, topic, search term, snapshot date, stars range, and sorting by stars / updated / created / starred date.
- Syncs data from GitHub via the `gh` CLI and/or Firecrawl.
- Supports dual deployment modes: API mode (Hono backend + SQLite) and static mode (GitHub Pages with pre-exported JSON data).

## Repository layout

```
innate-feeds/
├── backend/                 # Hono API server + CLI + sync logic + data export/import
│   ├── src/
│   │   ├── app/             # Application entry points
│   │   │   ├── server.ts    # Hono HTTP server, API routes
│   │   │   └── cli.ts       # Command-line interface for sync/list/stats
│   │   ├── collector/       # Data collection layer
│   │   │   ├── github.ts    # GitHub API / gh CLI wrappers (uses execFileSync)
│   │   │   ├── firecrawl.ts # Firecrawl-based GitHub Trending scraper
│   │   │   └── sync.ts      # Trending and starred sync orchestration
│   │   ├── data/            # Static data export/import utilities
│   │   │   ├── export-incremental.ts  # Incremental JSON chunk exporter
│   │   │   ├── export-static.ts       # Full static exporter
│   │   │   ├── import-static.ts       # Import static JSON into SQLite
│   │   │   ├── manifest-utils.ts      # Manifest read/write helpers
│   │   │   └── hidden-store.ts        # Hidden ("deleted") items store (~/.innate/hidden.json)
│   │   └── db/              # SQLite database layer
│   │       ├── index.ts     # Connection, queries, CRUD helpers
│   │       ├── schema.sql   # SQLite schema (trending_repos, starred_repos, topics)
│   │       └── paths.ts     # Database path resolution (INNATE_HOME / DB_PATH)
│   ├── package.json
│   ├── tsconfig.json
│   └── feeds.db*            # Runtime SQLite database (WAL mode)
├── frontend/                # TanStack Router + Vite + React 19 + Tailwind v4
│   ├── src/
│   │   ├── pages/           # TanStack Router route definitions (page.tsx + route.tsx)
│   │   │   ├── __root/      # Root layout with sidebar, header, category panel
│   │   │   ├── index/       # Redirects to /trending
│   │   │   ├── trending/    # Trending repos page
│   │   │   └── starred/     # Starred repos page
│   │   ├── components/      # AppHeader, AppSidebar, CategoryPanel, FeedCard, FilterBar, StatsCards
│   │   ├── hooks/           # usePersistedFeedFilters
│   │   ├── services/        # API client (feeds.ts) — supports both API and static modes
│   │   ├── types/           # TypeScript domain types (feed.ts)
│   │   ├── lib/             # utils.ts (cn, formatNumber, formatDate), theme.tsx, feed-filters-storage.ts
│   │   ├── themes/          # CSS theme files (linear.css, notion.css)
│   │   ├── main.tsx         # React entry point
│   │   ├── router.tsx       # Route tree assembly
│   │   └── styles.css       # Tailwind CSS v4 theme + dark mode
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts       # Vite config with GitHub Pages plugin + API proxy
├── git-repo-scanner/        # Standalone Go CLI (not part of the web app)
├── docs/                    # Documentation
├── tasks/                   # Task working directories
├── package.json             # Root workspace scripts (uses concurrently)
├── dev.sh                   # Bash helper to start both dev servers
└── CLAUDE.md
```

## Technology stack

| Layer | Technology |
|---|---|
| Runtime | Bun / Node.js 18+ |
| Frontend framework | React 19 |
| Routing | TanStack Router (manual route registration, not file-based) |
| Build tool | Vite 6 |
| Styling | Tailwind CSS v4 with CSS-based theme configuration |
| UI utilities | `lucide-react`, `clsx`, `tailwind-merge`, `sonner` (toasts), `next-themes` |
| Backend framework | Hono 4 |
| HTTP server | `@hono/node-server` |
| Database | SQLite via `better-sqlite3` |
| Data fetching | GitHub CLI (`gh`) and Firecrawl |
| Validation | Zod (used in API input validation) |
| Type checking | TypeScript 5.7+ |
| Side utility | Go 1.26+ (`git-repo-scanner`) |

## Build and development commands

All commands assume you are in the project root unless noted.

### Install dependencies

```bash
bun install
bun run install:all   # or: cd backend && bun install && cd ../frontend && bun install
```

### Start development

```bash
# Start backend (http://localhost:4000) and frontend (http://localhost:3000)
bun run dev

# Or use the shell helper
./dev.sh

# Individually
bun run dev:backend   # cd backend && bun run dev
bun run dev:frontend  # cd frontend && bun run dev
```

The Vite dev server proxies `/api` requests to `http://localhost:4000`.

### Sync data from GitHub

These require the `gh` CLI to be installed and authenticated (`gh auth status`).

```bash
# From the repo root
cd backend

# Sync trending repos for all periods
bun run sync:trending

# Sync only daily / weekly / monthly
bun run sync:daily
bun run sync:weekly
bun run sync:monthly

# Sync authenticated user's starred repos
bun run sync:starred

# Sync only recently starred (last 24h) — incremental
bun run sync:starred:recent

# Last 90 days of digest issues + current trending + starred window + READMEs
bun run sync:window
# or from repo root: bun run data:sync:window

# CLI equivalents
bunx tsx src/app/cli.ts sync all-trending
bunx tsx src/app/cli.ts sync trending daily
bunx tsx src/app/cli.ts sync starred [username] [--force] [--days N]
bunx tsx src/app/cli.ts sync digest --days 90
bunx tsx src/app/cli.ts sync window [--days 90] [--skip-readme] [--force]
```

### Other backend CLI commands

```bash
cd backend
bun run list            # List feed items
bun run list:trending   # List trending items
bun run list:starred    # List starred items
bun run dates           # List available trending snapshot dates
bun run stats           # Show database statistics
```

### Static data export / import

```bash
cd backend

# Export incremental JSON chunks (for GitHub Pages static mode)
bun run export:incremental

# Full static export
bun run export:static

# Import static JSON data back into SQLite
bun run import:static
```

### Frontend build

```bash
cd frontend
bun run dev       # Dev server on port 3000
bun run build     # Production build to frontend/dist/
bun run preview   # Preview production build
```

### Static site build (GitHub Pages)

```bash
# From repo root — sync/export first (see docs/data-update-workflow.md), then:
bun run build:static

# Full 90-day snapshot then static build
bun run data:update:window && bun run build:static

# Or with custom base path for project pages
VITE_BASE_PATH=/your-repo bun run build:pages
```

### Type checking

```bash
cd backend  && bun run typecheck
cd frontend && bun run typecheck
```

### Code formatting

```bash
bun run format:ts         # Format all TS files with Prettier
bun run format:ts:check   # Check formatting without writing
```

## Runtime architecture

```
┌─────────────────┐      /api/*       ┌─────────────────────────────┐
│  Vite dev server│ ─────────────────> │  Hono server (backend/src/  │
│  port 3000      │   (proxied)        │  app/server.ts) port 4000   │
└─────────────────┘                    └─────────────────────────────┘
                                                  │
                       ┌──────────────────────────┼──────────────────────────┐
                       ▼                          ▼                          ▼
              better-sqlite3              sync.ts / cli.ts              gh / Firecrawl
              (feeds.db)                  github.ts firecrawl.ts
```

### Dual deployment modes

1. **API mode** (default): Frontend calls `/api/*` endpoints, backed by SQLite. README disk cache (`./readmes`) is returned immediately; the backend refreshes from GitHub in the background. Digest is served from the newest local dump (`~/.innate/digest` or `frontend/public/data/digest.json`), with a live GitHub fallback if the dump is empty.
2. **Static mode** (`VITE_STATIC_MODE=true`): Frontend fetches pre-exported JSON from `/data/` (`manifest.json` chunks, `digest.json`). No backend. The browser still calls GitHub live for digest freshness and READMEs, and falls back to bundled `/data/readmes/{owner}/{repo}.md` when live fetch fails.

Both modes are meant to be used together: `bun run data:update:window` writes snapshots into the repo, then `bun run build:static` ships them. Live fetch keeps Pages from going stale between deploys.

GitHub Trending has no historical API. A 90-day window syncs **current** daily/weekly/monthly lists, starred repos in that window, digest issues **created** in that window, and README prefetch for those repos.

### API endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/feeds` | List feed items. Query params: `type` (`trending` or `starred`), `language`, `topics` (comma-separated), `search`, `sort` (`stars`\| `updated`\| `created`\| `starred`), `order` (`asc`\| `desc`), `date`, `starsMin`, `starsMax`, `page`, `pageSize`. |
| GET | `/api/feeds/stats` | Aggregate stats: total repos, trending count, starred count, top languages. |
| GET | `/api/feeds/languages` | All distinct repository languages. |
| GET | `/api/feeds/dates` | Available trending snapshot dates. |
| POST | `/api/feeds/sync` | Trigger sync. Body validated with Zod: `{ type: "trending" \| "starred" \| "all-trending", period?, username?, force?, days? }`. |
| POST | `/api/feeds/hide` | Hide an item so it is filtered out of all list/detail responses. Body: `{ kind: "digest" \| "repo", id }` (`id` = digest item id, or repo `fullName`). Persisted to `hidden.json` next to the DB; also applied at static-export time. |
| POST | `/api/feeds/unhide` | Undo a hide. Same body as `/api/feeds/hide`. |

### Sync pipeline

1. **Trending**: `sync.ts` calls `fetchTrendingWithFirecrawl()` first. If Firecrawl returns no results, it falls back to `fetchTrendingRepos()`, which scrapes `https://github.com/trending` via `gh api` and then fetches full repo metadata via the GitHub API.
2. **Starred**: `sync.ts` calls `fetchStarredReposWithDate()`, which paginates through `gh api user/starred` (or `users/{username}/starred`) using the `application/vnd.github.v3.star+json` accept header to obtain `starred_at` timestamps. Supports incremental sync via `stopAt` / `days` parameters.
3. Both pipelines call `upsertTrendingRepo()` / `upsertStarredRepo()`, `insertTrendingTopics()` / `insertStarredTopics()` inside a single `better-sqlite3` transaction.
4. **Window sync** (`sync window`, default 90 days): current trending + starred since cutoff + digest issues created in-window + README prefetch into `./readmes` and `frontend/public/data/readmes`.
5. **Digest**: `issues-digest.ts` writes JSON (not SQLite). `data:export` copies the newest dump to `frontend/public/data/digest.json`.
6. **README (API)**: `fetchRepoReadme()` is cache-first with a background remote refresh. **README (static / browser)**: live GitHub first, bundled `/data/readmes` fallback. Batch prefetch skips files newer than 7 days unless `--force`.

## Database

SQLite database file: `~/.innate/feeds.db` by default (configurable via `DB_PATH` or `INNATE_HOME` env vars). Uses WAL mode with foreign keys enabled.

Schema is defined in `backend/src/db/schema.sql`:

- `trending_repos` — trending repository snapshots (composite text PK `trending-{date}-{period}-{repoId}`, includes `period`, `snapshot_date`).
- `trending_repo_topics` — many-to-many topics for trending repos.
- `starred_repos` — starred repository metadata (integer PK = GitHub repo ID, includes `starred_at`).
- `starred_repo_topics` — many-to-many topics for starred repos.
- `trending_snapshots` — historical snapshot analytics table (defined but not yet written to by sync code).

## Code organization and conventions

### TypeScript / general

- **ES modules** everywhere (`"type": "module"` in both `package.json` files).
- **Strict TypeScript** is enabled (`strict: true`).
- **Path alias**: `@/*` maps to `src/*` in the frontend. In the backend, local imports use relative paths with explicit `.js` extensions (e.g., `import { … } from "./db/index.js"`).
- **No test suite** is currently present.

### Backend

- `app/server.ts` — Hono HTTP server with Zod input validation, global error handler, and try/catch on all routes.
- `app/cli.ts` — mirrors the sync/list/stats functionality for command-line use.
- `collector/github.ts` — wraps the `gh` CLI with `execFileSync` (not `execSync`) to prevent shell injection. Validates `username` against a whitelist regex.
- `collector/firecrawl.ts` — uses the `firecrawl` SDK to scrape GitHub Trending with a JSON extraction schema. Generates deterministic repo IDs from SHA-256 hash of `fullName`.
- `collector/sync.ts` — orchestrates trending/starred sync with transactional writes.
- `collector/sync-window.ts` — 90-day window: trending + starred + digest + README prefetch for static/API snapshots.
- `data/export-incremental.ts` — exports data as incremental JSON chunks with a manifest for static mode.
- `data/import-static.ts` — imports static JSON back into SQLite.
- `db/index.ts` — all SQL lives here. Uses prepared statements from `better-sqlite3`. Batch-fetches topics to avoid N+1 queries. Exports typed interfaces (`FeedItemDTO`, `FeedStatsDTO`, `TrendingItemRow`, `StarredItemRow`).
- `db/paths.ts` — resolves database path via `DB_PATH` env var or `INNATE_HOME` (defaults to `~/.innate`).

### Frontend

- `router.tsx` manually wires routes (`__root`, `index`, `trending`, `starred`). `index` redirects to `/trending`. Supports GitHub Pages base path.
- Page components (`trending/page.tsx`, `starred/page.tsx`) manage state with `useState` / `useEffect` / `useCallback` and call `services/feeds.ts`.
- `FilterBar` implements 300ms search debouncing to avoid excessive API calls.
- `usePersistedFeedFilters` hook persists filter state to localStorage.
- Components use `React.forwardRef` and accept a `className` prop merged via the `cn()` utility.
- `services/feeds.ts` supports both API and static modes. In static mode, fetches JSON chunks via `manifest.json`, merges digest `digest.json` with live GitHub, and prefers live READMEs with a static-file fallback.
- `services/hidden.ts` tracks user-hidden items (localStorage + `/api/feeds/hide`; static mode also merges the exported `hidden.json`). `feeds.ts` filters them out of every list/detail response.
- `styles.css` defines a Tailwind v4 theme with CSS custom properties and a `.dark` variant. Additional themes available via `themes/linear.css` and `themes/notion.css`.

### Go scanner

- `main.go` is a single-file CLI.
- Recursively walks a folder, detects `.git` directories, parses `.git/config` for `remote "origin"` URLs.
- Supports GitHub and GitLab API enrichment.

## Where to make changes

| If you are… | Go to… |
|---|---|
| Adding or changing API endpoints | `backend/src/app/server.ts` |
| Changing how repos are fetched from GitHub | `backend/src/collector/github.ts` |
| Changing trending/starred/window sync | `backend/src/collector/sync.ts`, `sync-window.ts`, `firecrawl.ts` |
| Changing the 90-day window / README prefetch | `backend/src/collector/sync-window.ts` |
| Changing digest issues sync | `backend/src/collector/issues-digest.ts` |
| Changing the database schema or queries | `backend/src/db/schema.sql` and `backend/src/db/index.ts` |
| Changing database path resolution | `backend/src/db/paths.ts` |
| Adding new CLI commands | `backend/src/app/cli.ts` and `backend/package.json` scripts |
| Changing GitHub Pages deploy / data cron | `.github/workflows/deploy.yml` |
| Changing pages / routes | `frontend/src/pages/` and `frontend/src/router.tsx` |
| Changing UI components | `frontend/src/components/` |
| Changing API client | `frontend/src/services/feeds.ts` |
| Changing types shared between frontend and backend concepts | `frontend/src/types/feed.ts` (backend has its own internal types in `db/index.ts`) |
| Changing styling / theme | `frontend/src/styles.css` and `frontend/src/themes/` |
| Updating the git scanner | `git-repo-scanner/main.go` |

## Security considerations

- The backend enables CORS for all origins (`app.use("/*", cors())`). If deployed publicly, restrict this to known origins.
- No authentication or authorization is implemented on API endpoints. The sync endpoints should not be exposed to untrusted users.
- `github.ts` uses `execFileSync` with argument arrays (not string interpolation) to prevent shell injection. The `username` parameter is validated against `/^[\w.-]{1,39}$/`.
- POST `/api/feeds/sync` validates request body with Zod schema before processing.
- All GET API routes have try/catch error handling and return structured JSON errors.
- The SQLite database path is controlled by the `DB_PATH` environment variable or defaults to `~/.innate/feeds.db`. Ensure the database file is not served or committed.
- Environment variables: `PORT` (backend port, default 4000), `DB_PATH` (SQLite path), `INNATE_HOME` (data directory, default `~/.innate`), `VITE_STATIC_MODE` (frontend static mode), `VITE_BASE_PATH` (base URL for GitHub Pages).

## Deployment notes

- CI: `.github/workflows/ci.yml` (test, typecheck, format, build). Pages: `.github/workflows/deploy.yml`.
- For production API mode: `bun run start` builds the frontend and serves it from the backend at `http://localhost:4000` (same origin as `/api`). Bind with `HOST` / `PORT` as needed.
- For GitHub Pages: daily cron runs `sync window` (90 days) then deploys `frontend/dist/`. Manual **Run workflow** can choose window / daily / skip. See `docs/data-update-workflow.md`.
- Dev still uses Vite on port 3000 with `/api` proxied to the backend.
