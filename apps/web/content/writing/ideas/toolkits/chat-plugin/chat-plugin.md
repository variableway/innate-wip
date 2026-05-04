# Chat History Export Tool — 分析报告

> 目标：从 ChatGPT / Claude 等平台导出聊天记录，保存为本地文件
> 范围：Chrome 插件 vs Playwright 自动化 vs 官方 API vs 邮件导出+Gmail 自动化 四条路径对比，以及技术栈选型

---

## 1. 背景与需求

在日常使用 ChatGPT、Claude 等 AI 平台时，用户积累了大量有价值的对话。这些对话散落在各平台的服务器上，没有统一的本地归档方式。核心需求：

1. **一键提取**当前页面的聊天记录
2. **保存为本地文件**（Markdown / JSON / TXT）
3. 支持多平台：**ChatGPT**、**Claude**（以及未来的 Gemini、Grok 等）
4. 操作简单，非技术用户也能用

---

## 2. 三条路径对比分析

### 路径 A：Chrome 浏览器插件（推荐 ✅）

**原理**：在目标页面注入 Content Script，直接读取 DOM 中的聊天元素，解析后导出。

| 维度 | 评估 |
|------|------|
| **实现难度** | 中等。需要针对每个平台写 DOM 选择器，但逻辑不复杂 |
| **用户体验** | ⭐⭐⭐⭐⭐ 最优。用户在浏览聊天时一键点击即可导出，无需离开页面 |
| **稳定性** | 中。平台前端改版会导致选择器失效，需持续维护 |
| **权限要求** | 仅需 `activeTab` + `downloads` 权限，隐私友好 |
| **跨平台** | 天然支持 Chrome / Edge / Arc 等 Chromium 浏览器 |
| **已有竞品** | Chat Conversation Exporter、AI Chat Transcript Downloader、GPTBLOX、LLM Conversation Exporter 等多款 |

**核心优势**：
- 用户已经在浏览器里看聊天，插件就在上下文中，零摩擦
- 所有数据处理在本地完成，不上传任何内容
- 可以导出当前正在进行的对话（实时），不需要等对话结束

**核心风险**：
- ChatGPT 和 Claude 的 DOM 结构会不定期更新，选择器需要跟着改
- 每新增一个平台就要写一套适配逻辑

### 路径 B：Playwright 自动化

**原理**：用 Playwright 驱动浏览器，自动登录 → 导航到对话页 → 抓取内容 → 保存。

| 维度 | 评估 |
|------|------|
| **实现难度** | 中高。需要处理登录态、Cloudflare 防护、动态加载等 |
| **用户体验** | ⭐⭐ 较差。需要安装 Node.js / Python 环境，运行脚本 |
| **稳定性** | 低。平台反爬机制频繁更新（`navigator.webdriver` 检测、Cloudflare Challenge） |
| **权限要求** | 需要用户提供登录凭证或 Cookie，安全风险高 |
| **适用场景** | 批量导出历史对话（一次性任务） |

**核心问题**：
- ChatGPT 和 Claude 均有严格的反自动化检测（Cloudflare、CAPTCHA）
- `navigator.webdriver = true` 会被检测，需要 stealth 插件绕过
- 每次平台更新选择器就要修脚本，维护成本高
- **不适合做成日常工具**，更适合做一次性的批量迁移脚本

**结论**：Playwright 不适合作为主要方案。如果你只是想**一次性导出所有历史对话**，可以写一个临时脚本，但不适合做成产品。

### 路径 C：官方 API

**原理**：通过平台提供的 API 获取对话数据。

| 平台 | API 能力 | 说明 |
|------|----------|------|
| **ChatGPT** | `/backend-api/conversations` 列出对话列表；`/backend-api/conversation/{id}` 获取单条对话详情 | ⚠️ 这是**非公开的内部 API**，随时可能变动。需要用户的 Session Token |
| **OpenAI 官方 API** | `GET /v1/conversations/{id}` + `GET /v1/conversations/{id}/items` | 2025 年新推出的 Conversations API，仅适用于通过 API 创建的对话（`store=true`），**不包含 ChatGPT 网页端的对话** |
| **Claude** | Settings → Privacy → Export Data | 官方只提供全量数据导出（邮件发送下载链接），没有实时 API |

