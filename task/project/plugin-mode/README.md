# Plugin 模式实验（Task 2）

- **Status**: active
- **Owner**: patrick
- **Created**: 2026-08-19
- **Source**: `task/project/project-overview.md` → Task 2

## 一句话结论

不引入 Micro-Frontend 框架（调研：`docs/solution/micro-frontend-research.md`）。
Plugin 模式 = App Shell + build-time Registry（`lib/plugins/`，P0–P1 已落地）+ route/iframe 两种 loadMode。
剩余工作 = 把 writing/collections/feed 迁入 registry、理清主题边界、补 iframe 宿主。

## Documents

| Stage | File |
|-------|------|
| Content | `task/project/project-overview.md` → Task 2（原始需求） |
| Spec | [spec.md](./spec.md) |
| Requirements | [requirements.md](./requirements.md) |
| Research | `docs/solution/micro-frontend-research.md` |
| Solution base | `docs/solution/plugin-mode.md`（P0–P1 已实现） |

## Context pack

| Layer | File |
|-------|------|
| System | [context/system.md](./context/system.md) |

## Tasks

| ID | File | Status | Agent | Depends |
|----|------|--------|-------|---------|
| T01 | [tasks/T01-unify-registry-content-themes.md](./tasks/T01-unify-registry-content-themes.md) | todo | main | none |
| T02 | [tasks/T02-theme-boundaries-feed-writing.md](./tasks/T02-theme-boundaries-feed-writing.md) | todo | main | none |
| T03 | [tasks/T03-content-package-betterstack.md](./tasks/T03-content-package-betterstack.md) | todo | main | none |
| T04 | [tasks/T04-iframe-host-route.md](./tasks/T04-iframe-host-route.md) | todo | main | T01 |
| T05 | [tasks/T05-verify-and-docs.md](./tasks/T05-verify-and-docs.md) | todo | main | T01–T04 |

## Notes

- 调研盘点（7 个主题的现状、耦合点、共享层）见本 README 下方 "现状盘点摘要"。
- 遵循 `docs/solution/task-docs-workflow.md`；完成后更新 `task/project/project-overview.md` 的 Task 2 状态。

## 现状盘点摘要（2026-08-19）

7 个顶级主题，全部 async Server Component + build-time 渲染，交互下沉到 `components/<theme>/*-client.tsx`：

| 主题 | 路由 | 规模 | 数据来源 | Registry |
|------|------|------|----------|----------|
| writing | `app/writing/`（含 `[slug]`） | ~188 行 + 3 个 client 组件 | `lib/content/` 读 `content/writing/*.md(x)` | ❌ 硬编码 |
| collections | `app/collections/` | 24 行 + viewer（iframe 先例） | `data/collections.json` | ❌ 硬编码 |
| feed | `app/feed/`（含 `[slug]`） | 242 行 | **复用 writing 的 `lib/content`** | ❌ 硬编码 |
| making | `app/making/`（两级动态路由） | ~1652 行，最大 | `data/{issues,weekly,projects,insights}.json` | ✅ |
| cheatsheets | `app/cheatsheets/`（含 `[slug]`） | 64 行 | `content/cheatsheets/`（~300 篇） | ✅ |
| betterstack-guides | `app/betterstack-guides/`（两级） | 246 行 | **跨包 fs 读** `packages/betterstack-guides/` | ✅（挂在 cheatsheets section 下） |
| awesome | `app/awesome/`（含 `[category]`） | 170 行 | `content/awesome/*.json` | ✅ |

主要耦合点：

1. sidebar 混合模式：writing/collections/feed 硬编码在 `components/sidebar.tsx:140-208`，其余走 registry。
2. feed↔writing：`feed/[slug]/page.tsx` 与 `writing/[slug]/page.tsx` 渲染管线近乎逐行重复，共享同一份数据。
3. `app/layout.tsx` 直接 import writing 数据喂 command palette（shell 对主题的硬依赖）。
4. `lib/betterstack/data.ts` 用 `../../packages/betterstack-guides/guides` 相对路径跨包读文件，未走包 export。
