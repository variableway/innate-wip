# Refine: Blog 系统更新与 Plugin 模式验证落地

- **Status**: active
- **Owner**: patrick
- **Created**: 2026-08-31
- **Source**: [blog-system-plugin-mode-analysis.md](./blog-system-plugin-mode-analysis.md)（分析结论 → 本任务包）

## 一句话结论

把分析文档的"建议行动顺序"拆成可多 Agent 并行的任务：修死 flag、plugin 契约自动化验证、blog 工作流与 CMS 决策文档；registry 统一 / 主题边界 / iframe 宿主等主体工作**引用** `task/project/plugin-mode/` 的 T01–T05，不重复定义。

## Documents

| Stage | File |
|-------|------|
| Content | [content.md](./content.md) |
| Spec | [spec.md](./spec.md) |
| Requirements | [requirements.md](./requirements.md) |
| Handoff | [handoff.md](./handoff.md) |
| Verify | [verify.md](./verify.md) |
| Analysis (source) | [blog-system-plugin-mode-analysis.md](./blog-system-plugin-mode-analysis.md) |

## Context pack

| Layer | File |
|-------|------|
| System | [context/system.md](./context/system.md) |
| Requirement | [context/requirement.md](./context/requirement.md) |
| Interaction | [context/interaction.md](./context/interaction.md) |

## Tasks

| ID | File | Status | Agent | Depends |
|----|------|--------|-------|---------|
| T01 | [tasks/T01-fix-dead-feature-flags.md](./tasks/T01-fix-dead-feature-flags.md) | todo | sub:impl | none |
| T02 | [tasks/T02-verify-plugins-script.md](./tasks/T02-verify-plugins-script.md) | todo | sub:impl | none |
| T03 | [tasks/T03-blog-workflow-cms-docs.md](./tasks/T03-blog-workflow-cms-docs.md) | todo | sub:docs | none |
| T04 | [tasks/T04-verify-and-closeout.md](./tasks/T04-verify-and-closeout.md) | todo | main | T01–T03 |

## External deps（plugin-mode 所有，不重复定义）

| Work | Owned by | Relation |
|------|----------|----------|
| writing/collections/feed 迁入 registry | `task/project/plugin-mode/tasks/T01` | 与本包 T01 同文件（site-features/registry）→ 本包 T01 必须先落地；其落地后 T02 的硬编码断言可升级为 fail |
| feed↔writing 边界 + shell 依赖收敛 | `task/project/plugin-mode/tasks/T02` | 文件不重叠，可并行 |
| iframe 宿主路由（Next 16 空 params fallback） | `task/project/plugin-mode/tasks/T04` | 本包 T02 的 iframeSrc 断言为其服务 |

## Notes

- **并行分派**：见 [waves.md](./waves.md)（Wave 1 = T01/T02/T03 并行，Wave 2 = T04；协议见 `docs/solution/multi-agent-dispatch.md`）。
- T01/T02/T03 文件分区不重叠（flags+registry / scripts+CI / docs），可三 Agent 并行（Pattern B，见 `docs/solution/multi-agent-context.md`）。
- 遵循 `docs/solution/task-docs-workflow.md`；完成后在 `task/project/project-overview.md` 登记本包状态。
