# T03: blog 内容工作流 + CMS 编辑层决策文档

- **REQ**: REQ-03
- **Status**: todo
- **Agent**: sub:docs
- **Depends**: none（docs-only，可与 T01/T02 并行）

## Context pack

- system: yes
- requirement: yes
- interaction: no（只新增 docs/ 文件，无共享面）
- extra: [`task/project/refine/blog-system-plugin-mode-analysis.md` §一]

## Goal

把分析中"blog 三层更新路径"沉淀为两份文档：贡献者视角的内容工作流、维护者视角的 CMS 编辑层决策。

## Steps

1. **blog 内容工作流**（落点建议 `docs/features/blog-content-workflow.md`，本任务内定并在交付说明里写明）：
   - frontmatter 契约表：PostMeta 全字段、必填/缺省行为（以 `apps/web/lib/content/types.ts` + `parser.ts` 的实际缺省逻辑为准，逐字段核对）
   - status 草稿机制：draft 不进列表 / RSS / `generateStaticParams`
   - 发布流：本地预览（`pnpm dev`）→ PR → CI `build:static` → Pages
   - MDX 与 mermaid 能力边界（`@mdx-js/mdx` evaluate 管线、MermaidBlock）
2. **CMS 编辑层决策**（落点 `docs/planning/` 或 `docs/solution/`，本任务内定）：
   - 三选项对比结论：file-based + git-based 编辑器层 ✅ / 远程 headless ❌ / 自建管理界面 ❌（static export 下不可行）
   - 推荐落地路径：先 plugin 化（plugin-mode T01/T02），编辑器为独立后续决策
   - 重评估触发条件：多人协作、放弃 static export 改 SSR
3. 与 `docs/solution/README.md` 索引衔接（append-only）。

## Verify

- [ ] 两份文档存在且包含上述要素
- [ ] frontmatter 表与 `lib/content/types.ts` + `parser.ts` 实际缺省行为一致（逐字段核对）
- [ ] `docs/solution/README.md` 索引已追加（如适用）
- [ ] 未修改任何代码文件（docs-only）
