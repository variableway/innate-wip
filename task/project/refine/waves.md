# Waves: refine 包并行分派单

- **Protocol**: `docs/solution/multi-agent-dispatch.md`（波次调度 + worktree 隔离 + 单写者合并）
- **Created**: 2026-08-31
- **用法**: 分派者（人或 main agent）照本单执行；每波完成后回填实际时序与经验

## Wave 1（并行，3 Agent）

| Task | Worktree | Branch | CLI |
|------|----------|--------|-----|
| T01 修死 flag | `../innate-refine-t01` | `refine/t01-fix-dead-flags` | zcode |
| T02 verify-plugins | `../innate-refine-t02` | `refine/t02-verify-plugins` | kimi |
| T03 blog 文档 | `../innate-refine-t03` | `refine/t03-blog-docs` | claude |

（CLI 分配示例，任意替换；文件分区见 `context/interaction.md` Shared ownership，三者零重叠）

```bash
# Step 0 一次性建齐（每个 worktree 内: pnpm link:packages && pnpm install）
git worktree add ../innate-refine-t01 -b refine/t01-fix-dead-flags
git worktree add ../innate-refine-t02 -b refine/t02-verify-plugins
git worktree add ../innate-refine-t03 -b refine/t03-blog-docs
```

分派简报模板：`docs/solution/multi-agent-dispatch.md` §3 Step 1（替换任务号与分支名）。

## Wave 2（串行，1 Agent，主仓库执行，无需 worktree）

| Task | 前置 |
|------|------|
| T04 验收收尾 | Wave 1 全部合并 + 闸门通过 |

## 互斥提醒（跨包）

- **plugin-mode T01** 与 refine T01 同改 `site-features.ts` + `registry.ts` → 不可同波；refine T01 先行，或合入其首个 PR。

## 闸门（Wave 1 合并后、派发 Wave 2 前）

```bash
# 越界检查（逐分支）
git diff main...refine/t01-fix-dead-flags --name-only   # 核对 ownership
# 合并（顺序任意）
git merge refine/t01-fix-dead-flags && git merge refine/t02-verify-plugins && git merge refine/t03-blog-docs
# 集成验证
pnpm --filter @innate/web build:static
pnpm --filter @innate/web verify:plugins   # T02 交付后可用
```

## 执行记录

| Wave | 实际开始 | 实际合并 | 备注 |
|------|---------|---------|------|
| 1 | | | |
| 2 | | | |
