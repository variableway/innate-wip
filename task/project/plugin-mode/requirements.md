# Requirements: Plugin 模式实验

| REQ | 描述 | 验收 |
|-----|------|------|
| REQ-01 | 调研 MFE 框架并给出选型结论 | `docs/solution/micro-frontend-research.md` 存在，含对比表、维护状态、结论与重新评估条件 ✅ |
| REQ-02 | sidebar/header 只有一个注册来源 | sidebar.tsx 无主题硬编码 section；所有主题（含 writing/collections/feed）由 registry 驱动 |
| REQ-03 | 主题边界清晰、可插拔 | 插件目录约定文档化；feed↔writing 渲染重复消除；shell 不直接 import 主题数据层 |
| REQ-04 | 内容包通过包机制接入 | betterstack-guides 走 workspace 依赖 + 包 export，无 `../../packages` 相对路径 |
| REQ-05 | iframe loadMode 可用 | `/plugins/[pluginId]` 宿主在 static export 下构建通过，能渲染一个 iframe 插件 |
| REQ-06 | static export 不破 | `STATIC_EXPORT=true pnpm build` 通过；插件 enable/disable 翻转不需要改组件 JSX |

## 需求 → 任务映射

- REQ-02 → T01
- REQ-03 → T02
- REQ-04 → T03
- REQ-05 → T04
- REQ-06 → T05
