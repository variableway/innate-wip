# `@innate/ui`

Shared component library for the **innate-templates** monorepo. A single source of truth for shadcn/ui primitives — apps depend on this package, they do not duplicate primitives locally.

- **Style preset**: `base-vega` (shadcn/ui)
- **Behavior primitive**: [`@base-ui/react`](https://base-ui.com) v1.x — accessible, unstyled, composable
- **Styling**: Tailwind CSS v4 + CSS variables (OKLCH palette in `src/globals.css`)
- **Icons**: `lucide-react` (shadcn convention)
- **Package type**: `private: true` — internal to the monorepo only

---

## Quick start

```bash
# From the monorepo root — installs @innate/ui into every workspace app.
pnpm install

# Use a primitive in any app
pnpm --filter @innate/admin-nextjs-demo dev
```

```tsx
// app/page.tsx
import { Button, Card, CardContent, CardHeader, CardTitle, cn } from "@innate/ui"

export default function Page() {
  return (
    <Card className={cn("max-w-md p-6")}>
      <CardHeader>
        <CardTitle>Hello</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Get started</Button>
      </CardContent>
    </Card>
  )
}
```

Nearly every primitive (all except `theme-provider`) exports a named `<Slot>Demo` companion in `apps/web-showcase/src/components/blocks/` — open `http://localhost:4003/components/<slug>` after running `pnpm --filter @innate/web-showcase dev` to see live variants, sizes, and slot contracts.

---

## Architecture

```
@innate/ui (packages/ui)
├── src/
│   ├── components/ui/<name>.tsx     ← one file per primitive (shadcn convention)
│   ├── hooks/use-mobile.ts          ← `useIsMobile()` hook
│   ├── lib/utils.ts                 ← `cn()` (clsx + tailwind-merge)
│   ├── themes/                      ← theme presets imported by `globals.css` (shadcn-default, linear, notion, shadcn-studio)
│   ├── globals.css                  ← CSS variables + base layers
│   └── index.ts                     ← barrel — only file apps import
├── scripts/update-shadcn.sh         ← loops shadcn add over installed components
├── components.json                  ← shadcn CLI config (style, aliases, tailwind)
├── docs/UPDATING.md                 ← how to add / update / upgrade
├── COMPONENT_CATALOG.md             ← export index grouped by category
└── PRIMITIVES_POLICY.md             ← "one source of truth" rules for the monorepo
```

Apps consume `@innate/ui` as a workspace dependency and re-use the same primitives. The `Sidebar`, `SidebarProvider`, `useIsMobile()`, and theme tokens are **the same code** across `admin-nextjs`, `admin-tanstack`, and `web-showcase`.

---

## Coverage: `@innate/ui` vs `@base-ui/react`

`@innate/ui` is **shadcn/ui-style, not a 1:1 Base UI re-export**. Of Base UI's 37 component primitives, 30 are wrapped. Where shadcn's UX doesn't match Base UI 1.x, we substitute a third-party library and document the swap.

### Wrapped Base UI primitives (30)

accordion · alert-dialog · avatar · badge · breadcrumb · button · checkbox · collapsible · context-menu · dialog · direction-provider · input · menu (→ DropdownMenu) · menubar · navigation-menu · popover · preview-card (→ HoverCard) · progress · radio-group · scroll-area · select · separator · sheet · sidebar · slider · switch · tabs · toggle · toggle-group · tooltip

### Implemented differently (not Base UI primitives)

| shadcn component | Built on | Why not Base UI |
|---|---|---|
| `Avatar` | Radix-style (`<AvatarImage>` + `<AvatarFallback>`) | Base UI's Avatar is a different API |
| `Drawer` | `vaul` | shadcn ships vaul for drawer UX |
| `InputOTP` | `input-otp` | Base UI's `otp-field` has a different shape |
| `Resizable` | `react-resizable-panels` v4 | Not a Base UI primitive |
| `Sonner` / toast | `sonner` | shadcn ships sonner for toasts |
| `Form` | `react-hook-form` | Base UI's `form` is the field context, not RHF |
| `Calendar` | `react-day-picker` v10 | Date picker UX |
| `Chart` | `recharts` v3 | Visualization |

### Not yet wrapped (intentional gap)

If you need any of these, see [`docs/UPDATING.md`](./docs/UPDATING.md) — `pnpm shadcn:add <name>` will fetch a Base UI recipe for most of them.

`autocomplete` · `checkbox-group` · `combobox` · `fieldset` · `meter` · `number-field` · `toolbar`

### Non-Base UI shadcn additions (no Base UI counterpart)

`aspect-ratio` · `badge` · `breadcrumb` · `card` · `command` · `empty` · `item` · `kbd` · `label` · `pagination` · `sidebar` · `skeleton` · `spinner` · `table` · `textarea`

---

## Common tasks

| Task | Command |
|---|---|
| Add one new primitive | `pnpm shadcn:add <name>` (in `packages/ui`) |
| Update all installed primitives | `pnpm shadcn:update` |
| See upstream diffs | `pnpm shadcn:diff` |
| Open shadcn docs for one primitive | `pnpm dlx shadcn@latest docs <name>` |
| Type-check the package | `pnpm typecheck` |
| Lint | `pnpm lint` |

> **Full recipes (post-CLI fixes, alias quirks, version alignment, Base UI upgrade)** — see [`docs/UPDATING.md`](./docs/UPDATING.md).

---

## Constraints apps must respect

### 1. Don't duplicate primitives

Apps in the monorepo **must not** add their own `components/ui/<name>.tsx`. If `@innate/ui` is missing a primitive you need, add it to the package — see [`PRIMITIVES_POLICY.md`](./PRIMITIVES_POLICY.md).

### 2. Align peer-library versions

`@innate/ui` wraps several libraries internally. If your app imports them **directly** (e.g., `recharts`, `react-day-picker`, `react-resizable-panels`, `vaul`, `input-otp`, `react-hook-form`), pin to the same version as `@innate/ui/package.json` or you'll get two installed copies and a runtime/typecheck mismatch.

| Library | Version @innate/ui pins | Why it matters |
|---|---|---|
| `@base-ui/react` | `^1.4.1` | All behavior primitives |
| `react-resizable-panels` | `^4.10.0` | `Group` export renamed in v4 (was `PanelGroup` in v2) |
| `react-day-picker` | `10.0.1` | v10 has breaking API changes |
| `react-hook-form` | `^7.72.0` | `Form` wrapper |
| `recharts` | `3.8.0` | `Chart` wrapper |
| `vaul` | `^1.1.2` | `Drawer` |
| `input-otp` | `1.4.2` | `InputOTP` |
| `cmdk` | `1.1.1` | `Command` |
| `sonner` | `^2.0.7` | `Sonner` (toast) |

### 3. Import the CSS

Apps must import `@innate/ui/globals.css` in their root layout for CSS variables and Tailwind base layers to apply. (Apps that already import `@innate/ui` from a component don't need to do anything extra — the side-effect-free barrel doesn't include the CSS.)

```tsx
// apps/<name>/src/app/layout.tsx
import "@innate/ui/globals.css"
```

### 4. React 19

`react` and `react-dom` are peer dependencies. `^19` is required.

### 5. Use semantic tokens

Style with `bg-primary`, `text-muted-foreground`, `border-ring`, etc. — **not** raw `bg-blue-500`. The tokens are defined in `src/globals.css` and flip automatically via the `ThemeProvider`'s `class` strategy (`<html class="dark">`).

---

## Adding a primitive — short form

```bash
# 1. Run the CLI inside this package
pnpm shadcn:add <name>

# 2. Inspect the generated file in src/components/ui/<name>.tsx.
#    shadcn sometimes emits "@/lib/utils" or "@/components/ui/..." aliases
#    that don't match our structure. Fix them:
#      "@/lib/utils"              → "../../lib/utils"
#      "@/components/ui/<other>"  → "./<other>"

# 3. Re-export from src/index.ts
echo 'export * from "./components/ui/<name>"' >> src/index.ts

# 4. Add a demo at apps/web-showcase/src/components/blocks/<name>-demo.tsx
#    + register in apps/web-showcase/src/app/components/routes.ts
#    + import into apps/web-showcase/src/app/components/[slug]/page.tsx

# 5. Run pnpm typecheck at the workspace root, then pnpm --filter @innate/web-showcase build
```

Full guide: [`docs/UPDATING.md`](./docs/UPDATING.md).

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `Property 'X' does not exist on type 'IntrinsicAttributes & …'` | App installed a different major version of a peer lib (`recharts`, `react-day-picker`, `react-resizable-panels`) than `@innate/ui` pinned | Align your app's `package.json` to `@innate/ui/package.json` and re-run `pnpm install` |
| `Group is not a function` at runtime | You pinned `react-resizable-panels` to v2.x; `@innate/ui` requires v4 | Bump to `^4.10.0` |
| Component renders unstyled | Missing `globals.css` import | Add `import "@innate/ui/globals.css"` to the root layout |
| `cn is not exported` | App imports from a deep path instead of the barrel | Import from `"@innate/ui"`, not `"@innate/ui/lib/utils"` |
| Hydration warning on `<html class="dark">` | Missing `suppressHydrationWarning` on `<html>` | Already wired in the showcase; copy the pattern |
| New primitive from `shadcn add` uses different icon library | shadcn pulls from `lucide` by default; confirm `components.json` has `"iconLibrary": "lucide"` | Yes — confirmed |

---

## See also

- [`docs/UPDATING.md`](./docs/UPDATING.md) — add, update, and upgrade recipes
- [`COMPONENT_CATALOG.md`](./COMPONENT_CATALOG.md) — what's exported, grouped by category
- [`PRIMITIVES_POLICY.md`](./PRIMITIVES_POLICY.md) — "one source of truth" rules
- `apps/web-showcase/` — live preview of every primitive at `http://localhost:4003`