# 小红书（XiaoHongShu）数据采集相关 GitHub 开源仓库 Top 5-10

> 依据：`os-tooling-xiaohongshu-data-methodology.md` 中的验证需求
> 目标：为「手工验证小红书效率工具热度」提供低成本、可自主操作的数据获取工具

---

## 使用声明

小红书平台对自动化数据采集有严格的反爬机制（Shield 签名算法、Cookie 校验、请求频率限制等），且其用户协议明确禁止未经授权的大规模爬取。以下仓库仅作技术研究、舆情分析、个人内容管理等合法用途参考。**请严格遵守相关法律法规及平台规则，切勿用于商业贩卖数据或侵犯用户隐私。**

---

## 精选仓库清单

### 1. XHS-Downloader —— 最全面的小红书作品采集工具
- **GitHub**: `JoeanAmier/XHS-Downloader`
- **技术栈**: Python 3.12+ / AIOHTTP 异步架构
- **核心功能**:
  - 提取账号发布/收藏/点赞/专辑作品链接
  - 提取搜索结果（作品、用户）链接
  - 采集作品完整信息（标题、描述、点赞、评论、作者信息等）
  - 下载图文/视频/LivePhoto 原文件，支持无水印
  - 提供 **API 模式**（`http://127.0.0.1:5556/docs`）和 **MCP 模式**
  - 智能去重、自定义命名规则、多语言界面
- **参考价值**: ⭐⭐⭐⭐⭐ **功能最全面、维护最活跃**。如果你只想用一个工具完成「下载笔记+元数据+评论分析前的素材收集」，这是首选。
- **License**: 开源（有详细免责声明）

### 2. xhs_one_spider —— 一站式聚合采集软件
- **GitHub**: `mashukui/xhs_one_spider`
- **技术栈**: Python（打包为 Windows/Mac 可执行文件）
- **核心功能**:
  - 根据搜索关键词采集笔记 + 评论（19 个笔记字段 + 11 个评论字段）
  - 根据主页链接采集博主全部笔记
  - UID 与链接互相转换
  - 自动下载笔记图片到本地
  - 内置 Cookie 一键配置工具
- **参考价值**: ⭐⭐⭐⭐⭐ **最适合做评论情感分析和关键词舆情监测**。如果你想验证「#Obsidian 笔记下评论区有多少人在求教程」，可以直接用它批量采集评论。
- **注意**: 该仓库的 Release 版本是付费软件（日卡/月卡/年卡），但 GitHub 上可能保留部分开源代码或文档供参考。类似的免费实现可参考其技术架构。

### 3. xiaohongshu-scraper —— 分类页批量采集
- **GitHub**: `lorenzowne/xiaohongshu-scraper`
- **技术栈**: Python
- **核心功能**:
  - 按类目（Category）批量采集小红书帖子列表
  - 可选提取详细帖子元数据（内容、类型、收藏数、回复数、发布时间）
  - 支持单类目或多类目并发采集
  - 输出结构化 JSON
- **参考价值**: ⭐⭐⭐⭐ 适合快速了解某一**垂直类目**的整体内容规模和互动水平。例如：你可以批量采集「职场效率」「学习日常」类目下的 1000 篇笔记，统计平均点赞/收藏数，验证效率工具赛道的真实热度。

### 4. rednote-xiaohongshu-user-posts-scraper —— 多账号批量监控
- **GitHub**: `whydejmayannmm/rednote-xiaohongshu-user-posts-scraper`
- **技术栈**: Python / 可能基于 Scrapy/Playwright
- **核心功能**:
  - 支持同时输入多个博主主页 URL，批量采集其历史发帖
  - 提取帖子 ID、URL、标题、互动数（点赞）、置顶标记
  - 提取封面图 URL 及多分辨率变体
  - 自动限速与随机延迟，降低封号风险
  - JSON 结构化输出
- **参考价值**: ⭐⭐⭐⭐ 如果你想**追踪几个效率工具博主的近期表现**（比如看他们发 Obsidian 相关笔记的频率和互动量），这个工具非常合适。

### 5. xiaohongshu-profile-scraper —— 博主主页+帖子详情深度采集
- **GitHub**: `Dory168/xiaohongshu-profile-scraper`
- **技术栈**: Python
- **核心功能**:
  - 采集博主主页信息（昵称、头像、粉丝数等）
  - 采集帖子详情页（标题、标签、描述、媒体、日期、地点）
  - 支持日期范围过滤（只采最近 N 天的帖子）
  - 自动下载封面图
  - 支持 Cookie  enriched 采集（获取更完整的标签和地点信息）
- **参考价值**: ⭐⭐⭐⭐ 适合**深度分析单个博主的内容策略**。例如：你可以用它采集一个头部效率博主近 6 个月的所有笔记，分析「Obsidian」相关笔记的占比和平均互动率。

### 6. rednote-xiaohongshu-product-details-scraper —— 电商商品详情采集
- **GitHub**: `datamaker54/rednote-xiaohongshu-product-details-scraper`
- **技术栈**: Python
- **核心功能**:
  - 从商品详情页提取价格、促销倒计时、规格参数、卖家信息、物流信息
  - 规范化 JSON 输出
  - 适合电商分析师和竞品研究团队