**核心问题**：
- ChatGPT 的 `backend-api` 是内部接口，非公开文档化，OpenAI 随时可能封禁
- OpenAI 官方 Conversations API 只能获取通过 API 调用产生的对话，**网页端对话无法获取**
- Claude 没有对话列表 API，只有全量数据导出（24 小时内邮件发送）
- 两个平台都需要用户提供 API Key 或 Session Token，安全风险和用户门槛都高

**结论**：API 路径在当前阶段**无法作为主要方案**。适合作为辅助手段（如获取 ChatGPT 网页端对话列表后配合插件逐条导出）。

### 路径 D：官方邮件导出 + Gmail 自动化（批量归档方案 ✅）

**原理**：利用 ChatGPT / Claude 的官方"导出全部数据"功能（发送下载链接到邮箱），再通过 Gmail 自动化机制（Apps Script / Pub/Sub）自动下载、解析、归档。

#### 各平台邮件导出能力

| 平台 | 导出入口 | 邮件内容 | 格式 | 时效 |
|------|----------|----------|------|------|
| **ChatGPT** | Settings → Data Controls → Export Data | 邮件包含下载链接 | ZIP（内含 JSON） | 链接 24 小时有效 |
| **Claude** | Settings → Privacy → Export Data | 邮件包含下载链接 | ZIP（内含 JSON） | 链接 24 小时有效 |

**关键发现**：
- 两个平台都支持全量导出，且都是发邮件给用户
- 导出的是**结构化 JSON 数据**，比 DOM 抓取更完整、更准确
- **但都没有定时自动导出功能**，需要用户手动触发
- ChatGPT 有一个 Chrome 插件 `ChatGPT-Exporter`（by Kirito-Elucidator）支持**定时提醒导出**，但本质是提醒用户手动操作

#### Gmail 自动化机制（3 种层级）

**层级 1：Gmail Filter + Google Apps Script（推荐 ✅ 最简方案）**

完全免费，无需服务器，直接在 Google 生态内闭环。

```
工作流：
1. Gmail Filter：自动给来自 noreply@openai.com / no-reply@anthropic.com 的邮件打标签（如 "ChatExport"）
2. Google Apps Script（定时触发）：
   - 搜索带 "ChatExport" 标签的未读邮件
   - 提取邮件中的下载链接
   - 自动下载 ZIP 文件到 Google Drive
   - 解析 JSON → 转换为 Markdown / 整理到指定目录
   - 标记邮件为已处理
3. （可选）Google Drive 同步到本地 → 自动进入 Obsidian Vault
```

核心 Apps Script 代码思路：
```javascript
function processChatExports() {
  var label = GmailApp.getUserLabelByName("ChatExport");
  var threads = label.getThreads();
  threads.forEach(function(thread) {
    var messages = thread.getMessages();
    messages.forEach(function(message) {
      var body = message.getPlainBody();
      var downloadUrl = extractDownloadUrl(body);
      if (downloadUrl) {
        var blob = UrlFetchApp.fetch(downloadUrl).getBlob();
        var folder = DriveApp.getFolderById("TARGET_FOLDER_ID");
        folder.createFile(blob);
      }
    });
    thread.removeLabel(label);
  });
}
```

已有开源项目可直接参考：
- `attach-gmail-google-script`：完整的 Gmail 附件自动同步到 Google Drive 方案（含 UI 配置面板）
- `AutomateGmailAttachment`：按发件人过滤 + 自动保存附件到 Drive

**层级 2：Gmail API + Cloud Pub/Sub（实时推送）**

适合需要实时响应的场景（收到导出邮件后立即处理）。

```
工作流：
1. Google Cloud Console 创建 Pub/Sub Topic
2. Gmail API watch() 订阅邮箱变更
3. 新邮件到达 → Pub/Sub 推送到 Webhook
4. Webhook 服务下载 ZIP → 解析 → 存储到目标位置
```

注意：`watch()` 订阅每 **7 天过期**，需要定时续期（可用 Cloud Scheduler 自动化）。

**层级 3：Gmail API + 自建后端服务**

完全自主控制，适合需要复杂处理逻辑的场景。但需要自建服务器，成本最高。

