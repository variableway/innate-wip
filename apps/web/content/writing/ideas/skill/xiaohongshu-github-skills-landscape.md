# 小红书 GitHub Skill/MCP 生态全景：热点、关键词、Skill 三维度盘点

> 从数据采集到内容运营，从热点追踪到自动化发布：10 个高价值开源 Skill/MCP 仓库

---

## 一、盘点维度说明

本报告从三个核心维度筛选和分类 GitHub 上的小红书相关 Skill/MCP 仓库：

- **热点（Trending）**：能否追踪平台热点、推荐流、话题趋势
- **关键词（Keyword）**：能否基于关键词搜索、提取、分析笔记内容
- **Skill**：是否以 Agent Skill / MCP Server 形式存在，可被 Claude Code / OpenClaw / Cursor 等 AI Agent 直接调用

---

## 二、10 个高价值开源仓库

### 1. autoclaw-cc/xiaohongshu-skills
**定位**：小红书自动化 Skills 集合（浏览器扩展 + Agent Skill）

| 维度 | 能力 |
|------|------|
| **热点** | `xhs-explore` 技能支持首页推荐流浏览、内容发现；`xhs-content-ops` 支持热点追踪 |
| **关键词** | `xhs-explore` 支持关键词搜索、笔记详情、用户主页抓取 |
| **Skill** | ✅ 原生 Skill，兼容 OpenClaw / Claude Code / 所有支持 `SKILL.md` 的 Agent |

**核心技能矩阵**：
- `xhs-auth`：扫码/验证码登录
- `xhs-publish`：图文/视频/长文发布、定时发布
- `xhs-explore`：关键词搜索、笔记详情、用户主页、首页推荐
- `xhs-interact`：评论、回复、点赞、收藏
- `xhs-content-ops`：竞品分析、热点追踪、批量互动、内容创作

**特色**：使用真实浏览器环境和账号 Cookie，Agent 可用自然语言下达复合指令（如"搜索刺客信条最火的图文帖子，收藏它，然后告诉我讲了什么"）。

---

### 2. Xiangyu-CAS/xiaohongshu-ops-skill
**定位**：小红书自动运营 Skill（分析 → 选题 → 创作 → 复盘 → 复刻）

| 维度 | 能力 |
|------|------|
| **热点** | ✅ 首页推荐流分析：解析高赞笔记的传播钩子和内容结构；选题灵感结合平台热点输出 |
| **关键词** | 账号分析时会提取不同笔记的关键词表现差异 |
| **Skill** | ✅ OpenClaw Skill，基于 CDP 浏览器自动化 |

**核心能力**：
1. **首页推荐流分析**：分析为什么这些高赞笔记被推荐给你，提取可复用的标题骨架
2. **账号分析**：分析账号定位、笔记表现差异、为什么有些笔记点赞明显更高
3. **选题灵感**：结合知识库和账号定位，产出 5 条可直接发布的选题
4. **知识库沉淀**：分析结果自动保存为 markdown（`knowledge-base/patterns/`、`knowledge-base/topics/`）
5. **自动发布**：生成封面并上传，填写正文/标题
6. **爆款复刻**：输入爆款笔记链接，自动分析并发布相似笔记
7. **自动回复评论**：通知评论逐个回复

**特色**：这是一个**完整的运营闭环 Skill**，不只是数据采集，而是把「分析-决策-执行-沉淀」串起来了。

---

### 3. DeliciousBuding/xiaohongshu-skill
**定位**：小红书基础数据提取 Skill（Python + Playwright）

| 维度 | 能力 |
|------|------|
| **热点** | 通过推荐流和搜索结果间接获取热点内容 |
| **关键词** | ✅ 基于关键词搜索笔记、提取帖子详情、用户主页 |
| **Skill** | ✅ 兼容 Claude Code 和 OpenClaw，遵循 AgentSkills 开放规范 |

