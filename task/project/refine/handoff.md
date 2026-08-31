# Handoff: Blog 系统更新与 Plugin 模式验证落地

## Mission

把分析文档（`blog-system-plugin-mode-analysis.md`）的行动顺序落成代码与文档：修死 flag 让 registry↔flag 契约一致；用 verify-plugins 脚本 + CI 把 plugin 验证从人肉变成机器；补齐 blog 工作流与 CMS 决策文档。T01–T03 文件分区不重叠，按 Pattern B 并行分派给不同 Agent；T04 由 main 收口。plugin-mode 包的主体任务（registry 统一、边界、iframe 宿主）不在本包，勿越界实现。

## Read first (ordered)

1. `context/system.md`
2. `context/requirement.md`
3. `context/interaction.md`（T01/T02 必读——涉及与 plugin-mode 的共享文件）
4. `content.md` + `spec.md` + `requirements.md`（本任务对应的 REQ 行）

## Task queue

| Task | File | Agent | Depends |
|------|------|-------|---------|
| T01 | [tasks/T01-fix-dead-feature-flags.md](./tasks/T01-fix-dead-feature-flags.md) | sub:impl | — |
| T02 | [tasks/T02-verify-plugins-script.md](./tasks/T02-verify-plugins-script.md) | sub:impl | — |
| T03 | [tasks/T03-blog-workflow-cms-docs.md](./tasks/T03-blog-workflow-cms-docs.md) | sub:docs | — |
| T04 | [tasks/T04-verify-and-closeout.md](./tasks/T04-verify-and-closeout.md) | main | T01–T03 |

External（只读依赖，不在本包执行）：plugin-mode T01 / T02 / T04，关系见 README「External deps」。

## 禁止事项

- 不改 `components/sidebar.tsx` / `header.tsx` / `app/page.tsx`（plugin-mode T01 的领地）
- 不修改 `task/project/plugin-mode/` 包内文件（状态由其自身维护）
- 不引入新的运行时依赖（脚本工具链 tsx 除外）

## Done when

- All P0 REQ（REQ-01 / REQ-02 / REQ-04）verified in `verify.md`
- README 与各任务 Status 翻转 done；`task/project/project-overview.md` 已登记本包
