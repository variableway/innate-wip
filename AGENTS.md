# AI Agent Context

This file provides context for AI assistants working with this codebase.

## Project Overview

**Innate** is a personal website and project tracking platform. It aggregates GitHub Issues, project documentation, and generates weekly progress summaries with AI analysis.

### What this website does:
1. **Displays GitHub Issues** from multiple repositories in a unified interface
2. **Shows Project Documentation** (AGENTS.md) with markdown rendering
3. **Tracks Weekly Progress** with AI-generated summaries and evaluations
4. **Provides a Knowledge Base** for tutorials and learning resources
5. **Cheatsheets** - 300+ quick reference guides for developer tools and frameworks
6. **Collections** - Ideas and experiments from AI agents
7. **Writing** - Blog platform with RSS feed support

### Data Sources:
- **GitHub API** - Fetches issues, projects, and metadata
- **AGENTS.md files** - Project documentation from repositories
- **Weekly Data** - Generated summaries stored in JSON files

## Architecture

### Monorepo Structure
```
innate-websites/
├── apps/
│   └── web/                    # Main Next.js application
│       ├── app/making/         # Core features
│       │   ├── issues/         # GitHub issues browser
│       │   ├── projects/       # Project showcase
│       │   └── weekly/         # Weekly summaries
│       ├── app/cheatsheets/    # Quick reference guides
│       ├── app/collections/    # AI agent collections
│       ├── app/writing/        # Blog posts
│       ├── app/tutorials/      # Quick tutorials
│       ├── app/feed/           # Content discovery feed
│       ├── data/               # JSON data files
│       │   ├── issues.json     # GitHub issues data
│       │   ├── projects.json   # Project analysis
│       │   └── weekly.json     # Weekly summaries
│       ├── components/         # React components
│       │   ├── making/         # Feature-specific components
│       │   ├── cheatsheets/    # Cheatsheet components
│       │   ├── collections/    # Collection components
│       │   ├── markdown-renderer.tsx
│       │   └── server-markdown.tsx
│       ├── lib/making/         # Data layer
│       │   ├── data.ts         # Static data imports
│       │   ├── types.ts        # TypeScript types
│       │   └── server-data.ts  # Server-side data loading
│       ├── lib/cheatsheets/    # Cheatsheet data layer
│       │   ├── data.ts         # Markdown file parsing
│       │   └── types.ts        # Cheatsheet types
│       └── scripts/            # Data fetching scripts
│           ├── fetch-issues.js
│           ├── fetch-agents.js
│           └── generate-weekly.js
├── packages/
│   ├── task-watcher/           # CLI tool for task syncing
│   └── betterstack-guides/     # Guides content package
└── .github/workflows/          # CI/CD workflows
```

> `packages/{ui,utils,tsconfig}` 不在本仓库内——见下方 "Shared Packages"。

### Key Technologies
- **React 19** with **Next.js 16**
- **TypeScript 6**
- **pnpm** workspaces
- **Tailwind CSS** for styling
- **Base UI** (`@base-ui/react`) for accessible components
- **unified/remark** for markdown processing

### Shared Packages (symlink from innate-fe-base)

`@innate/ui` 和 `@innate/tsconfig` 不在本仓库内。`scripts/link-shared-packages.sh`
把它们软链到 `packages/ui`、`packages/tsconfig`，web 仍用 `workspace:*`。

- **本地**：默认指向 `innate-works/base/innate-fe-base`（可用 `INNATE_FE_BASE` 覆盖）
  ```bash
  pnpm link:packages   # 或 ./scripts/link-shared-packages.sh
  pnpm install
  ```
- **不必**把本仓库放到 innate-base / innate-fe-base 的 `apps/` 下面。
- **CI / Pages**：workflow 稀疏检出私有仓库 `variableway/innate-fe-templates`，
  再跑同一个脚本。CI 下是 **copy**（不是 symlink），避免 Next 解析到仓库外。
  需要 Secrets 中的 `INNATE_BASE_TOKEN`。
- 链接目录已 gitignore，不要提交。

## Important Patterns

### Data Flow
1. **Static Data** - JSON files are imported directly for static export
2. **Build-time Rendering** - ServerMarkdown component renders markdown at build time
3. **Client Hydration** - Interactive components use client-side rendering

### Markdown Rendering
Two approaches are used:

1. **ServerMarkdown** (`components/server-markdown.tsx`)
   - Server component that renders markdown to HTML at build time
   - Used for issue descriptions and project documentation
   - Applies custom CSS styles via `markdown-content` class

