# Micro-Frontend 框架调研（Task 2）

> Status: done（2026-08 调研）
> Related: [plugin-mode.md](./plugin-mode.md)、`task/project/plugin-mode/`
> Question: Plugin 模式是否等于 Micro Frontend？是否有"非常简单且积极维护"的开源框架值得引入？

## 结论（先说答案）

**本项目不需要引入任何 Micro-Frontend 框架。** 继续走已落地的 build-time Plugin Registry 路线（`lib/plugins/`，P0–P1 已完成），iframe 作为真正独立应用的逃生舱即可。理由：

1. **MFE 框架解决的问题这里不存在。** MFE 的核心价值是"多团队、多技术栈、独立构建/独立部署"。本项目是单人单仓库单构建管线（Next.js `output: 'export'` + GitHub Pages），主题之间几乎无交互（盘点确认：除 sidebar/header/home 的全局导航外，主题间无互链；唯一的数据级耦合是 feed↔writing 共享 `lib/content`）。
2. **与 static export 根本冲突。** qiankun / single-spa / Module Federation 都是 runtime 编排方案（动态拉取 remote bundle、沙箱、运行时注册），而本站是构建期全静态渲染。硬塞进去等于放弃 static export 的最大红利，换一个用不上的能力。
3. **用户约束就是答案。** "不想太复杂 + 主题交互很少" 正是 MFE 社区公认的反模式场景——[Microfrontends in 2025: A Reality Check](https://dev.to/vitalii_petrenko_dev/microfrontends-in-2025-a-reality-check-from-the-trenches-1nj2) 指出 85% 的团队是出于错误理由引入 MFE，[Micro Frontend vs SPA](https://dev.to/bishoy_bishai/micro-frontend-vs-spa-which-architecture-should-you-choose-3fm9) 也明确"交互少的场景先做好组件设计和模块边界"。
4. **MFE 的思想已经用上了。** "App Shell + 注册点 + 主题插件" = build-time composition，这正是 [plugin-mode.md](./plugin-mode.md) 的设计（One registry / Two load modes / Static-export friendly）。iframe loadMode 则覆盖了"某个主题真的长成独立应用"的未来情形。

## 框架对比与维护状态（2026-08 快照）

| 框架 | 背后 | 机制 | 复杂度 | 维护状态 | 对本项目适配 |
|------|------|------|--------|----------|--------------|
| **single-spa** | 社区 | runtime 生命周期编排 | 中 | 稳定维护（核心库成熟，变更少） | ❌ runtime SPA 编排，与 static export 冲突 |
| **Module Federation 2.0** | ByteDance web-infra-dev + Zack Jackson | 构建/runtime 模块共享 | 高 | **最活跃**（MF 2.0 持续迭代，Rspack/Vite/webpack 都支持） | ❌ 需要 bundler runtime + remote 部署，GitHub Pages 静态站用不上 |
| **qiankun** | Ant Group | single-spa 封装 + JS 沙箱 | 中高 | 维护放缓（issue 响应慢，社区有"半停更"评价） | ❌ 面向老项目迁移，非新架构 |
| **wujie（无界）** | Tencent | iframe + web component 隔离 | 中 | 社区抱怨响应慢（[issue #849](https://github.com/Tencent/wujie/issues/849)） | ❌ |
| **micro-app** | JD | web component 沙箱 | 中 | 仍在维护 | ❌ runtime 方案 |
| **Garfish** | ByteDance（web-infra-dev） | runtime 沙箱 + 监控 | 高 | 维护中（[web-infra-dev/garfish](https://github.com/web-infra-dev/garfish)） | ❌ 企业级中后台定位，过重 |
| **Piral** | smapiot | pilet 包 + feed 服务 | 高 | 活跃，但生态偏 .NET | ❌ |
| **iframe（裸用）** | — | 浏览器原生隔离 | 低 | 永远"维护" | ✅ 已选型为 loadMode 之一 |
| **build-time registry（自研，现状）** | 本仓库 | 构建期组合 | **最低** | 自己掌控 | ✅ 已落地 P0–P1 |

行业趋势参考：[2025 微前端生态总结](https://www.webzsky.com/archives/1670)（框架从"探索期"走向"平台级能力"，越成熟越重）、[feature-sliced.design 2025 指南](https://feature-sliced.design/blog/micro-frontend-architecture)、[2025 方案实战对比](http://mp.weixin.qq.com/s?__biz=MzU2NjU3Nzg2Mg==&mid=2247545200&idx=1&sn=5f2542ebd5dd080f6babb5621ab27608)。

## 重新评估的触发条件

出现以下任一情况时再回头看 Module Federation 2.0 或 iframe 增强方案：

- 某个主题要独立仓库、独立部署、独立发版（真正的"微应用"诉求）
- 引入第二技术栈（如某个主题是 Vue/Svelte 写的）
- 主题间出现共享运行时状态的需求，且无法放到"用户数据层面"解决（当前判断：都可以通过 URL / localStorage / 数据文件关联，不需要框架级通信）
- 站点放弃 static export、改为服务端托管

## 给 Task 2 的含义

"Plugin 模式"在本项目 = **App Shell + build-time Registry + route/iframe 两种 loadMode**，不需要框架。剩余工作是把还没进 registry 的主题（writing / collections / feed）迁进去、理清主题边界、补齐 iframe 宿主——见 `task/project/plugin-mode/`。
