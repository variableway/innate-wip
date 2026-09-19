# Project instructions

This repository (`innate-spark`) is a personal **docs and product-index hub**. It holds notes, ideas, plans, and pointers. Product, infra, and collector **implementations live in sibling directories or separate repos** (spokes such as `innate-works/`, `innate-apps/`); this hub stays the index, never the implementation.

## Layout

| Path | Role |
| --- | --- |
| `README.md` | Hub overview and domain list (Infra / Product Center / Marketing / Feeds / Teaching) |
| `docs/inbox/` | Unsorted captures |
| `docs/idea/` | Cross-domain analysis (feasibility, doc structure, Cursor integration) |
| `docs/writing/` | Long-form how-tos |
| `product-center/catalog.md` | **Single source of truth** for the product list |
| `product-center/products/<slug>/` | Per-product idea / analysis / design / spec / log, plus `links.md` |
| `base/` | Shared base projects as git submodules: `innate-backend` + `innate-fe-base`. Configured via `hubScanDirs`; update with `clone` or `clone --registry tools/registry/base.yaml` |
| `tools/registry/` | Four data tables: `apps.yaml` (scan-synced) + `plugins.yaml` / `skills.yaml` / `deploy.yaml` (manual only) |
| `tools/fire-skills/` | The only code allowed in this repo: `skill-spark` multi-subcommand CLI (Bun, built to `tools/fire-skills/dist/`, gitignored). Legacy `tools/innate-registry-cli/` · `tools/innate-selfhost-cli/` are kept as reference only |
| `tools/pre-commit.sh` | Git hook: runs `registry scan` and stages `tools/registry/apps.yaml` |
| `.innate-registry-cli.yaml` | Scan/clone layout config — change paths here, never hardcode them in CLI source |

## Working rules

- Read `README.md` and `product-center/catalog.md` before adding or moving domain files.
- Put unsorted captures in `docs/inbox/`. Domain-ready ideas go to that domain’s `idea/`. Cross-domain analysis goes to `docs/idea/`.
- Record implementation locations only in each product’s `links.md`. If the task is to write code, do it in the implementation project (or ask to open / attach that folder). Do not add application source, lockfiles, or `node_modules` here — except `tools/fire-skills/` (including the legacy `tools/innate-registry-cli/`, `tools/innate-selfhost-cli/`), and shared base projects under `base/`.
- Add a product row to `product-center/catalog.md` before creating `product-center/products/<slug>/`. Product stages: `idea` → `design` → `spec` → `building` → `live` → `paused` → `retired`.
- Do not add nested `AGENTS.md` files. Put domain differences in `.cursor/rules/*.mdc` with `globs`.
- Docs are written mostly in Chinese; keep that convention. Link to a note instead of duplicating it.

## Commands

```bash
<<<<<<< HEAD
SPARK="bun tools/fire-skills/packages/skill-cli/src/index.ts"
=======
bun tools/innate-registry-cli/src/cli.ts scan        # sync tools/registry/apps.yaml (hub + innate-works + apps)
bun tools/innate-registry-cli/src/cli.ts clone       # clone/pull per apps.yaml (hub base via hubScanDirs / hubName)
bun tools/innate-registry-cli/src/cli.ts clone --registry tools/registry/base.yaml  # base only
bun tools/innate-registry-cli/src/cli.ts scan-refs   # → sibling innate-works/registry.yaml
bun tools/innate-registry-cli/src/cli.ts clone-refs
>>>>>>> 4070f9c (update registry)

$SPARK registry scan        # sync tools/registry/apps.yaml from innate-works + hub-hosted dirs
$SPARK registry clone       # clone per apps.yaml into innate-works
$SPARK registry scan-refs   # → sibling innate-works/registry.yaml
$SPARK registry clone-refs

$SPARK selfhost profiles --config tools/fire-skills/config.json   # list SMB hosts from config.json
$SPARK selfhost open --profile lazycat --config tools/fire-skills/config.json

# Test + build the single binary (→ tools/fire-skills/dist/skill-spark, gitignored)
cd tools/fire-skills && bun test && bun run build:all

# One-time: enable the pre-commit scan hook
ln -sf ../../tools/pre-commit.sh .git/hooks/pre-commit
```

## Registry contract

- `scan` is read → merge → write: directory contents are the source of truth for `name` / `repo` / `path` / `desc`; manual extension fields (`kind`, `template`, `templateVersion`, `deploy`, `publishes`) are preserved in place. `--regenerate` drops all extension fields — use it deliberately.
- Hub-internal repos are scanned via `<hubName>/...` entries in `scanDirs` (currently `innate-spark/base`, `innate-spark/projects`); their registry paths keep the `innate-spark/` prefix so `clone` restores them inside the hub. Nested reference clones inside product working copies (e.g. `reset-from-zero/tutorials/`) stay out — keep the default depth.
- Sibling `innate-works/registry.yaml` stays where it is; only `scan-refs` / `clone-refs` touch it.
- Secrets never go into files: `skill-spark selfhost` reads its password only from the `SELFHOST_CLI_PASSWORD` env var.
