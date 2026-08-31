# System Context: Refine（blog + plugin 验证落地）

仓库 / 产品级——本包所有 Agent 必读。

> 基础复用 `task/project/plugin-mode/context/system.md`（先读它，含硬约束与关键代码位置），本文件只补 refine 相关增量。

## 本包关键代码位置

- `apps/web/lib/site-features.ts` — feature flags；当前 `content` 由 layout 消费，`making`/`cheatsheets`/`awesome` 由 registry 消费，`feed`/`betterstackGuides` 无消费方（本包 T01 处理）
- `apps/web/lib/plugins/{types,registry,icons}.ts` — manifest 与注册表；registry 以 `@/` 别名 import site-features
- `apps/web/scripts/` — 现有数据同步脚本目录（verify-plugins.mjs 将新增于此）
- `.github/workflows/deploy-pages.yml` / `deploy-cloudflare.yml` — 构建部署入口（`build:static`；composite action `./.github/actions/setup-workspace` 可复用）
- `apps/web/content/writing/*.md(x)` — blog 内容源（frontmatter 契约见 `apps/web/lib/content/types.ts` 的 PostMeta）

## 硬约束（增量）

- 脚本不得依赖 dev server 或网络；可在 CI 干净环境重复执行
- 新 workflow 不引入新 secret
- 文档产出落 `docs/`，不落 `apps/web/`

## Canonical docs

- 仓库根 `AGENTS.md` / `CLAUDE.md`
- `docs/solution/README.md`（索引）
