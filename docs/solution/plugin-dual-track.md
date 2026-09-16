# Plugin 双轨方案：package-as-plugin × iframe

> Status: design（2026-09）
> Related: [plugin-mode.md](./plugin-mode.md)（P0–P1 已落地）、[micro-frontend-research.md](./micro-frontend-research.md)
> Question: 插件既要可插拔，又要不牺牲 SEO / 主题一致性 / 性能，边界应该放在哪？

## TL;DR

**SEO 要求内容在构建时（或服务端）就进入宿主 HTML，所以插件边界必须放在客户端运行时之前。** 双轨制：

- **内容型模块 → package-as-plugin**（route loadMode + workspace 包分发，构建时组合）
- **外部工具 / 不可信 / 独立部署 → iframe**（客户端运行时，圈禁为逃生门）

两轨共用同一套 `SitePlugin` manifest 与 registry，manifest schema 零改动。

## 0. 共同底座（已有，不变）

- Manifest：`apps/web/lib/plugins/types.ts` 的 `SitePlugin`
- Registry：`lib/plugins/registry.ts` + `getEnabledPlugins()`
- `loadMode` 语义保持 `"route" | "iframe"`（渲染语义）；**分发方式**（repo 内子树 vs workspace 包）是正交维度，本方案只是把 route 模式的分发方式约定为包

---

## 1. 方案 A：package-as-plugin（构建时组合）

### 架构

插件 = workspace 包，导出三样东西：manifest、数据加载器、页面组件。宿主构建时组装为第一方 SSG 页面。

```
packages/plugin-making/
├── package.json          # name + exports map + "innate-plugin": true
├── src/
│   ├── index.ts          # export const plugin: InnatePlugin
│   ├── data.ts           # 数据加载（读 data/*.json，包内自持）
│   └── pages/            # 页面组件（复用宿主 @innate/ui 组件与 design token）
```

### 契约

```ts
// 宿主侧类型（可先放在 lib/plugins/types.ts，成熟后抽 packages/plugin-sdk）
export interface InnatePlugin {
  manifest: SitePlugin                       // id / nav / homeTile / enabled
  data: Record<string, () => Promise<unknown>>   // 命名数据加载器
  pages: Record<string, Component>               // 路由 id → 页面组件
}
```

App Router 要求路由文件在 `app/` 内，所以宿主侧每个路由保留**一行式薄包装**：

```ts
// apps/web/app/making/page.tsx
export { makingPage as default } from "plugin-making/pages"
```

static export 完全兼容，无动态参数问题。

### 适合场景

| 场景 | 适配度 |
|------|--------|
| 一方内容模块（writing / feed / making / cheatsheets / awesome） | ✅ 核心场景 |
| 需要 SEO 的任何页面 | ✅ SSG HTML 第一方 |
| 需要共享主题 / design token / command palette 索引 | ✅ 同一次构建 |
| 单人单仓、追求类型安全契约 | ✅ |
| 第三方作者 / 独立部署节奏 / 异构技术栈 | ❌ 走 iframe |

### 如何使用（映射到现有任务）

1. **T01/T02**：writing/collections/feed 迁入 registry（消灭 sidebar 硬编码）——本方案的地基
2. **T03**：betterstack-guides 做成正经包导出（消灭 `../../packages` 跨包 fs 读）——**第一个真正的 package-as-plugin**
3. 宿主 `apps/web` 加 workspace 依赖；`registry.ts` 从包 import manifest（v1 手写）
4. 每个路由放一行式薄包装 re-export
5. **T05**：verify 脚本断言"所有启用插件均已注册 + static export 构建通过"

### 优化点

- **registry 自动发现**：构建脚本扫描 workspace 依赖里带 `"innate-plugin": true` 的包，生成 `registry.gen.ts`（P4 "JSON 由脚本生成" 的进化形态）
- **peerDependencies**：react / @innate/ui 声明为 peer，避免双 React
- **包版本化**：changesets / semver，插件可被宿主 pin 版本
- **包级测试**：每插件独立 vitest，契约（InnatePlugin 类型）即测试边界
- **npm 分发**：包发布后 `pnpm add` 即装即用，长出真正的第三方插件生态
- **构建缓存**：包多了以后上 turbo/nx remote cache

---

## 2. 方案 B：iframe（客户端运行时，逃生门）

### 架构

宿主在 `/plugins/[pluginId]` 渲染 [plugin-iframe-view.tsx](../../apps/web/components/plugins/plugin-iframe-view.tsx)，`<iframe src={plugin.iframeSrc}>` 全高加载。插件是**任意部署在任何地方的应用**，与宿主唯一契约是 URL（+ 可选 postMessage 协议）。

