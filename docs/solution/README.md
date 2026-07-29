# Solutions Index

Task 1（Refactor & simplify）产出：

| Doc | Covers |
|-----|--------|
| [plugin-mode.md](./plugin-mode.md) | Plugin 注册进 sidebar；route / iframe（**P1 已落地**） |
| [task-docs-workflow.md](./task-docs-workflow.md) | `task/project` + `task/issues`：Content → Spec → Requirements → Handoff → Verify |
| [multi-agent-context.md](./multi-agent-context.md) | system / requirement / interaction；多 Agent / Sub Agent |

## Related code

| Path | Role |
|------|------|
| `apps/web/lib/site-features.ts` | Content-first feature flags |
| `apps/web/lib/plugins/` | Registry + types + icons |
| `apps/web/components/plugins/plugin-iframe-view.tsx` | iframe UI (route host deferred to P3) |
| `task/project/_template/` | 需求文档起步模板 |
| `task/issues/_template.md` | 单 Issue 模板 |

## Re-enable Making

Set `making: true` in `site-features.ts` — sidebar/header/home pick it up from the registry automatically.
