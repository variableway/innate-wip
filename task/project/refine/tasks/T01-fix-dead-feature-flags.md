# T01: 修复死 feature flags

- **REQ**: REQ-01
- **Status**: todo
- **Agent**: sub:impl
- **Depends**: none

## Context pack

- system: yes
- requirement: yes
- interaction: yes（site-features/registry 与 plugin-mode T01 共享，见 Cross-package 规则）
- extra: [`task/project/refine/blog-system-plugin-mode-analysis.md` §2.4]

## Goal

消除 `apps/web/lib/site-features.ts` 中无消费方的 `betterstackGuides`、`feed` 两个 flag，使 flag→消费方映射可被机器断言（为 T02 的覆盖率断言铺路）。

## Steps

1. 全仓 grep 确认两个 flag 零引用（`apps/web`、`.github`、`docs`，含文档示例）。
2. 决策（spec.md 已给推荐：删除）：
   - 删 `betterstackGuides`——其入口挂在 cheatsheets 插件 nav 第二项（`registry.ts:73-78`），语义归属 cheatsheets 开关
   - 删 `feed`——plugin-mode T01 迁移 feed 进 registry 时会以真实引用重新引入，届时重加，避免维护豁免清单
   - 若改选"拆子开关"方案，先在 `context/interaction.md` 登记决策再动手
3. 修改 `apps/web/lib/site-features.ts`；核对 `registry.ts` 引用集不变（本就不含这两个 flag，预期零改动）。
4. 跑 dev 或 build 确认无隐式消费导致的行为变化。

## Verify

- [ ] `grep -rn "betterstackGuides\|siteFeatures.feed" apps/web .github docs` 无结果
- [ ] `site-features.ts` 剩余 key = content / making / cheatsheets / awesome，每个都有消费方
- [ ] `pnpm --filter @innate/web build:static` 通过
- [ ] `context/interaction.md`「Contracts」的 flag 引用集描述与实际一致
