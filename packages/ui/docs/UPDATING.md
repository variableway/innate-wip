# Updating `@innate/ui`

How to add new primitives, update installed ones, and upgrade the underlying Base UI / third-party libraries. The package is maintained through the shadcn CLI; this guide covers the post-CLI fixes the CLI doesn't do for you.

**TL;DR:**

| Goal | Command | Then |
|---|---|---|
| Add a primitive | `pnpm shadcn:add <name>` | Fix aliases → re-export → add demo |
| Update installed primitives | `pnpm shadcn:update` | Review `git diff`, commit |
| Preview upstream diffs | `pnpm shadcn:diff` | Decide whether to apply |
| Bump Base UI | edit `dependencies["@base-ui/react"]` then `pnpm typecheck` | Audit wrapper types; some primitives will break |
| Bump a peer lib (recharts, react-resizable-panels, …) | edit `dependencies.<name>` then `pnpm shadcn:update` | Re-verify each affected wrapper |

---

## 1. Add a new primitive

### Step 1 — Run the CLI

```bash
cd packages/ui
pnpm shadcn:add <name>
```

The CLI reads `components.json` (style `base-vega`, `tsx`, `tailwind.css: src/globals.css`) and writes a single file at `src/components/ui/<name>.tsx`. Common flags:

- `--overwrite` — overwrite an existing file (use only when intentionally refreshing)
- `--yes` — skip prompts (used by the bulk-update script)
- `--path src/components/ui` — explicit output directory (default already matches)

### Step 2 — Fix CLI-emitted aliases

shadcn writes imports based on a generic `@/` alias. We don't use that — fix any that slip in:

```tsx
// WRONG (CLI default)
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// RIGHT (our structure)
import { cn } from "../../lib/utils"
import { Button } from "./button"
```

Search the generated file for `@/` and `@/components`:

```bash
grep -n '@/\|@/components' src/components/ui/<name>.tsx
```

| Generated | Replace with |
|---|---|
| `@/lib/utils` | `../../lib/utils` |
| `@/components/ui/<other>` | `./<other>` |
| `@/hooks/...` | `../../hooks/...` (e.g. `../../hooks/use-mobile`) |

### Step 3 — Re-export from the barrel

```bash
echo 'export * from "./components/ui/<name>"' >> src/index.ts
```

Or edit `src/index.ts` directly to keep exports alphabetical by category.

### Step 4 — Add a demo on the showcase

Add a new file `apps/web-showcase/src/components/blocks/<name>-demo.tsx` following the existing pattern (use `button-demo.tsx` as the canonical template). Then register it in three places:

```bash
# 1. Add the entry to the registry
#    apps/web-showcase/src/app/components/routes.ts
#    → append a { slug, name, category, description, icon } record

# 2. Add to the dynamic route's block map
#    apps/web-showcase/src/app/components/[slug]/page.tsx
#    → import { <Name>Demo } from "@/components/blocks/<name>-demo"
#    → add `"<slug>": <Name>Demo` to blockBySlug
#    → the existing `missing` guard will throw at build time if you forget
```

### Step 5 — Verify

```bash
# At the repo root
pnpm typecheck                                  # 0 errors expected
pnpm --filter @innate/web-showcase build        # generates a static page for /components/<slug>
pnpm --filter @innate/web-showcase dev          # open http://localhost:4003/components/<slug>
```

---

## 2. Update installed primitives (bulk refresh)

```bash
cd packages/ui
pnpm shadcn:update
```

This loops `shadcn add <name> --overwrite --yes` over every file in `src/components/ui/`. The script lives at `scripts/update-shadcn.sh` and is intentionally dumb — it overwrites without diff review. **You must review the git diff before committing.**

```bash
git diff packages/ui/src
# Look for:
#   - changes you expected (token renames, new variants)
#   - changes you didn't expect (CSS rewrites that break the theme)
#   - imports the CLI emitted that need alias fixes (see §1.2)
```

### If a single component failed to update

The script prints `❌ Failed: <name>`. Common causes:

- The CLI recipe moved to a different name — try `pnpm dlx shadcn@latest docs <name>` and look for the new slug.
- The CLI recipe requires a dependency we don't have — check the failure message; if it lists a peer dep, add it to `package.json` and rerun.
- The recipe is gated behind the `base-vega` registry and we accidentally flipped `components.json` to a different style — restore `base-vega`.

---

## 3. Preview upstream diffs without applying

```bash
cd packages/ui
pnpm shadcn:diff
```

This is **read-only**. Use it to decide whether to schedule an update pass.

---

## 4. Upgrade `@base-ui/react`

Base UI is the underlying behavior primitive for most components in this package. Major upgrades frequently rename exports and re-shape prop APIs.

### Step 1 — Bump the pin

```bash
# packages/ui/package.json
"@base-ui/react": "^1.5.0"   # was ^1.4.1
```

```bash
pnpm install
```

### Step 2 — Type-check

```bash
pnpm typecheck
```

The first pass will surface every wrapper that broke. Common breakage patterns:

| Symptom | Likely cause |
|---|---|
| `Property 'X' does not exist on type …Root.Props` | Root renamed an export; update the wrapper |
| `Type 'A' is not assignable to type 'B'` | Prop type widened/narrowed; adjust wrapper or caller |
| `Cannot find module '@base-ui/react/<x>'` | Path moved; check Base UI changelog |

### Step 3 — Fix wrappers one at a time

