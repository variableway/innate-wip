# Blog 系统更新路径与 Plugin 模式验证分析

- **Status**: analysis（结论供后续 refine 任务引用）
- **Created**: 2026-08-31
- **Scope**: blog（writing）系统演进路径 + plugin 模式验证方法
- **Related**: `docs/solution/plugin-mode.md`、`docs/solution/micro-frontend-research.md`、`task/project/plugin-mode/`

---

## 总体结论（TLDR）

本仓库的 CMS 化路径已经明确：**不引入 Micro-Frontend 框架，Plugin 模式 = App Shell + 构建期 Registry + route/iframe 两种加载方式**（调研结论见 `docs/solution/micro-frontend-research.md`，理由：static export 与 runtime 编排根本冲突，且主题间几乎无交互）。当前进度：

- **P0–P1 已落地**：`apps/web/lib/site-features.ts` 特性开关 + `apps/web/lib/plugins/registry.ts` 注册表，sidebar / header / home 三处均改为消费 `getEnabledPlugins()`
- **blog（writing）系统本身已完整可用**：markdown/MDX 文件 + frontmatter → 构建期渲染 → 静态导出 + RSS
- **plugin 模式只完成了一半**：writing / collections / feed 三个核心主题仍在 sidebar/header 硬编码（T01–T05 全部 todo），iframe 宿主路由（P3/T04）未实现。因此"验证 plugin 模式"目前只能验证 registry 这一半，另一半需先完成 T01/T04

另发现两个现存问题（§3.4）：`betterstackGuides` 与 `feed` 两个 flag 是死开关——已定义但 registry 未引用。

---

## 一、Blog 系统如何更新

当前 blog 的数据流是纯 file-based、构建期完成：

```
content/writing/*.md(x) + frontmatter
    → lib/content/loader.ts    (fs 读取, react cache)
    → lib/content/parser.ts    (gray-matter + unified/remark 管线)
    → app/writing/page.tsx     (列表, Server Component)
    → app/writing/[slug]/page.tsx (详情, MDX 走 @mdx-js/mdx evaluate)
    → app/rss.xml/route.ts     (RSS)
    → app/layout.tsx           (command palette 搜索数据)
```

更新分三个层次，成本与影响面递增：

### 1. 内容更新（日常写文章，零代码）

在 `apps/web/content/writing/` 放 `.md` 或 `.mdx` 文件。frontmatter 契约由 `apps/web/lib/content/types.ts` 的 `PostMeta` 定义：

| 字段 | 必填 | 说明 |
|------|------|------|
| `title` / `slug` / `date` / `author` | 是 | slug 缺省用文件名 |
| `category` / `tags` | 是 | 缺省 `article` / `[]` |
| `status` | 否 | `published` / `draft` / `archived`，**天然的 CMS 草稿机制**——列表、RSS、`generateStaticParams` 均过滤 status |
| `excerpt` / `cover` / `featured` / `editorsPick` / `readingTime` / `updated` | 否 | readingTime 缺省自动估算（200 词/分钟） |

推送后 CI（`.github/workflows/deploy-pages.yml`）自动 `build:static` 产出全静态站点。当前 CMS 的"发布工作流"即：**Git 是编辑器，PR 是审核流**。

### 2. 功能更新（演进 blog 能力）

修改 `apps/web/lib/content/`（数据层）与 `apps/web/components/writing/`（交互层），不动 shell。例如分类页、归档、评论、双语。数据层扩展点集中在 `getWritingMeta()` 的 filter/sort/limit 参数上，边界干净。

### 3. 架构更新（blog 迁入 plugin registry —— 当前最该做的）

对应 T01/T02，做完后 blog 才真正成为"可插拔的主题"。步骤（详见 `task/project/plugin-mode/tasks/T01-unify-registry-content-themes.md`）：

1. `lib/site-features.ts` 增加 `writing` / `collections` / `feed` 三个 flag（默认 `true` 保持现状）
2. `lib/plugins/registry.ts` 增加三个插件条目（`loadMode: "route"`），manifest 携带 nav + homeTile
3. 处理分组：现在 sidebar 是"Content / Feed 硬编码 section + plugins section"两层结构，需给 manifest 增加可选 `nav.group` 字段，或直接靠 `order` 排序
4. 删除 `apps/web/components/sidebar.tsx:140-208` 与 `apps/web/components/header.tsx:74-101` 的硬编码 JSX
5. 首页 `apps/web/app/page.tsx:91-116` 的 writing/collections/feed 三张 bento 卡同样硬编码，一并改走 `getEnabledHomeTiles()`

配套 T02 解决两个边界泄漏：

- `apps/web/app/feed/[slug]/page.tsx` 与 `apps/web/app/writing/[slug]/page.tsx` 的 MDX 渲染管线近乎逐行重复 → 抽成共享的文章详情组件
- `apps/web/app/layout.tsx:28` shell 直接 `getWritingMeta()` 喂搜索 → 改为 registry 声明 `searchData` 回调，shell 不感知具体主题

### 4. CMS 化的进一步选项（建议）

| 选项 | 说明 | 评估 |
|------|------|------|
| **file-based + 编辑器层** | content 目录 + frontmatter 已是完整内容模型，后续接 Decap CMS / TinaCMS 这类 git-based 编辑器 | ✅ 推荐：零迁移成本，static export 不受影响 |
| 远程 headless CMS | Contentful 等 | ❌ 破坏"数据即仓库"现状，引入构建期 API 拉取，除非多人协作 |
| 自建管理界面 | 需要服务端 | ❌ static export 下不可行，除非放弃静态改 SSR（与调研结论冲突） |