#### 路径 D 的优缺点

| 优点 | 缺点 |
|------|------|
| 数据最完整（官方全量导出，JSON 结构化） | 平台不提供定时自动导出，需手动触发 |
| 不依赖 DOM 选择器，不受前端改版影响 | 导出链接 24 小时过期，需要及时处理 |
| 利用 Gmail 原生机制，零额外成本 | 数据有延迟（不是实时的） |
| Gmail Filter + Apps Script 方案完全免费 | 只能全量导出，不能选择性导出单条对话 |
| 适合做定期备份/归档 | 需要登录平台手动点 Export |

#### 如何解决"手动触发导出"的问题？

| 方案 | 实现方式 | 自动化程度 |
|------|----------|------------|
| **定时提醒** | Chrome 插件或 Calendar 提醒用户去点 Export | 半自动（提醒但需手动操作） |
| **Chrome 插件自动点击** | 插件检测到用户在 ChatGPT/Claude 设置页时，自动点击 Export 按钮 | 半自动（需用户打开页面） |
| **Playwright 定时任务** | 用 Playwright 模拟登录 → 导航到 Export 页面 → 点击导出 | 全自动（但有反爬风险） |
| **手动周期性导出** | 用户每周/月自己手动导出一次 | 全手动（但最简单） |

### 四条路径总结

| | Chrome 插件 | Playwright | 官方 API | 邮件导出 + Gmail 自动化 |
|---|---|---|---|---|
| **用户体验** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **实现成本** | 中 | 中高 | 低（但受限） | 低（Apps Script） |
| **维护成本** | 中（选择器更新） | 高（反爬+选择器） | 低（但 API 可能变） | 极低（官方接口稳定） |
| **数据完整性** | 高（当前页面） | 高（可批量） | 取决于 API | ⭐⭐⭐⭐⭐ 最完整（全量 JSON） |
| **隐私安全** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |
| **实时性** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐（手动触发+延迟） |
| **适合场景** | 日常单条导出 | 一次性批量 | 辅助/补充 | **定期全量归档** |
| **推荐度** | ✅ 主方案（日常） | ⚠️ 备选 | ⚠️ 辅助 | ✅ 主方案（批量归档） |

---

## 3. 技术栈选型

### 3.1 Next.js + shadcn-ui？

**不推荐 ❌**

Next.js 是一个**全栈 Web 应用框架**，它的核心能力是 SSR/SSG/ISR + API Routes。Chrome 插件不需要任何这些能力：
- 插件没有服务端渲染需求
- 插件不需要文件系统路由
- Next.js 打包体积大（最小也在几百 KB），会拖慢插件加载
- shadcn-ui 本身可以在任何 React 项目中使用，不绑定 Next.js

### 3.2 Chrome 插件专用框架对比

| 框架 | 定位 | Stars | 核心特点 | 适合度 |
|------|------|-------|----------|--------|
| **Plasmo** | "Next.js for browser extensions" | ~10k | React + TS 一等支持、自动 manifest 生成、HMR 热更新、Content Script UI 注入 | ⭐⭐⭐⭐⭐ |
| **WXT** | 跨浏览器扩展框架 | ~5k | 文件路由、跨浏览器（Chrome/Firefox/Safari/Edge）、TS 深度集成、Vite 构建 | ⭐⭐⭐⭐ |
| **CRXJS** | Vite 插件 | ~3k | 轻量、与 Vite 深度集成、HMR | ⭐⭐⭐ |
| **原生** | 无框架 | — | 零依赖、最轻量、但开发效率低 | ⭐⭐ |

### 3.3 推荐技术栈

#### 方案一：Plasmo + React + shadcn-ui + TailwindCSS（推荐 ✅）

```
Plasmo (框架)
  ├── React + TypeScript (UI + 逻辑)
  ├── shadcn-ui + TailwindCSS (组件库 + 样式)
  └── tRPC-Chrome (类型安全的插件内部通信)
```

**为什么选 Plasmo**：
- 社区最活跃、文档最完善的 Chrome 插件框架
- 开箱即用的 Content Script UI（可以在页面上注入 React 组件）
- 自动生成 `manifest.json`，无需手动维护
- 支持热更新，开发体验接近 Web 开发
- 已有成熟的 `plasmo-shadcn-trpc` starter template 可直接使用

