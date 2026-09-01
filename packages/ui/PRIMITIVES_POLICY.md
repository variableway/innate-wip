# Primitives 统一策略

## 目标

**一个来源维护 shadcn primitive**，应用层不再各拷一份 `components/ui/button.tsx`。

## 当前状态

| App | Primitives | 策略 |
|-----|------------|------|
| `admin-nextjs` | `@innate/ui` | **标准** — 不新增本地 ui 副本 |
| `admin-tanstack` | `@innate/ui` | **标准** — primitives 全部来自 `@innate/ui`，无本地 ui 副本 |
| `admin-ui` | 本地 `components/ui/` (base-nova) | **冻结 backup** — 请勿修改，无接入 `@innate/ui` 计划 |
| 外部独立项目 | 本地 shadcn/ui | 不在 monorepo 内时可保持独立副本 |

> 注：本包标注 `base-vega`（shadcn 官方为 Base UI 注册的 preset，与本包底层 `@base-ui/react` 一致）；`admin-ui` 仍为本地 `base-nova` 拷贝，保持冻结。`components.json` 是 CLI 行为的唯一来源。

## 硬规则

1. 新 app 在 monorepo 内：**必须**依赖 `@innate/ui`，禁止再拷一整套 primitives。
2. 业务组件、场景块、DataTable **不得**放进 `packages/ui/src/components/ui/`。
3. 装/更新组件：`pnpm --filter @innate/ui shadcn:update`，审阅 diff 后合入。
4. Agent 选组件：先 [COMPONENT_CATALOG.md](./COMPONENT_CATALOG.md)，再 `pnpm dlx shadcn@latest docs <name>`。
5. App 引入第三方库（如 `recharts`、`react-day-picker`、`react-resizable-panels`）时，版本必须与 [package.json](./package.json) 对齐；详见 [README §"Align peer-library versions"](./README.md#2-align-peer-library-versions)。

## admin-ui（冻结 backup）

admin-ui 使用本地 shadcn `base-nova` 拷贝，**已冻结为 backup 参考，请勿修改**；无接入 `@innate/ui` 的计划。场景开发以 admin-tanstack 为准（primitives 全部来自 `@innate/ui`）。

## admin-tanstack

**活跃的 TanStack 首选参考 app**（见 `apps/admin-tanstack/README.md`）。primitives 100% 来自 `@innate/ui`，无本地 `components/ui/`；新场景开发以此 app 为准。

## 相关文档

- [README.md](./README.md) — 包入口、覆盖矩阵、peer-dep 对齐表、troubleshooting
- [docs/UPDATING.md](./docs/UPDATING.md) — 添加/更新/升级 recipe、CLI 后处理、Base UI 升级步骤
- [COMPONENT_CATALOG.md](./COMPONENT_CATALOG.md) — 当前导出索引，按类别分组