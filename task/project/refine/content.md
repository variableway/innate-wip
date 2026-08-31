# Content: Blog 系统更新与 Plugin 模式验证落地

## Problem

[blog-system-plugin-mode-analysis.md](./blog-system-plugin-mode-analysis.md) 已给出结论：P0–P1（site-features + registry）已落地、blog 系统可用，但存在四个待落地项：

1. `apps/web/lib/site-features.ts` 中 `betterstackGuides`、`feed` 两个 flag 无任何消费方（死开关），说明 registry↔flag 映射目前靠人肉维护；
2. plugin 模式验证全靠人工翻转 flag + 肉眼观察，无机器断言；
3. blog 的内容工作流（frontmatter 契约、status 草稿机制、发布流）没有成文，CMS 编辑层方向未决策；
4. 主体工作（registry 统一、主题边界、iframe 宿主）已在 `task/project/plugin-mode/` 拆好但全 todo，与分析的行动顺序存在衔接问题（同文件冲突、验收交叉）。

## Audience / User

- 执行本包任务的 AI Agent（main + sub，见 handoff.md 的分派）
- 站点唯一维护者 patrick（消费验证结果与决策文档）

## Outcomes

- 死开关消除：site-features 每个 flag 都有真实消费方，映射可被机器断言
- plugin 契约机器化：verify-plugins 脚本 + CI，翻转 flag 有兜底
- blog 内容工作流与 CMS 编辑层决策成文（docs/）
- 本包与 plugin-mode 包的边界与依赖清晰，无双头任务

## In Scope

- 修复死 flag（删除或拆子开关，见 spec.md 决策）
- `apps/web/scripts/verify-plugins.mjs` + CI workflow 集成
- blog 内容工作流文档 + CMS 编辑层决策记录
- 本包验收与状态收尾（含跨包衔接记录）

## Out of Scope

- plugin-mode T01–T05 本体（registry 迁移、feed/writing 边界、iframe 宿主、betterstack 包化、其自身验收）——引用不重做
- CMS 编辑器实际接入（只做决策与重评估触发条件）
- MFE 框架评估（已决策不引入，ADR 见 `docs/solution/micro-frontend-research.md`）

## References

- [blog-system-plugin-mode-analysis.md](./blog-system-plugin-mode-analysis.md)（本包源头分析）
- `docs/solution/plugin-mode.md`（plugin 设计方案）
- `docs/solution/multi-agent-context.md`（三层上下文与并行模式）
- `task/project/plugin-mode/`（主体工作所在包）