**核心功能**：
- 搜索笔记（关键词驱动）
- 帖子详情提取（标题、内容、图片、互动数据）
- 用户主页提取
- 基于 Cookie 的登录状态维持

**特色**：代码轻量、结构清晰，适合作为**二次开发的基础模板**。如果你的目标是快速搭建一个「关键词监控 Skill」，这是最佳起点。

---

### 4. autoclaw-cc/xiaohongshu-mcp-skills
**定位**：基于 xiaohongshu-mcp 的 Agent Skills 集合

| 维度 | 能力 |
|------|------|
| **热点** | `xhs-content-plan` 提供热门分析、竞品研究、选题建议 |
| **关键词** | `xhs-search` 支持多维度关键词搜索 |
| **Skill** | ✅ 兼容 Agent Skills 开放标准，支持 OpenClaw / Claude Code |

**技能矩阵**：
- `setup-xhs-mcp`：安装部署 xiaohongshu-mcp 服务
- `xhs-login`：扫码登录、状态检查
- `post-to-xhs`：发布图文/视频笔记
- `xhs-search`：关键词搜索笔记
- `xhs-explore`：浏览推荐流、查看详情和评论
- `xhs-interact`：点赞、收藏、评论、回复
- `xhs-profile`：查看用户主页和作品
- `xhs-content-plan`：**热门分析、竞品研究、选题建议**

**特色**：这是 #1 的 MCP 底层版本，更强调「服务部署 + Skill 调用」的分层架构。

---

### 5. zhjiang22/openclaw-xhs
**定位**：XHS AI Toolkit（趋势追踪 + MCP + Memory Export）

| 维度 | 能力 |
|------|------|
| **热点** | ✅ `track-topic.sh` 自动搜索 trending posts 并生成分析报告 |
| **关键词** | ✅ 支持按关键词搜索帖子 |
| **Skill** | ✅ MCP 集成，可被 AI assistants 调用 |

**核心功能**：
- **Trend Tracking**：`./track-topic.sh "AI" --limit 10 --output report.md` 自动生成话题报告（含互动数据分析）
- **MCP Integration**：搜索、浏览、评论 via AI assistants
- **Memory Export**：将点赞/收藏帖子转换为 Markdown，构建 AI-searchable 知识库
- **Long Image Export**：导出笔记为带注释的长图

**特色**：**趋势追踪能力非常突出**，适合想要「用数据驱动内容选题」的创作者。

---

### 6. yangsijie666/rednote-crawler
**定位**：小红书数据采集框架 + MCP Server（生产级）

| 维度 | 能力 |
|------|------|
| **热点** | 通过推荐流和关键词搜索捕获热点内容 |
| **关键词** | ✅ 关键词搜索 + 无限滚动自动加载 |
| **Skill** | ✅ 标准 MCP Server，可被 Claude Desktop / Code / Cursor 直接调用 |

**核心能力**：
- **MCP Server**：AI assistants 可直接搜索小红书、采集笔记详情和评论
- **关键词搜索**：支持无限滚动自动加载
- **笔记详情采集**：标题、内容、互动数据、标签、图片/视频
- **评论采集**：Top N 评论（含用户信息和 IP 属地）
- **双层反检测**：playwright-stealth + browserforge
- **持久登录状态**：扫码登录后自动保存 Cookie
- **输出格式**：JSON（原始）+ Excel/xlsx（3-sheet 结构化）

**特色**：**工程化程度最高**，有超时控制、浏览器崩溃自动恢复、登录过期检测。适合需要稳定跑长期监控任务的场景。

---

### 7. mcp-smart-crawler (erikloo)
**定位**：MCP Smart Crawler（小红书专用网页爬取 MCP Server）

| 维度 | 能力 |
|------|------|
| **热点** | 可爬取小红书公开帖子，间接分析热点 |
| **关键词** | 基于分享链接或页面提取内容，非原生关键词搜索 |
| **Skill** | ✅ MCP Server，可被 Claude Desktop 等调用 |

