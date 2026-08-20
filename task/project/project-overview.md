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


## Task 2: Plugin模式实验

相对当前Web做Plugin模式的实验，主要考虑是：
1. 主体项目就是一个App Shell, 只提供做简单的：
   - Sidebar menu 注册的位置
   - Sidebar 对应的Main Content或者就是一个应用了
2. 小的主题进行注册到这个App Shell里面，比如Writing就是一个小的主题，当然可以算是一个小应用也可以这样子理解
3. 如果整个思路就是Micro Frontend的话，有开源的框架进行吗，但是不想太复杂的开源框架，主题之间其实交互不会太多，这些内容如果有的话，可以完全放到用户数据层面去关联
5. 如果有非常简单的Micro Frontend的框架，并且在积极维护的话到时可以考虑，但需要调研一下
6. 当前项目中其实有很多主题了，除了writing之外有太多很多，看是否有可行性，请做调研并给出计划和任务

**调研与计划（2026-08-19）— active**:
1. MFE 框架调研结论：**不引入框架**（static export + 主题几乎无交互，所有 runtime MFE 框架成本远超收益）— `docs/solution/micro-frontend-research.md`
2. Plugin 模式 = App Shell + build-time Registry（P0–P1 已落地）+ route/iframe 两种 loadMode
3. 计划与任务：`task/project/plugin-mode/`（T01 统一 registry / T02 主题边界 / T03 内容包规范化 / T04 iframe 宿主 / T05 验收收尾）