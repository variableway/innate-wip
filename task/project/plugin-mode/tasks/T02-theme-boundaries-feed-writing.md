# T02: 主题边界 — feed↔writing 解耦 + 插件目录约定

- **REQ**: REQ-03
- **Status**: todo
- **Agent**: main
- **Depends**: none（与 T01 并行，建议后合避免 registry 冲突）

## Context pack

- system: yes
- requirement: yes
- interaction: no
- extra: []

## Goal

消除最明显的主题边界泄漏，并把"一个自包含主题长什么样"写成约定，让后续新主题照着做。

## Steps

1. **feed↔writing 渲染去重**：`app/feed/[slug]/page.tsx` 与 `app/writing/[slug]/page.tsx` 的 MDX 渲染管线近乎逐行重复。抽取共享的文章详情渲染（如 `components/content/article-page.tsx` 或扩展 `lib/content`），两个路由都调它。判断点：feed 定位是 writing 的另一种视图，共享 lib 数据层是设计内的（主题交互放数据层面），但渲染代码不应拷贝。
2. **shell 数据依赖显式化**：`app/layout.tsx` 直接 import writing 数据喂 command palette。改为由 registry/manifest 声明（如 `SitePlugin.searchData?: () => SearchEntry[]`，由 writing 插件提供），layout 只消费 registry。若成本高，最低要求是把 import 收敛到一个 `lib/plugins/search.ts`，layout 不再感知具体主题。
3. **写插件目录约定**：在 `docs/solution/plugin-mode.md` 增补一节（或新 doc）：`app/<theme>/` + `lib/<theme>/` + `components/<theme>/` + registry 条目；共享设施（server-markdown / remark-mermaid / @innate/ui）留在 shell 层。同时盘点每个现有主题与该约定的偏差，列成清单（不强制本任务内全部整改）。

## Verify

- [ ] `diff` 级别确认 feed 与 writing 的 slug 页不再各自持有重复的 MDX 管线
- [ ] `grep` 确认 `app/layout.tsx` 不再直接 import `lib/content`（或经 `lib/plugins/search.ts` 中转）
- [ ] 插件目录约定文档落地，含现有主题偏差清单
- [ ] `STATIC_EXPORT=true pnpm build` 通过，feed/writing 页面渲染不变