Open the broken file in `src/components/ui/<name>.tsx`, find the import, and consult the Base UI docs:

```bash
pnpm dlx shadcn@latest docs <name>     # shadcn's API surface
```

If the rename is purely cosmetic (e.g., `Dialog → Modal`), it's fine to keep using the Base UI export and re-export it under our `<name>` — apps don't see the Base UI name.

### Step 4 — Verify demos

```bash
pnpm --filter @innate/web-showcase build
pnpm --filter @innate/web-showcase dev
```

Click through `/components/<name>` for every primitive that uses Base UI. Spot-check that:

- Trigger components still render (`<Button variant="outline">` opens the dropdown, etc.)
- `data-state` and `data-slot` attributes are present (devtools → Elements → search for `data-slot`)
- Keyboard navigation works (Tab into the trigger, Enter/Space to activate, Esc to close)

### Step 5 — Bump the showcase and any apps

If apps pin `@base-ui/react` directly (rare — they should only depend on `@innate/ui`), align them to the same version.

---

## 5. Upgrade a peer library that we wrap

Several components in this package wrap third-party libraries that have their own version cadence. When you bump one, the wrapper and **every demo that imports it directly** must move together.

### Affected libraries

| Library | Used by | Things to re-check |
|---|---|---|
| `react-resizable-panels` | `resizable.tsx` | v2 → v4 renamed `PanelGroup` → `Group`, `PanelResizeHandle` → `Separator`, `direction` → `orientation`. The wrapper throws a clear error if `Group` is undefined — see `src/components/ui/resizable.tsx`. |
| `recharts` | `chart.tsx` | v3 dropped `defaultProps` for chart elements; API for axis/legend components changed. |
| `react-day-picker` | `calendar.tsx` | v10 changed the `mode` API and removed the `captionLayout` shorthand. |
| `react-hook-form` | `form.tsx` | Major bumps rename the `control` types and `useFormContext` generics. |
| `vaul` | `drawer.tsx` | `Drawer.Root` API has been stable; minor bumps are safe. |
| `input-otp` | `input-otp.tsx` | Minor bumps are usually safe; check `Slot` typing. |
| `cmdk` | `command.tsx` | Major bumps change the command store API. |
| `sonner` | `sonner.tsx` | API is stable across minors. |

### Recipe

```bash
# 1. Bump in packages/ui/package.json
# 2. Bump in EVERY app that imports the library directly
#    grep -r "<library>" apps/*/package.json
# 3. Re-install
pnpm install
# 4. Type-check the package
pnpm typecheck
# 5. Build the showcase
pnpm --filter @innate/web-showcase build
# 6. Run the showcase, click through the affected component pages
pnpm --filter @innate/web-showcase dev
```

**If the showcase throws a version-mismatch error at build time** (e.g., `Group is not a function` for `react-resizable-panels`), the wrapper's runtime guard caught it. Either align the app's version or revert the bump.

---

## 6. Common pitfalls

### The CLI's emitted file has broken imports

Always run `grep -n '@/\|@/components' src/components/ui/<name>.tsx` after `shadcn add`. The CLI's generic template assumes a `tsconfig.json` paths alias; we don't have one in this package.

### `shadcn add` for a component that already exists

The CLI refuses by default. Pass `--overwrite` if you really mean to replace the file (e.g., after a major upstream redesign). Otherwise the new content is silently dropped.

### Style drift between `components.json` and the installed components

If `components.json` style is `base-nova` but the installed wrappers are Base UI-based, `shadcn add` will fetch a Radix recipe and your new component will look and behave differently from its siblings. Fix:

```json
// components.json
{
  "style": "base-vega"
}
```

### Generated file uses a different icon library

Confirm `components.json` has `"iconLibrary": "lucide"`. If shadcn defaulted to `radix` or `phosphor`, generated components will import icons that don't exist in our bundle.

### The package builds but a consuming app fails

Almost always a peer-lib version mismatch. Run `pnpm why <library>` at the monorepo root to see which copies are installed where.

```bash
pnpm why react-resizable-panels
# Should show exactly one version. If you see two (e.g. 2.1.9 AND 4.11.2), one is wrong.
```

---

## 7. Pre-commit checklist

Before merging a `pnpm shadcn:add` / `pnpm shadcn:update` PR:

- [ ] `pnpm typecheck` is 0
- [ ] `pnpm --filter @innate/web-showcase build` succeeds
- [ ] Manually click through affected `/components/<slug>` pages in dev mode
- [ ] `git diff` shows no unintended CSS rewrites (theme tokens unchanged)
- [ ] `pnpm why` shows exactly one copy of each peer lib (no accidental duplicates)
- [ ] `COMPONENT_CATALOG.md` updated if a new export was added
- [ ] `apps/web-showcase/src/app/components/routes.ts` updated if a new export was added
- [ ] Demo block added under `apps/web-showcase/src/components/blocks/<name>-demo.tsx`

---

## 8. Reference

- shadcn CLI: <https://ui.shadcn.com/docs/cli>
- shadcn docs for a component: `pnpm dlx shadcn@latest docs <name>`
- Base UI docs: <https://base-ui.com/react/components/accordion>
- This package's recipes: [`PRIMITIVES_POLICY.md`](../PRIMITIVES_POLICY.md) · [`COMPONENT_CATALOG.md`](../COMPONENT_CATALOG.md) · [`README.md`](../README.md)