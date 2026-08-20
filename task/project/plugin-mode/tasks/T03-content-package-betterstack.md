# T03: betterstack-guides 内容包规范化接入

- **REQ**: REQ-04
- **Status**: todo
- **Agent**: main
- **Depends**: none

## Context pack

- system: yes
- requirement: yes
- interaction: no
- extra: []

## Goal

`packages/betterstack-guides` 已是"内容插件"雏形（自带数据与分类），但 web 端通过 `lib/betterstack/data.ts:4` 的 `../../packages/betterstack-guides/guides` 相对路径跨包读文件。改为正常的 workspace 包依赖 + 包 export，作为后续内容类插件的接入范式。

## Steps

1. `packages/betterstack-guides/package.json` 增加 `exports`（如 `./guides` 指向 `index.json`，并导出 guides 目录路径常量或数据访问函数）。
2. `apps/web/package.json` 增加 `"@innate/betterstack-guides": "workspace:*"` 依赖，`pnpm install`。
3. `lib/betterstack/data.ts` 改为从包 import 获取内容路径/索引，删除 `../../packages` 相对路径。
4. 确认 CI（GitHub Pages workflow 的 checkout 布局）不受影响——该包在本仓库内，不涉及 innate-fe-templates sparse checkout，预期无 CI 改动。
5. 在插件目录约定文档（T02 产出）中补一段"内容包型插件"的接入方式，以本包为示例。

## Verify

- [ ] `grep -r "\.\./\.\./packages" apps/web/lib` 无结果
- [ ] `/betterstack-guides` 各分类与详情页渲染不变
- [ ] `pnpm install && STATIC_EXPORT=true pnpm build` 通过
