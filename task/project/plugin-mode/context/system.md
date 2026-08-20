# System Context: Plugin 模式实验

优先阅读：

1. 仓库根 `AGENTS.md` — 架构、数据流、构建与部署约定
2. `docs/solution/plugin-mode.md` — Plugin 设计方案（P0–P1 已实现，含 manifest 类型与 P2–P4 路线）
3. `docs/solution/micro-frontend-research.md` — MFE 框架调研与"不引入框架"的决策
4. `task/project/plugin-mode/README.md` — 现状盘点摘要（7 主题、耦合点、registry 覆盖情况）

关键代码位置：

- `apps/web/lib/plugins/{types,registry}.ts` — manifest 与注册表
- `apps/web/lib/site-features.ts` — feature flags（enabled 的开关源）
- `apps/web/components/sidebar.tsx`、`header.tsx`、`app-shell.tsx` — shell 渲染方
- `apps/web/components/plugins/plugin-iframe-view.tsx` — iframe 宿主 UI（P3 路由未做）
- `apps/web/app/layout.tsx` — 目前直接 import writing 数据喂 command palette
- `apps/web/next.config.mjs` — `output: 'export'`，registry 必须是 build-time

硬约束：

- 静态导出（GitHub Pages），无 rewrites/headers，动态路由必须有 `generateStaticParams`
- 共享包 `@innate/{ui,utils,tsconfig}` 来自 monorepo 根（CI sparse checkout），不要动
