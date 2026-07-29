# System context

Repo / product level — read by **all** agents.

## Product

Innate: personal site for AI learning notes (Writing), ideas (Collections), feed discovery; Making and reference libs are optional **plugins**.

## Layout

- `apps/web` — Next.js 16 app (static export capable)
- `lib/site-features.ts` — feature flags
- `lib/plugins/` — plugin registry driving sidebar/header
- `task/` — docs-driven development
- `docs/solution/` — cross-cutting solution docs

## Constraints

- Prefer Content-first UI
- Do not dual-hardcode nav; use plugin registry for optional modules
- `@innate/ui` via workspace; Base UI `render` prop (no `asChild`)
- Do not commit secrets; do not commit unless asked

## Canonical docs

- `AGENTS.md`, `CLAUDE.md` at repo root
- `docs/solution/README.md`