**核心功能**：
- 提取小红书帖子元数据（标题、描述、图片）
- 下载视频和图片
- 基于 Playwright 的浏览器自动化

**安装方式**：`npx -y mcp-smart-crawler`

**特色**：**零配置、一键启动**，适合快速验证想法，但不适合大规模数据采集。

---

### 8. xhs-mcp (derekluo)
**定位**：XiaoHongShu CLI and MCP Server

| 维度 | 能力 |
|------|------|
| **热点** | 支持浏览首页推荐流 |
| **关键词** | ✅ 支持关键词搜索笔记 |
| **Skill** | ✅ 标准 MCP Server + CLI 双模式 |

**核心功能**：
- 关键词搜索笔记
- 笔记详情获取
- 用户主页信息
- 内容发布（图文）
- 持久 Cookie 管理

**标签**：`xiaohongshu`, `xhs`, `mcp`, `model-context-protocol`, `automation`, `puppeteer`, `cli`, `social-media`, `content-publishing`

**特色**：**CLI 和 MCP 双入口**，既可以直接命令行使用，也可以嵌入到 Claude/Cursor 中。

---

### 9. Ramun-123/all-in-one-rednote-xiaohongshu-scraper
**定位**：一体化 RedNote 爬虫（Search / Comment / Profile / UserPosts）

| 维度 | 能力 |
|------|------|
| **热点** | 搜索模式可捕获热点帖子 |
| **关键词** | ✅ 支持 keyword-based search scraping |
| **Skill** | ❌ 非 Skill/MCP，是独立 Python 爬虫框架 |

**核心模式**：
- `search_mode.py`：关键词搜索
- `comment_mode.py`：评论采集
- `profile_mode.py`：用户主页
- `user_posts_mode.py`：用户所有帖子

**输出字段**：keyword, item.id, note_card.display_title, user.nickname, interact_info.liked_count, cover.url_default, comment.content 等

**特色**：虽然**不是 Skill/MCP**，但它是**最完整的独立爬虫框架之一**，适合作为 Skill 开发的数据层底座。如果你的目标是自建一个小红书分析 pipeline，这是很好的参考实现。

---

### 10. coralr-1/Xiaohongshu-AIGC-Sentiment-Analysis
**定位**：小红书 AIGC 评论情感分析

| 维度 | 能力 |
|------|------|
| **热点** | 可结合时间序列分析热点话题的情感走向 |
| **关键词** | 基于已有数据集做关键词关联的情感分析 |
| **Skill** | ❌ 非 Skill，是学术研究型 Jupyter Notebook 项目 |

**核心功能**：
- 清洗评论数据
- 使用 SnowNLP 进行情感分析
- 结合帖子信息进行数据可视化
- 分析评论情感分布与点赞数的关系

**特色**：**情感分析算法层**的参考实现。如果你要在 Skill 中增加「评论区情感判断」能力，可以直接借鉴这里的 SnowNLP + pandas + matplotlib 分析模式。

---

## 三、按使用场景快速选型

### 场景 A：我想让 AI Agent 自动帮我运营小红书账号
**推荐组合**：
1. `Xiangyu-CAS/xiaohongshu-ops-skill`（运营闭环：分析 → 选题 → 发布 → 复盘）
2. `autoclaw-cc/xiaohongshu-skills`（浏览器扩展方案，更稳定地模拟真人操作）

### 场景 B：我想监控某个关键词/话题在小红书上的热度
**推荐组合**：
1. `zhjiang22/openclaw-xhs`（`track-topic.sh` 自动生成趋势报告）
2. `yangsijie666/rednote-crawler`（生产级 MCP，稳定采集大量数据）
3. `Ramun-123/all-in-one-rednote-xiaohongshu-scraper`（独立爬虫，自由定制）

