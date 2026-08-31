# Verify: Blog 系统更新与 Plugin 模式验证落地

## Checklist

- [ ] REQ-01: `grep -rn "betterstackGuides\|siteFeatures.feed" apps/web .github docs` 无结果；`site-features.ts` 剩余 key（content / making / cheatsheets / awesome）每个都有消费方（content→layout.tsx，其余→registry.ts）
- [ ] REQ-02: `pnpm --filter @innate/web verify:plugins` 本地通过；CI workflow 绿；人为制造一处违规（如删 iframeSrc、加回死 flag）能红
- [ ] REQ-03: blog 工作流文档含 frontmatter 契约表、status 草稿说明、发布流；CMS 决策含三选项对比、推荐项与重评估触发条件
- [ ] REQ-04: 本文件全勾且 Evidence 填写；README Status → done；interaction.md 无未解决冲突；project-overview.md 已登记
- [ ] Manual smoke: 翻转 `making: true` → sidebar/header/home 出现 Making section；翻回消失（确认 T01 未破坏 P1 行为，全程零 JSX 修改）
- [ ] `pnpm --filter @innate/web build:static` 通过

## Evidence

| REQ | Evidence |
|-----|----------|
| REQ-01 | grep 输出 / PR link |
| REQ-02 | 本地运行日志 + CI run link |
| REQ-03 | 文档链接 |
| REQ-04 | 状态翻转 commit / 截图 |