**为什么还用 shadcn-ui**：
- shadcn-ui 不是 Next.js 专属的，它是纯 React 组件，可以在任何 React 项目中使用
- Plasmo 项目中可以直接 `npx shadcn-ui@latest add button` 添加组件
- 提供统一的、高质量的 UI 组件，适合做导出面板、设置页等

#### 方案二：WXT + Vue/Svelte（如果偏好更轻量）

WXT 比 Plasmo 更轻量，跨浏览器支持更好，但社区和生态略小。如果你不需要 React 生态，WXT + Vue 或 WXT + Svelte 是更轻量的选择。

#### 方案三：原生 JavaScript（极简方案）

如果只是做一个 MVP 验证，直接用原生 JS 写 Content Script + Popup 即可。不需要任何框架。参考 GitHub 上的 `llm-chat-export-extension` 项目，核心代码不到 200 行。

### 3.4 技术栈总结

| | Plasmo + shadcn | WXT + Vue/Svelte | 原生 JS |
|---|---|---|---|
| **开发效率** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| **包体积** | 中（~200KB） | 小（~100KB） | 极小（~10KB） |
| **可维护性** | 高 | 高 | 低 |
| **UI 质量** | 高（shadcn） | 中 | 低（手写 CSS） |
| **适合阶段** | 正式产品 | 轻量产品 | MVP 验证 |

---

## 4. 核心实现思路（Chrome 插件方案）

### 4.1 架构设计

