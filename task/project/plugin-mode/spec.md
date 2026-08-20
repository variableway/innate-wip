# Spec: Plugin 模式实验

> Base: `docs/solution/plugin-mode.md`（设计原则与 manifest 类型不变，本 spec 只定义 Task 2 的增量）

## 目标架构

```
App Shell（app/layout.tsx + components/sidebar|header|app-shell）
  └─ lib/plugins/registry.ts（唯一注册点，build-time）
       ├─ route 插件：app/<theme>/** 现有页面，registry 只控可见性与菜单
       └─ iframe 插件：app/plugins/[pluginId]/ 宿主 + plugin-iframe-view
```

## 关键决策

1. **不引入 MFE 框架** — 见 `docs/solution/micro-frontend-research.md`。ADR 级别决策：除非触发重新评估条件（独立部署 / 第二技术栈 / 放弃 static export），不再评估。
2. **所有主题一律 registry 化** — writing/collections/feed 与 making/cheatsheets/awesome 同等对待，消除 sidebar 的硬编码 section。"Content is core" 用 `order` 和默认 enable 表达，而不是用硬编码表达。
3. **主题交互放在数据层面** — 主题间关联（如 feed 展示 writing 文章）通过共享 `lib/` 数据层实现，不做运行时插件通信机制。
4. **shell 对主题数据的依赖显式化** — command palette 等 shell 功能需要主题数据时，通过 manifest 的可选字段声明（如 `searchData?: () => SearchEntry[]`），而不是 layout 直接 import 主题 lib。

## 插件目录约定（文档化，T02 产出）

一个自包含主题 = 三个同名目录 + 一条 registry 条目：

- `app/<theme>/` — 路由与页面
- `lib/<theme>/` — 数据层（build-time 读文件 / import JSON）
- `components/<theme>/` — 主题组件（`*-client.tsx` 为交互边界）

共享基础设施（server-markdown / markdown-renderer / remark-mermaid / @innate/ui）留在 shell 层，插件可直接使用。

## 范围外（Non-Goals，沿用 plugin-mode.md）

- 热加载第三方 JS bundle、插件市场、per-user 插件偏好
- 运行时插件通信总线
- 把主题拆成独立仓库/独立部署
