# @innate/ui — Component Catalog (L1 Primitives)

**Scope:** shadcn/ui primitives exported from `@innate/ui`.  
**Not in scope:** business components, scene views, `DataTable` composites — see `packages/scene-specs/` and app `components/`.

**Source of truth:** `packages/ui/src/index.ts` (regenerate this table when exports change). The export groups below should always match the barrel file.

## Usage

```tsx
import { Button, Card, cn } from '@innate/ui'
```

**CLI docs** (API, examples):

```bash
pnpm dlx shadcn@latest docs button
pnpm dlx shadcn@latest info
```

**Maintenance:** `pnpm --filter @innate/ui shadcn:update` — review diff before merging into `src/components/ui/`.

**Add / update recipes:** [`docs/UPDATING.md`](./docs/UPDATING.md).

**Policy:** see [PRIMITIVES_POLICY.md](./PRIMITIVES_POLICY.md).

## Boundaries

| Do | Don't |
|----|--------|
| Use primitives for buttons, inputs, tables, dialogs | Put business logic or API calls inside `packages/ui` |
| Extend via wrapper components in app `components/` | Copy primitives into app `components/ui` when `@innate/ui` is already a dependency |
| Use semantic tokens (`bg-primary`, `text-muted-foreground`) | Override primitive colors with raw `bg-blue-500` in feature code |
| Pin third-party libs (`recharts`, `react-day-picker`, `react-resizable-panels`) to `@innate/ui/package.json` versions | Install a different major and end up with two copies in `pnpm why` |

## Apps vs package

| App | Primitives source |
|-----|-------------------|
| `admin-nextjs` | **`@innate/ui`** (preferred) |
| `admin-tanstack` | **`@innate/ui`** (exclusive — no local `components/ui/`) |
| `admin-ui` | Local `components/ui/` (`base-nova`; frozen backup — do not modify) |
| `web-showcase` | **`@innate/ui`** — the live preview app at `http://localhost:4003` |

---

## Export index

### Utilities

| Export | Purpose |
|--------|---------|
| `cn` | Merge Tailwind classes (`lib/utils`) |
| `useIsMobile` | Reactive mobile-viewport boolean (`hooks/use-mobile`) |

### Theming

| Export | Use when |
|--------|----------|
| `ThemeProvider` | Provide app-level color mode (`light`/`dark`/`system`) and theme variant state |
| `useTheme` | Read and update `colorMode` / `variant` from any client component |
| `ThemeVariant` | Type-safe theme variant values (for selectors and editor UI) |

### Layout & structure

| Export | Use when |
|--------|----------|
| `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` | Grouped content blocks |
| `Separator` | Visual dividers |
| `ResizablePanelGroup`, `ResizablePanel`, `ResizableHandle` | Split panes |
| `ScrollArea` | Constrained scroll regions |
| `Sidebar`, `SidebarProvider`, `SidebarInset`, … | App shell navigation |
| `AspectRatio` | Fixed aspect media |

### Navigation

| Export | Use when |
|--------|----------|
| `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` | Section switching |
| `Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, … | Hierarchy trail |
| `Pagination` | Paginated lists |
| `Menubar` | Menu bar patterns |
| `NavigationMenu` | Mega-menu style nav |

### Forms & input

| Export | Use when |
|--------|----------|
| `Button`, `ButtonGroup` | Actions (icons: `data-icon` on lucide children) |
| `Input`, `Textarea` | Text fields |
| `InputGroup`, `InputOTP` | Grouped or OTP inputs |
| `Select`, `Checkbox`, `RadioGroup`, `Switch`, `Slider` | Choice controls |
| `Calendar` | Date picking |
| `Form`, `Field`, `Label` | react-hook-form + zod layouts |
| `Toggle`, `ToggleGroup` | Binary / multi toggle |

### Feedback & overlay

| Export | Use when |
|--------|----------|
| `Dialog`, `AlertDialog` | Modal confirmation / forms |
| `Sheet`, `Drawer` | Side panels |
| `Popover`, `HoverCard`, `Tooltip` | Contextual overlays |
| `Toaster` / `toast()` via `sonner` | Transient feedback |
| `Alert` | Inline alerts |
| `Progress`, `Spinner`, `Skeleton` | Loading states |
| `Empty` | Empty state placeholder |

### Data display

| Export | Use when |
|--------|----------|
| `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableCell`, … | Tabular data (pair with app-level `DataTable` for sorting/filtering) |
| `Badge` | Status chips |
| `Avatar` | User / entity avatar |
| `ChartContainer`, `ChartTooltip`, `ChartTooltipContent`, `ChartLegend`, `ChartLegendContent`, `ChartStyle` (+ `ChartConfig` type) | Recharts wrappers |
| `Carousel` | Carousel content |
| `Item` | List item primitive |
| `Kbd` | Keyboard hint |

### Menus & commands

| Export | Use when |
|--------|----------|
| `DropdownMenu` | Action menus |
| `ContextMenu` | Right-click menus |
| `Command` | Command palette lists |
| `Collapsible` | Expand/collapse sections |
| `Accordion` | Stacked collapsible sections |
| `DirectionProvider`, `useDirection` | RTL/LTR provider |

---

## Common compositions (not separate exports)

| UI need | Compose with |
|---------|----------------|
| Page header + actions | `Card` or layout + `Button` |
| Filter bar | `Input` + `Select` + `Button variant="outline"` |
| Confirm delete | `AlertDialog` |
| Settings form | `Form` + `Field` + `Switch` / `Checkbox` |
| Dashboard KPI row | `Card` grid or app `SectionCards` (L2) |

---

## Related docs

- [README.md](./README.md) — package overview, coverage matrix, peer-dep alignment, troubleshooting
- [docs/UPDATING.md](./docs/UPDATING.md) — add / update / upgrade recipes
- [PRIMITIVES_POLICY.md](./PRIMITIVES_POLICY.md) — "one source of truth" rules for the monorepo
- Theme presets: `src/themes/` and imports in `src/globals.css`
- Agent skill (D0, archived): `packages/skills-kit/skills-archive/innate-design-system/SKILL.md`
- Agent skill (L1, archived): `packages/skills-kit/skills-archive/innate-ui/SKILL.md`
- Scenario → component map (archived): `packages/skills-kit/skills-archive/ui-scenarios/SKILL.md`
- L2 composites: `docs/achieve/composites/README.md` · skill (archived): `packages/skills-kit/skills-archive/innate-composites/SKILL.md`
- L3 scene specs: `packages/scene-specs/` · skill (archived): `packages/skills-kit/skills-archive/scene-catalog-dev/SKILL.md`
- Monorepo agent context: `/AGENTS.md`