建议顺序：**先完成 T01/T02 让 blog 插件化（纯重构、零新依赖），CMS 编辑层作为独立后续决策**。

---

## 二、Plugin 模式如何验证

验证分两块：已实现的 registry 部分现在即可验证；未实现部分需先完成对应任务。

### 2.1 现在就能验证的（P0–P1）

**准备环境**（本机未装依赖时）：

```bash
cd innate-wip
pnpm link:packages && pnpm install
```

**验证 A：翻转开关 → UI 变化，零 JSX 修改**（plugin 模式的核心承诺）

1. `pnpm dev` 启动，确认当前 sidebar 只有 Content / Feed 两个 section（making/cheatsheets/awesome 均为关闭态）
2. 编辑 `lib/site-features.ts` 将 `making: true`，热更新后 sidebar / header dropdown / 首页 bento 应出现 Making section（projects / weekly / insights / issues 四项）
3. 改回 `making: false`，全部消失
4. **关键断言**：整个过程 `sidebar.tsx` / `header.tsx` / `page.tsx` 一行未改——这是 plugin 模式的验收标准，亦写在 `docs/solution/plugin-mode.md` 的 Acceptance Criteria

**验证 B：禁用后直达 URL 仍可用**（设计允许的兜底行为）

`making: false` 状态下直接访问 `http://localhost:3000/making/projects` 应正常渲染。plugin 只控制"导航可见性"，不删除路由。

**验证 C：静态导出构建**

```bash
pnpm --filter @innate/web build:static
ls apps/web/dist
```

这是 `plugin-mode.md` 中唯一未勾选的验收项（"Static export build still succeeds"）。CI 上每次推 main 都会跑，等于已有自动化兜底；但本地建议每次翻转 flag 后跑一次，尤其注意 disabled plugin 的页面在 static export 下是否仍被生成。

### 2.2 需先完成任务才能验证的部分

| 想验证什么 | 前置任务 | 阻塞点 |
|-----------|---------|--------|
| writing/collections/feed 也是插件（翻转 `siteFeatures.writing = false` 后导航消失） | T01 | sidebar/header/home 三处硬编码 |
| feed 与 writing 详情页渲染一致性 | T02 | 两处重复的 MDX 管线 |
| betterstack 内容包规范化读取 | T03 | `lib/betterstack/data.ts` 跨包相对路径 fs 读 |
| iframe 插件真正可加载 | T04 | `app/plugins/[pluginId]/page.tsx` 未实现；**已知阻塞：Next 16 static export 下 `generateStaticParams` 返回空数组会构建报错**，任务给出 fallback 方案（无 iframe 插件时生成 `__none__` 空态页），需实测 |
| 全量验收（逐个翻转所有 flag + 抽查每个主题列表页/详情页） | T05 | 依赖 T01–T04 |

### 2.3 建议补一个自动化验证脚本

当前验证全靠人工翻转 flag + 肉眼观察。建议新增 `apps/web/scripts/verify-plugins.mjs`，做三类机器断言并挂进 CI：

1. **契约一致性**：registry 里每个插件 `enabled` 与 site-features 对应 flag 一致；`loadMode: "iframe"` 的插件必须有 `iframeSrc`；nav item 的 `href` 非空且不重复
2. **无硬编码回归**：grep sidebar/header/home 中不出现 `/writing|/collections|/feed|/making` 等主题路径（T01 验收条件本身即如此定义）
3. **flag 覆盖率**：`site-features` 中每个 key 都被 registry（或明确豁免的 shell 逻辑）引用——可立刻抓到 §3.4 的死 flag 问题

### 2.4 验证中应发现的现存问题

分析中确认的两个 flag 与 registry 脱节：

- **`siteFeatures.betterstackGuides` 是死开关**：`apps/web/lib/site-features.ts:18` 定义了它，但 `registry.ts` 只引用 `making` / `cheatsheets` / `awesome` 三个 flag。Better Stack Guides 入口挂在 cheatsheets 插件 nav 第二项（`registry.ts:73-78`），受 `cheatsheets` 开关控制——单独翻转 `betterstackGuides` 无任何效果
- **`siteFeatures.feed` 同样未被引用**：只有 `content` 在 `layout.tsx:40` 用于搜索数据，`feed` 无任何消费方

这正说明需要 §2.3 的自动化断言：registry 与 flag 的映射目前靠人肉维护，T01 引入更多 flag 后脱节概率只会更高。

---

## 三、建议的行动顺序

1. **先修死 flag**（约半小时）：要么让 cheatsheets 插件拆出 betterstack 子开关，要么删除 `betterstackGuides` / `feed` 两个无用 flag
2. **做 T01**（blog 插件化，纯重构）：这是"blog 系统更新"与"plugin 模式完善"的交汇点，做完两边同时受益
3. **做 T02**：feed/writing 渲染去重 + shell 依赖收敛，blog 的插件边界才算干净
4. **T04 验证 iframe 宿主**时优先实测 Next 16 空 params 的 fallback 方案——这是唯一有技术不确定性的点
5. **T05 收尾**时把 verify-plugins 脚本挂进 CI，之后每次翻转 flag 都有机器兜底