```
┌─────────────────────────────────────────────────────────────┐
│                    Chrome Extension                          │
│                                                             │
│  ┌─────────────┐    ┌──────────────┐    ┌───────────────┐  │
│  │   Popup     │    │  Background  │    │   Content     │  │
│  │   (React)   │◄──►│   Service    │◄──►│   Script      │  │
│  │             │    │   Worker     │    │               │  │
│  │ - 导出按钮  │    │ - 消息路由   │    │ - DOM 解析    │  │
│  │ - 格式选择  │    │ - 文件下载   │    │ - 平台适配    │  │
│  │ - 设置页    │    │ - 数据转换   │    │               │  │
│  └─────────────┘    └──────────────┘    └───────────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Platform Adapters                       │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │   │
│  │  │ ChatGPT  │  │  Claude  │  │  Gemini  │  ...     │   │
│  │  │ Adapter  │  │  Adapter │  │  Adapter │          │   │
│  │  └──────────┘  └──────────┘  └──────────┘          │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 各平台 DOM 解析要点

#### ChatGPT (`chatgpt.com`)
- 对话列表：侧边栏的会话链接，每条包含标题和时间
- 单条对话：`[data-message-author-role]` 属性区分 user / assistant
- 内容节点：消息体中的 `.markdown` 类包含渲染后的内容
- 特殊内容：Canvas / Artifact 引用需要额外处理

#### Claude (`claude.ai`)
- 对话列表：侧边栏的会话链接
- 单条对话：`div[data-is-streaming]` 的父元素中，按 `font-style` 或特定 class 区分 human / assistant
- 内容节点：消息体中的 prose 容器
- 注意：Claude 的 DOM 变动比 ChatGPT 更频繁

### 4.3 导出格式

| 格式 | 用途 | 实现难度 |
|------|------|----------|
| **Markdown** | 笔记归档、Obsidian 导入 | 低 |
| **JSON** | 数据分析、二次处理 | 低 |
| **TXT** | 最简通用格式 | 极低 |
| **HTML** | 保留原始样式 | 中 |
| **PDF** | 打印分享 | 高（需引入 html2pdf 库） |

建议 MVP 先支持 Markdown 和 JSON，后续按需扩展。

---

## 5. 已有竞品参考

| 产品 | 支持平台 | 导出格式 | 特点 |
|------|----------|----------|------|
| **Chat Conversation Exporter** | ChatGPT / Gemini / Claude | PDF / HTML / MD / JSON | 功能最全，Beta 免费 |
| **AI Chat Transcript Downloader** | ChatGPT / Claude | Markdown | 极简（35KB），100% 本地处理 |
| **GPTBLOX** | ChatGPT / Gemini / Claude / Poe / HuggingChat | HTML / TXT / PDF / PNG | 功能最丰富，含图片下载、分组管理 |
| **LLM Conversation Exporter** | ChatGPT / Claude / Gemini / Grok | TXT | 开源 MIT，代码最简洁 |

**差异化机会**：
1. **多格式 + 自定义模板**：支持用户自定义导出模板（如 Obsidian 笔记格式、Notion 格式）
2. **批量导出**：一次性导出所有历史对话（当前竞品大多只支持导出当前对话）
3. **本地知识库集成**：导出后自动写入 Obsidian Vault / Logseq 等本地知识库
4. **对话搜索**：建立本地索引，跨平台搜索所有历史对话
5. **标签与分类**：对导出的对话自动打标签、分类

---

## 6. 建议实施路径

### Phase 1：MVP（1-2 周）
- 使用 **Plasmo + React + shadcn-ui** 搭建基础框架
- 实现 ChatGPT 单条对话导出（Markdown 格式）
- 实现 Claude 单条对话导出（Markdown 格式）
- Popup 界面：平台检测 + 导出按钮 + 格式选择

### Phase 2：增强（2-4 周）
- 支持 JSON / TXT 等更多导出格式
- 支持批量导出（利用 ChatGPT `backend-api/conversations` 列表）
- 添加导出模板系统（Obsidian 格式等）
- 支持更多平台（Gemini / Grok）

### Phase 3：差异化（4-8 周）
- 本地知识库自动写入（Obsidian Vault 集成）
- 对话全文搜索（基于本地 IndexedDB）
- 对话标签与分类系统
- 与 OS Tooling 整合（截图 → 对话 → 知识库的完整链路）

---

## 7. 风险与注意事项

| 风险 | 影响 | 应对策略 |
|------|------|----------|
| **DOM 选择器失效** | 平台更新后插件不可用 | 抽象适配层，快速定位并更新选择器；关注社区动态 |
| **平台反自动化** | 插件被检测或封禁 | Content Script 方式天然在用户浏览器内运行，风险极低 |
| **隐私合规** | 用户数据泄露 | 所有数据处理在本地完成，不发送任何网络请求 |
| **竞品替代** | 已有多款类似插件 | 聚焦差异化（知识库集成、批量导出、搜索） |

---

## 8. 最终建议

**推荐双轨并行策略：Chrome 插件（日常） + 邮件导出自动化（批量归档）。**

### 日常使用：Chrome 插件 + Plasmo

理由：
1. **Chrome 插件是唯一能同时满足"日常使用"和"低门槛"的路径**。Playwright 适合一次性任务，API 路径受限严重。
2. **Plasmo 是当前最成熟的 Chrome 插件开发框架**，React + shadcn-ui 的组合可以快速构建高质量 UI。
3. **MVP 可以极简**：参考开源的 `llm-chat-export-extension`（200 行代码），核心功能不复杂。

### 批量归档：邮件导出 + Gmail Apps Script

理由：
1. **数据最完整**：官方全量 JSON 导出，比 DOM 抓取更准确（包含元数据、时间戳、编辑历史等）。
2. **维护成本极低**：不依赖 DOM 选择器，不受前端改版影响。
3. **Gmail Filter + Apps Script 方案完全免费**，无需服务器，Google 生态内闭环。
4. **已有成熟开源方案**可直接复用（`attach-gmail-google-script` 等）。

### 理想工作流

```
日常（实时）：
  用户在 ChatGPT/Claude 聊天 → Chrome 插件一键导出当前对话 → Markdown → Obsidian

定期（批量）：
  用户每周手动触发一次 Export Data → 邮件发到 Gmail
  → Gmail Filter 自动打标签
  → Apps Script 定时检查 → 下载 ZIP → 解析 JSON → 全量同步到 Obsidian
  → 增量对比，只导入新增/变更的对话
```

4. **差异化空间大**：现有竞品都停留在"导出"这一步，没有人做"导出 → 知识库 → 搜索"的完整链路。

---

*分析时间：2026-04-15*
*数据来源：Chrome Web Store、GitHub、OpenAI/Anthropic 官方文档、社区论坛*