### 适合场景（写死边界，三条全满足才用）

1. **真外部应用**：不受我们控制的第三方 Web 应用
2. **不可信代码**：需要 sandbox 硬隔离
3. **独立部署节奏**：插件自己上下线，宿主永不重建（或异构技术栈）

工具型、非内容型、SEO 无关的界面（dashboard / playground / 外部 viewer）。**内容型模块禁用此模式**——SEO 死区 + 主题割裂 + 双运行时成本。

### 如何使用

1. 插件应用部署到任意 URL（如 `making-dashboard.example.com`）
2. `registry.ts` 注册：`loadMode: "iframe"` + `iframeSrc`
3. **T04**：补 `/plugins/[pluginId]` 宿主路由（static export 下需为已知 iframe 插件枚举 `generateStaticParams` 兜底，绕开 Next 16 空参数问题）
4. sandbox 按源收紧：跨源插件**去掉** `allow-same-origin`；同源插件承认 sandbox 是装饰性的
5. 可选：postMessage 主题同步（shell 广播 `{type:"theme", payload}`，插件监听；协议带版本号 + origin 白名单）

### 优化点

- sandbox 策略收紧（现状 `allow-scripts allow-same-origin` 同开 = 假隔离）
- postMessage 协议版本化 + origin 校验
- registry 侧 X-Frame-Options 预检脚本（提前发现拒绝被嵌的外部站）
- iframeSrc 域名 `<link rel="preconnect">`
- 加载超时降级为 "Open in new tab"（逃生门 UI 已有）
- 宿主 CSP `frame-src` 显式收敛允许清单

---

## 3. 双轨对比与决策规则

| 维度 | package-as-plugin | iframe |
|------|-------------------|--------|
| SEO | ✅ SSG 第一方 HTML | ❌ 空壳 |
| 主题一致 | ✅ 同构建共享 token | ❌ postMessage 手动同步 |
| 运行时成本 | 单运行时 | 双 browsing context |
| 隔离性 | ❌ 同进程 | ✅ 强 |
| 独立部署 | ❌ 同构建 | ✅ |
| 第三方作者 | 需 npm 分发（远期） | ✅ 任意 URL |
| 技术栈 | Next/React 同栈 | 任意 |
| 契约形态 | TypeScript 类型 | URL + postMessage 协议 |
| 数据新鲜度 | 重建时 | 实时 |

**决策规则一句话：承载内容 → A；工具且外部/不可信/独立部署 → B；两者皆非 → 不做成插件。**

---

## 4. Desktop Shell（Tauri）影响评估

**结论：不是大动作。方向是"把 web 装进 Tauri"，不是"把 Tauri 加进 web"。** 宿主 Web 代码对双轨插件体系的架构零重写。

### 为什么轻

- Tauri 壳加载的就是 static export 产物（`frontendDist: "../web/out"`），只读包装下 **web 侧零改动**
- package-as-plugin 插件与宿主同构建，Tauri 完全无感
- iframe 在系统 webview（macOS WKWebView / Windows WebView2）中可用，需在 `tauri.conf.json` 的 CSP 里允许 `frame-src` 插件域名

### 实际工作量清单（只读 wrap）

- 新增 `apps/desktop` Tauri 工程（窗口配置、图标、打包）——纯增量
- Web 侧少量适配：
  - 外链行为：`target="_blank"` 改走 `shell.open`（Tauri 插件）
  - 资源路径：`tauri://localhost` 根路径与 absolute href 兼容性确认
  - CSP / `frame-src`：为 iframe 插件域名开白名单
- CI：`pnpm build` → `tauri build` 串联

### 与插件体系的化学反应

Tauri 2 支持 multi-webview——未来 manifest 可扩 `loadMode: "webview"`，iframe 插件升级为原生 webview 窗口，**manifest 概念不变，只是加载器换了**。同时 Tauri 的 IPC（fs / tray / updater / deep-link / notification）构成**第三类插件面**（原生能力插件），与 Web 插件正交。

### 更轻的先行选项

需求若只是"可安装的桌面入口"：**PWA**（manifest + service worker）零新增工程，static export 天然适配。出现以下信号才上 Tauri：系统托盘、自动更新、deep link、本地 fs、离线原生能力。

---

## 5. 与现有任务映射

| 任务 | 双轨中的角色 |
|------|--------------|
| T01 unify registry | 方案 A 地基 |
| T02 theme boundaries | 方案 A 边界清理 |
| T03 betterstack 包化 | 方案 A 第一个实例 |
| T04 iframe host | 方案 B 宿主补全 |
| T05 verify | 双轨共同验收 |

无新增大工作项；本方案是对既有任务的方向确认与边界收紧。