- **参考价值**: ⭐⭐⭐ 如果你的方向是「验证效率工具/模板类商品在小红书的商业潜力」，可以用它采集相关商品的价格、销量信号、促销策略。

### 7. Xiaohongshu-Shield-Algorithm —— 反爬签名算法研究
- **GitHub Topic 关联仓库** (搜索关键词: `xiaohongshu-shield-algorithm`)
- **核心内容**:
  - 小红书 APP Shield 签名算法的纯 Python 还原
  - 生成 xsec_token、各种 legacy/mini 请求头签名
  - 无需模拟器或真机即可通过请求校验
- **参考价值**: ⭐⭐⭐⭐ **技术含金量极高**。如果你打算自己写爬虫或维护一个长期稳定的数据采集工具，理解 Shield 算法是必经之路。但请注意，此类仓库通常处于灰色地带，可能随时被 DMCA 下架。

### 8. xhs_search_comment_tool —— 精准评论采集
- **GitHub**: `54514382/xhs_search_comment_tool`
- **核心功能**:
  - 批量采集小红书精准用户评论
  - 适用于评论区获客、舆情分析、科研数据收集
- **参考价值**: ⭐⭐⭐ 如果你只需要**评论数据**（比如分析「Obsidian 笔记」下的用户痛点词云），这个轻量工具可能比 XHS-Downloader 更直接。

### 9. scraping-apis-for-devs —— 含 Easy RedNote Scraper 的 API 集合
- **GitHub**: `cporter202/scraping-apis-for-devs`
- **核心内容**:
  - 这是一个 scraping API 的集合索引仓库
  - 其中包含 **Easy RedNote (XiaoHongShu) Scraper**，支持按类目（Homefeed、Fashion、Food、Cosmetics、Career 等）提取热门帖子和用户数据
- **参考价值**: ⭐⭐⭐ 适合不想自己部署代码、希望通过 API Actor（如 Apify）快速获取数据的用户。Apify 按量付费，适合小规模验证。

---

## 如何配合你的验证策略使用？

### 场景 A：快速验证「Obsidian 在小红书的热度」
**推荐工具**: `xhs_one_spider` 或 `XHS-Downloader`

**操作步骤**:
1. 在小红书搜索框输入 "Obsidian"，复制前 5-10 篇高赞笔记的链接。
2. 用 `XHS-Downloader` 批量提取这些笔记的：标题、正文、点赞数、收藏数、评论数、发布时间。
3. 用 `xhs_one_spider` 批量采集这些笔记下的**评论内容**。
4. 用 Excel/Python 做简单统计：平均互动量、高频关键词（"教程""插件""Mac""Windows""付费"）、评论情感倾向。

### 场景 B：追踪效率工具博主的变现能力
**推荐工具**: `xiaohongshu-profile-scraper` + `rednote-xiaohongshu-user-posts-scraper`

**操作步骤**:
1. 找到 3-5 个专门做「效率工具/知识管理」的腰部博主（粉丝 1-10 万）。
2. 用工具批量采集他们近 6 个月的全部笔记。
3. 统计以下指标：
   - 发笔记频率（每周几条）
   - 效率工具类笔记占比
   - 带货/课程笔记占比
   - 平均点赞/收藏趋势（是否在增长）

### 场景 C：长期监控某个关键词的内容供给趋势
**推荐工具**: `xiaohongshu-scraper`（按类目采集）+ `XHS-Downloader`（按搜索结果链接提取）

**操作步骤**:
1. 每周固定时间采集「职场效率」类目下 Top 50 笔记。
2. 记录每篇笔记的点赞数、发布时间、标题关键词。
3. 观察：新发布的 Obsidian/Notion 类笔记占比是否在上升？平均点赞门槛是否在提高？

---

## 风险提醒（再次强调）

1. **法律合规**: 根据《网络安全法》和《个人信息保护法》，未经授权采集用户个人信息（如评论内容、用户 ID）存在法律风险。建议仅用于公开学术研究或个人使用，且数据量控制在合理范围内。
2. **平台风控**: 小红书的风控策略更新频繁。上述工具可能在几个月后因接口变更而失效。
3. **账号安全**: 使用 Cookie 采集时，建议使用小号，避免使用主账号登录。
4. **伦理边界**: 不要采集用户隐私信息（如私信、手机号、实名信息），也不要将采集数据用于骚扰营销。

---

## 推荐组合（懒人包）

| 你的目的 | 首选工具 | 备选工具 |
|----------|----------|----------|
| 只想批量下载笔记+图片做素材库 | `XHS-Downloader` | `xiaohongshu-profile-scraper` |
| 想做评论区舆情分析 | `xhs_one_spider` | `xhs_search_comment_tool` |
| 想追踪某个博主的内容策略 | `xiaohongshu-profile-scraper` | `rednote-xiaohongshu-user-posts-scraper` |
| 想分析某个垂直类目的整体热度 | `xiaohongshu-scraper` | `XHS-Downloader`（配合搜索链接） |
| 想自己开发/维护长期爬虫 | `Xiaohongshu-Shield-Algorithm` | `XHS-Downloader`（参考其 AIOHTTP 架构） |

---

*生成时间：2026-04-14*  
*所有仓库信息均来自 GitHub 公开搜索*
