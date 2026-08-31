# Spec: Blog 系统更新与 Plugin 模式验证落地

> Base: [blog-system-plugin-mode-analysis.md](./blog-system-plugin-mode-analysis.md) §三 建议的行动顺序

## Approach

三条互不冲突的并行任务（代码修复 / 工具链 / 文档）+ 一个 join 验收任务；与 plugin-mode 包通过 README 的「External deps」表衔接，而非复制任务定义。

## Architecture / Data Flow

```
site-features.ts ──(flag 引用)──> registry.ts ──> sidebar / header / home
        │
        └─ verify-plugins.mjs（三层断言）
             1. 契约一致性（fail）：enabled↔flag、iframe 插件必须有 iframeSrc、nav href 非空且唯一
             2. flag 覆盖率（fail）：site-features 每个 key 被 registry 或 shell 显式消费
             3. 无硬编码回归（warn → plugin-mode T01 落地后升级 fail）：
                sidebar/header/page 不出现主题路径
                  │
                  └─ CI（verify-plugins workflow，PR/push 触发）
```

## Touchpoints

| Area | Path | Change |
|------|------|--------|
| Flags | `apps/web/lib/site-features.ts` | 删除死 flag（T01） |
| Registry | `apps/web/lib/plugins/registry.ts` | 随 flag 删除同步核对（T01） |
| Tooling | `apps/web/scripts/verify-plugins.mjs`（新增） | 三层断言（T02） |
| Scripts | `apps/web/package.json` | 增加 `verify:plugins` script（T02） |
| CI | `.github/workflows/verify-plugins.yml`（新增） | PR/push 触发脚本（T02） |
| Docs | `docs/features/` 或 `docs/planning/` | blog 工作流 + CMS 决策（T03，落点 T03 内定） |

## Key Decisions

1. **死 flag 处理：删除优于拆分**。`betterstackGuides` 的入口本就挂在 cheatsheets 插件 nav 第二项内，拆子开关会让 flag 数量先膨胀；`feed` 将由 plugin-mode T01 以真实引用方式重新引入（届时重加，避免维护豁免清单）。
2. **断言分级**：硬失败（契约/覆盖率）与软警告（硬编码回归，依赖 plugin-mode T01 完成后升级），避免脚本一落地 CI 就红。
3. **CMS 编辑层：只决策不接入**。推荐 file-based + git-based 编辑器（Decap/Tina 类），决策文档写明重评估触发条件（多人协作 / 放弃 static export）。
4. **运行时注意**：`registry.ts` 以 `@/` 别名 import `site-features`，node 原生 type-stripping 不解析 tsconfig paths → 脚本首选 `tsx`（支持 paths），或将相关 import 改相对路径（归 T01 文件领地，需在 interaction.md 登记）。

## Constraints

- Static export / GitHub Pages；registry 必须 build-time，脚本不得依赖 dev server 或网络
- 不引入 MFE 框架（ADR，见 `docs/solution/micro-frontend-research.md`）
- 不与 plugin-mode 包重复定义任务；不修改 plugin-mode 包内文件
- 脚本工具链（tsx）是唯一允许的新依赖

## Open Questions

- [ ] verify-plugins 挂独立 workflow 还是并入 deploy-pages.yml 前置 step？（建议独立：PR 也能触发）
- [ ] T03 两份文档落点：`docs/features/` vs `docs/planning/` vs `docs/solution/`
- [ ] blog 工作流文档语言：中文（仓库文档惯例）还是英文（站内内容现状）
