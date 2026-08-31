# T02: verify-plugins 自动化断言脚本 + CI

- **REQ**: REQ-02
- **Status**: todo
- **Agent**: sub:impl
- **Depends**: none（断言分级设计使脚本在 T01 前后都绿；收尾建议在 T01 之后）

## Context pack

- system: yes
- requirement: yes
- interaction: yes（断言等级与 plugin-mode T01 联动；`@/` 别名问题可能涉及 T01 领地）
- extra: [`task/project/refine/blog-system-plugin-mode-analysis.md` §2.3]

## Goal

新增 `apps/web/scripts/verify-plugins.mjs`：三层断言（契约一致性 / flag 覆盖率 / 硬编码回归），本地可跑、CI 集成，使翻转 flag 与 registry 变更有机器兜底。

## Steps

1. 运行时选型：`registry.ts` 用 `@/` 别名 import `site-features.ts`，node 原生 `--experimental-strip-types` 不解析 tsconfig paths → 首选 `tsx` devDep（支持 paths）；若选择把相关 import 改为相对路径，该改动归 T01 文件领地，需在 `context/interaction.md` 登记。
2. 实现三层断言：
   - **契约（fail）**：每个 plugin 的 `enabled` 源自 siteFeatures；`loadMode === "iframe"` 必须有 `iframeSrc`；nav item `href` 非空且全局唯一
   - **覆盖率（fail）**：site-features 每个 key 被 registry 或 shell 显式引用（shell 白名单：content → `app/layout.tsx`）
   - **硬编码回归（warn，plugin-mode T01 落地后升级 fail）**：`components/sidebar.tsx`、`components/header.tsx`、`app/page.tsx` 不出现 `/writing`、`/collections`、`/feed` 等主题路径
3. 输出：PASS/FAIL 汇总 + 违规明细（file:line）；有 fail 时非零退出码。
4. `apps/web/package.json` 增加 `"verify:plugins"` script。
5. 新增 `.github/workflows/verify-plugins.yml`：PR + push（paths 过滤 `apps/web/**`）触发，复用 `./.github/actions/setup-workspace`，跑 `pnpm --filter @innate/web verify:plugins`。
6. 自测：临时制造违规（删一个 iframeSrc / 加回死 flag）确认脚本能红，再还原。

## Verify

- [ ] 本地 `pnpm --filter @innate/web verify:plugins` 通过
- [ ] CI workflow 存在且绿；人为违规可红（本地模拟即可）
- [ ] 断言分级落地：硬编码回归当前为 warn，代码里有明确的升级开关/常量
- [ ] 脚本无网络、无 dev server 依赖，CI 干净环境可重复执行