### 场景 C：我想基于小红书数据做情感分析/舆情研究
**推荐组合**：
1. `yangsijie666/rednote-crawler`（获取结构化数据）
2. `coralr-1/Xiaohongshu-AIGC-Sentiment-Analysis`（情感分析算法参考）

### 场景 D：我想快速搭建一个 Claude/Cursor 能调用的小红书 Skill
**推荐组合**：
1. `DeliciousBuding/xiaohongshu-skill`（最轻量的 Skill 模板）
2. `autoclaw-cc/xiaohongshu-mcp-skills`（完整的 MCP + Skill 分层架构）
3. `xhs-mcp` (derekluo)（CLI + MCP 双入口，功能完整）

---

## 四、关键技术趋势观察

### 趋势 1：从「爬虫脚本」到「MCP Server/Agent Skill」
早期的小红书工具多是独立的 Python 爬虫（如 `Spider_XHS`、`XHS-Downloader`）。2025-2026 年的新趋势是：**所有工具都在 MCP 化或 Skill 化**，成为 AI Agent 的可调用能力单元。

### 趋势 2：从「数据采集」到「运营闭环」
最新的 Skill（如 `xiaohongshu-ops-skill`）不再满足于「爬取数据」，而是把**分析 → 决策 → 内容生成 → 发布 → 互动 → 沉淀知识库**整个链路串起来。

### 趋势 3：「热点追踪」成为标配能力
几乎所有新出现的 Skill 都包含某种形式的 trending/topic tracking。这说明：**在内容过剩的时代，「知道发什么」比「怎么发」更有价值。**

### 趋势 4：反检测技术成为基础设施
`playwright-stealth`、`browserforge`、`CDP 浏览器扩展`、` residential proxy` 等技术被频繁集成。小红书的反爬机制在升级，工具链也在同步军备竞赛。

---

## 五、如果你是开发者，如何加入这个生态？

### 路径 1：封装现有爬虫为 MCP Server
如果你已经有一个稳定的小红书爬虫，最快的参与方式是：
- 用 `FastMCP` 或 `mcp` SDK 将其封装为 MCP Server
- 定义清晰的 tool schema（搜索、详情、评论、发布）
- 发布到 npm/PyPI 并在 GitHub 开源

### 路径 2：基于现有 Skill 做垂直场景扩展
- 在 `DeliciousBuding/xiaohongshu-skill` 基础上增加「竞品监控 Skill」
- 在 `zhjiang22/openclaw-xhs` 基础上增加「情感趋势报告生成」

### 路径 3：补齐「分析层」工具
当前生态中，**数据采集 Skill 很多，但高质量的分析 Skill 很少**。机会在于：
- 关键词聚类与话题演化分析
- 评论区真伪判断（水军识别）
- 封面图/标题的 A/B 测试分析
- 账号人设与内容定位的自动诊断

---

## 六、总结

对于「想要尝试不同实践」的知识型个体而言，小红书 GitHub Skill 生态提供了从**底层数据采集**到**顶层自动化运营**的完整工具链。

**如果你只想快速体验**：用 `zhjiang22/openclaw-xhs` 的 `track-topic.sh` 追踪一个你感兴趣的话题。  
**如果你想深度运营**：用 `Xiangyu-CAS/xiaohongshu-ops-skill` 搭建完整的 Agent 运营助手。  
**如果你想二次开发**：用 `DeliciousBuding/xiaohongshu-skill` 或 `yangsijie666/rednote-crawler` 作为底座。

这些工具的共同点是：**它们把小红书从一个「仅供人类浏览的 App」，变成了「可被 AI Agent 理解和操作的能力接口」**——这正是 Intent-Driven 软件形态在内容创作领域的具体落地。

---

*报告生成时间：2026-04-17*  
*分析维度：热点追踪（Trending）+ 关键词分析（Keyword）+ Skill/MCP 适配性*  
*覆盖仓库数：10 个高价值开源项目*
