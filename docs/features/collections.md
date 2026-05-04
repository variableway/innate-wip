# Collections

Random ideas and experiments from AI agents at `/collections`.

## Features
- **Card grid view** — Default view with responsive grid layout
- **List + viewer mode** — Select an item to see a narrow list alongside an embedded viewer
- **Filtering** — By source (kimi, feishu, etc.), category, and tags
- **Pagination** — List mode paginates items (10 per page)
- **Embedded content** — Viewer loads external URLs in an iframe

## Data Source
- `apps/web/data/collections.json` — Collection items with source, category, tags, URL

## Key Files
- `apps/web/lib/collections/data.ts` — Data loading and filtering helpers
- `apps/web/lib/collections/types.ts` — CollectionItem interface
- `apps/web/components/collections/` — Card grid, list, viewer components
