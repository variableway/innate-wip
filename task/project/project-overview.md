# Project Overview

当前这个项目是用来记录和分享：
1. 学习AI过程中的记录 - tutorial
2. 记录日常想法
3. 记录看到AI产品的想法分析的 - Project ideas
4. 同时支持plugin模式：
   1. 当前Making信息可以通过plugin的形式加入到站点，可以是iframe，可以是加载方式都可以
   2. 可以注册到sidebar menu上面

## Task 1: 先Refactor和简化 — ✅ Done

1. ~~先把非Content 内容不展示~~ — nav/home 仅 Content+Feed；`lib/site-features.ts`
2. ~~分析Plugin模式，然后给出方案~~ — `docs/solution/plugin-mode.md` + **P1 已实现** `lib/plugins/`
3. ~~task 文档开发模式（Content/Spec/需求/handoff/verify）~~ — `docs/solution/task-docs-workflow.md` + `task/project/_template/`
4. ~~多任务共享上下文 + 多 Agent / Sub Agent~~ — `docs/solution/multi-agent-context.md` + template `context/`
5. ~~方案写入 docs/solution~~ — 见 `docs/solution/README.md`

### How to re-enable Making

`apps/web/lib/site-features.ts` → `making: true`
