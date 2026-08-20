# T05: 验收、文档与状态收尾

- **REQ**: REQ-06
- **Status**: todo
- **Agent**: main
- **Depends**: T01, T02, T03, T04

## Context pack

- system: yes
- requirement: yes
- interaction: no
- extra: []

## Goal

按 WriteAgent 约定收尾：全量验证 + 文档同步 + 状态翻转。

## Steps

1. 全量验证：
   - `STATIC_EXPORT=true pnpm build` 通过；
   - 逐个翻转 `site-features` 中每个主题 flag，确认 sidebar/header/home 随 registry 变化，且禁用后直达 URL 仍可用（设计允许）；
   - 抽查每个主题至少一个列表页 + 一个详情页渲染无回归。
2. 文档同步：
   - `docs/solution/plugin-mode.md`：Status 更新为 implemented（P0–P4 实际状态），Current State 表刷新；
   - `docs/solution/README.md` 索引加 `micro-frontend-research.md`；
   - `task/project/project-overview.md` Task 2 标记 done 并链接 `task/project/plugin-mode/`；
   - 根 `AGENTS.md`：若插件目录约定成为正式约定，在架构一节补一句并指向 plugin-mode.md。
3. `task/project/plugin-mode/README.md` Status → done，各任务文件 Status → done，按 `task/tracing/` 惯例留执行记录。

## Verify

- [ ] requirements.md 中 REQ-02 ~ REQ-06 全部满足
- [ ] 上述文档均已更新且与实际代码一致