2. **MarkdownRenderer** (`components/markdown-renderer.tsx`)
   - Client component for dynamic content
   - Supports mermaid diagrams (if available)

### Data Types

#### Issue
```typescript
interface Issue {
  id: string
  number: number
  title: string
  description: string  // Markdown content
  status: 'open' | 'closed'
  project: string
  labels: IssueLabel[]
  createdAt: string
  updatedAt: string
  closedAt?: string
  url?: string
  author?: string
}
```

#### Project Analysis
```typescript
interface ProjectAnalysis {
  id: string
  name: string
  description?: string
  hasAgents: boolean
  summary: string
  features: string[]
  strengths: string[]
  weaknesses: string[]
  rawContent?: string  // AGENTS.md content
}
```

#### Weekly Summary
```typescript
interface WeeklySummary {
  id: string
  weekNumber: number
  year: number
  title: string
  titleZh?: string
  dateRange: { start: string; end: string }
  summary: string
  summaryZh?: string
  completedIssues: string[]  // Issue IDs
  evaluations: {
    strengths: BilingualText[]
    weaknesses: BilingualText[]
    improvements: BilingualText[]
  }
  mindsetAnalysis: {
    strengths: BilingualText[]
    weaknesses: BilingualText[]
    suggestions: BilingualText[]
  }
}
```

## Common Tasks

### Adding a New UI Component
UI components are maintained in innate-fe-base (`packages/ui`), not here:
1. Add the component in `innate-fe-base/packages/ui/src/components/ui/`
2. Use Base UI primitives (no `asChild` — use the `render` prop instead)
3. Export from `innate-fe-base/packages/ui/src/index.ts`
4. 本仓库通过 `packages/ui` 软链引用，`pnpm link:packages` 后即可生效

### Fetching Fresh Data
```bash
cd apps/web
node scripts/fetch-issues.js    # Update issues.json
node scripts/fetch-agents.js    # Update projects.json
node scripts/generate-weekly.js # Update weekly.json
```

### Building for Production
```bash
cd apps/web
STATIC_EXPORT=true pnpm build
# Output: apps/web/dist/
```

### GitHub Pages Deployment
1. Push to main branch
2. GitHub Actions workflow runs automatically
3. Ensure Pages is enabled in repository settings

## Component Library Details

### Available Categories
- **Forms**: Button, Input, Textarea, Select, Checkbox, Radio, Switch, Slider
- **Layout**: Card, Dialog, Sheet, Sidebar, Tabs, Accordion, Collapsible
- **Navigation**: Breadcrumb, NavigationMenu, Pagination, Menubar
- **Data Display**: Table, Badge, Avatar, Progress, Skeleton, Chart
- **Feedback**: Alert, Toast, Sonner, Spinner, Empty
- **Overlay**: Popover, Tooltip, HoverCard, DropdownMenu, ContextMenu

### Styling Approach
- Tailwind CSS utility classes
- Dark mode support via `dark:` modifiers
- Custom markdown styles in `globals.css`

## Notes

- **Static Export**: Site is built as static HTML for GitHub Pages
- **Server Components**: Used for markdown rendering at build time
- **Client Components**: Used for interactive features (navigation, filters)
- **Data Storage**: JSON files committed to repository
- **Bilingual Support**: Weekly summaries support Chinese and English

#### Cheatsheet
```typescript
interface CheatsheetMeta {
  slug: string
  title: string
  category: string
  tags: string[]
  keywords: string[]
  updated: string | null
  weight: number
  intro: string | null
  description: string
}

interface Cheatsheet extends CheatsheetMeta {
  content: string
}
```

## AI Agent Guidelines

### WriteAgent Skill

本项目使用 `.trae/skills/write-agent/` 来维护文档更新。在以下情况时必须更新文档：

1. **完成 Task 后** - 标记任务为完成状态，添加完成摘要
2. **修改架构后** - 更新 AGENTS.md 中的架构说明
3. **新增组件/模块** - 添加到组件列表，更新接口定义
4. **修改配置后** - 更新配置说明和示例

**文档更新原则**:
- 及时更新：将文档更新视为任务的一部分
- 精确描述：准确描述实现的内容
- 保持结构：遵循现有文档的格式和风格
- 版本追踪：记录重要的变更历史

## Dependencies of Note

- `@base-ui/react` - Accessible UI primitives
- `lucide-react` - Icon library
- `unified` + `remark-parse` + `remark-gfm` - Markdown processing
- `rehype-highlight` - Code syntax highlighting
- `next-themes` - Theme management
- `recharts` - Chart library
