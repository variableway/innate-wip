# Suno 音乐技能 / 手机摄影评估 / 展会 AI 导游 — 综合分析

---

## 一、Music：Suno 生态的 Claude Code 技能

### 1.1 现有 Suno 技能清单

| 技能 | 类型 | 说明 | 推荐度 |
|------|------|------|--------|
| [bitwize-music-studio/claude-ai-music-skills](https://github.com/bitwize-music-studio/claude-ai-music-skills) | Claude Code Plugin | **完整的专辑制作流水线**——对话描述需求，自动生成歌词→Suno 提示词→分轨混音→母带→发布 | ★★★★★ |
| [nwp/suno-song-creator-plugin](https://github.com/nwp/suno-song-creator-plugin) | Claude Code Plugin | 专业的 Suno 提示词生成器，把简单描述转化为高质量音乐提示词 | ★★★★ |
| [CodeKeanu/suno-mcp](https://github.com/CodeKeanu/suno-mcp) | MCP Server | Suno API 的 MCP 封装，Claude Code 直接调用生成音乐、获取曲目信息、管理额度 | ★★★★★ |
| [Shyft: Suno MusicGen Skill](https://shyft.ai/skills/claude-code-suno-musicgen-skill) | Claude Code Skill | 解决 Suno 脚本限制的技能，面向创意人群 | ★★★★ |
| [MCP Market: Suno Music Creator](https://mcpmarket.com/tools/skills/suno-music-creator) | Claude Code Skill | 支持 Suno V5，高质量作曲、播放列表、分轨、企业 jingle | ★★★★ |

### 1.2 最佳实践：两种集成路径

```
路径 A：MCP 直接调用（推荐开发者）
─────────────────────────────────
Claude Code → suno-mcp → Suno API → 返回音频

安装：
  1. git clone https://github.com/CodeKeanu/suno-mcp
  2. 配置 Suno API Key
  3. 在 Claude Code 的 MCP 设置中注册

体验：
  你："帮我写一首关于夏天的民谣"
  Claude → 调用 suno-mcp → 生成歌词 + 提示词 → 调用 Suno API → 返回音频链接

路径 B：Skill 驱动（推荐非技术用户）
─────────────────────────────────
Claude Code → claude-ai-music-skills → 交互式创作 → Suno 输出

安装：
  1. /plugin install claude-ai-music-skills
  2. 或从 GitHub 下载 SKILL.md 放入 skills 目录

体验：
  你："我想做一张关于城市生活的概念专辑"
  Skill 引导你：
    → 讨论音乐风格和情绪
    → 逐首生成歌词
    → 优化 Suno 提示词（风格标签、节奏、配器）
    → 批量生成并整理
    → 输出完整专辑结构
```

### 1.3 Suno vs ACE-Step 对比

| 维度 | Suno | ACE-Step 1.5 |
|------|------|-------------|
| 运行方式 | 在线 API（需付费） | 本地运行（开源免费） |
| 音质 | V5.5 达到广播级 48kHz | 接近 Suno 水平，持续提升 |
| 提示词 | 直觉式，模糊描述也行 | 需要更结构化的提示词 |
| 中文支持 | 好 | 好 |
| 集成度 | 有成熟的 Claude Code 技能和 MCP | 需要自己写集成 |
| 成本 | ~$10/月起（500 首） | 免费（需 GPU） |
| 适合场景 | 快速出活、批量生产 | 隐私敏感、成本敏感、想本地控制 |

### 1.4 建议

**如果你刚起步：** 装上 `suno-mcp`，直接在 Claude Code 里说"帮我做一首XX风格的音乐"，感受完整流程。

**如果你认真做音乐：** `claude-ai-music-skills` 的专辑流水线是当前最完整的方案，从创意到成品一条龙。

---

## 二、Photography：手机拍照质量评估

### 2.1 现有工具

**目前没有一个专门的 "手机拍照质量评估" Claude Code Skill。** 但有多个可以组合使用的工具：

| 工具 | 类型 | 能做什么 | 适合度 |
|------|------|---------|--------|
| [photo-quality-analyzer](https://github.com/prasadabhishek/photo-quality-analyzer) | 开源 CLI | OpenCV + YOLO 分析技术质量：清晰度、曝光、噪点、构图 | ★★★★ |
| [SQAD](https://github.com/aiff22/SQAD) | 学术数据集 | ICCV 2023 手机拍照质量评估基准，量化打分模型 | ★★★★ |
| [Everypixel Aesthetics](https://aesthetics.everypixel.com/) | 在线 API | 美学评分神经网络 | ★★★ |
| [Photoreka](https://www.photoreka.com/photo_scoring) | 在线工具 | 多维评分：美学、构图、叙事性、原创性 | ★★★★ |
| [PhotoCritique.ai](https://photocritique.ai/) | 在线 AI | 专业摄影评价：构图、光线、技术 | ★★★★ |
| Claude/ChatGPT 视觉 | 直接使用 | 上传照片获得构图和改进建议 | ★★★★ |

### 2.2 可行的技术方案

#### 方案 A：用大模型直接评估（零开发成本）

```
你：[上传一张手机拍的照片]
Claude：让我从几个维度分析这张照片——

  构图（7/10）：主体偏左，符合三分法但上方留白过多
  光线（5/10）：逆光导致主体欠曝，建议用 HDR 模式
  清晰度（8/10）：主体对焦准确，背景自然虚化
  色彩（6/10）：白平衡偏冷，后期可以调暖一点
  叙事性（7/10）：有氛围感，但缺少一个明确的视觉焦点

  总评：这张照片的构图意识不错，主要问题是光线处理。
  建议：1. 打开手机 HDR 2. 点击主体锁定曝光 3. 后期微调色温
```

**优势：** 零开发成本，Claude/GPT-4o 的视觉理解能力已经很强
**劣势：** 评分不稳定（同一张照片不同对话可能给不同分），缺乏量化指标

#### 方案 B：组合方案（轻量开发）

```
流程：
1. 用户上传照片到微信/Telegram Bot
2. Bot 调用 photo-quality-analyzer（技术指标）
   → 输出：清晰度分、曝光分、噪点分
3. Bot 调用 Claude 视觉 API（艺术指标）
   → 输出：构图评价、色彩建议、改进方向
4. 合并输出：技术分 + 艺术评价 + 具体改进建议
```

#### 方案 C：自己写一个 Skill（完整方案）

如果你想做"手机摄影教练"这个产品，可以用 Superpowers 的 `writing-skills` 方法论创建：

```markdown
# mobile-photo-coach SKILL.md

## 触发条件
用户上传一张用手机拍摄的照片并请求评估

## 评估维度（10 分制）
1. 技术质量：清晰度、曝光、白平衡
2. 构图：三分法、引导线、对称/不对称
3. 光线：方向、质量、对比度
4. 色彩：和谐度、饱和度、情绪表达
5. 叙事性：是否讲述了一个故事

## 输出格式
- 各维度评分 + 一句话评语
- Top 3 改进建议（具体到手机操作步骤）
- 一张相似场景的优秀参考图（如果可以）

## 手机专项建议
根据照片 EXIF 中的设备信息，给出该机型特有的：
- 最佳拍摄模式建议
- 该机型的已知弱项（如夜景、人像）及规避方法
```

### 2.3 建议

**最快验证：** 直接用 Claude 视觉能力，上传照片问"帮我评估这张手机照片"，看效果是否满足需求。

**想做产品：** 写一个 `mobile-photo-coach` Skill，组合技术分析 + 视觉评价，通过微信 Bot 对外服务。

---

## 三、展会 AI 导游：可行性分析

### 3.1 你描述的到底是什么

```
核心想法：
  1. 聚合上海的免费展会信息
  2. 提前把展会内容（展商、展品、活动）整理好
  3. 做一个聊天 Bot，用户问什么就答什么
  4. 用户不用翻展商名录，直接对话获取精准信息
```

**这完全可行，而且是一个很好的产品方向。**

### 3.2 市场现状

上海展会信息聚合已经有基础平台：

| 平台 | 说明 |
|------|------|
| [聚展网](https://www.jufair.com) | 全国展会排期、门票、展商名录 |
| [上海市会展业公共信息服务平台](https://expo.sww.sh.gov.cn) | 官方权威信息 |
| [盈拓展览导航](https://www.showguide.cn) | 商务部指定平台 |

但**没有任何一个平台提供"对话式"的展会信息获取**。目前的体验是：

```
传统路径：
  打开网站 → 搜索展会 → 看展商列表（几百个）→ 找感兴趣的 → 看展位号 → 到现场再找

理想路径：
  "我想看跟AI相关的展商，特别是做大模型应用的"
  → Bot：本次展会有 23 家大模型应用展商，推荐你重点关注这几家：
     1. X公司（A123）- 做AI客服的，他们的产品...
     2. Y公司（B456）- 做AI写作的，最近发布了...
     "Y公司的展台怎么走？"
  → Bot：从你当前位置（南入口），直走100米右转进入B馆，Y公司在B456展位。
```

### 3.3 技术架构

```
┌─────────────────────────────────────────────────┐
│                 用户交互层                        │
│  微信小程序 / 公众号 / Telegram Bot / Web        │
├─────────────────────────────────────────────────┤
│                 AI 对话层                         │
│  Claude / DeepSeek API + RAG（检索增强生成）      │
│                                                  │
│  用户问题 → 意图理解 → 检索展会知识库 → 生成回答   │
├─────────────────────────────────────────────────┤
│                 知识库层                          │
│                                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │ 展会基础  │ │ 展商详情  │ │ 活动日程  │        │
│  │ 信息     │ │ 产品介绍  │ │ 讲座排期  │        │
│  └──────────┘ └──────────┘ └──────────┘        │
│                                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │ 场馆地图  │ │ 交通信息  │ │ 攻略建议  │        │
│  │ 展位布局  │ │ 停车/地铁 │ │ 必看推荐  │        │
│  └──────────┘ └──────────┘ └──────────┘        │
│                                                  │
│  存储：向量数据库（Chroma/FAISS）                  │
├─────────────────────────────────────────────────┤
│                 数据采集层                        │
│                                                  │
│  展会官网爬取 → 展商名录整理 → 展品信息结构化      │
│  场馆平面图数字化 → 活动日程导入 → 实时信息更新     │
└─────────────────────────────────────────────────┘
```

### 3.4 数据采集方案

**展前（提前 2-4 周）：**

| 数据 | 来源 | 方法 |
|------|------|------|
| 展会基础信息 | 官网、聚展网 | 手动 + 爬虫 |
| 展商名录 | 展会官网/会刊 PDF | PDF 解析 + AI 结构化 |
| 展商产品信息 | 展商官网 | 爬取 + AI 摘要 |
| 场馆地图 | 展会官网/主办方 | 手动标注展位坐标 |
| 活动日程 | 官网日程表 | 结构化导入 |
| 交通信息 | 地图 API | 自动获取 |

**展中（实时）：**

| 数据 | 来源 | 方法 |
|------|------|------|
| 人流密度 | 场馆 WiFi/摄像头 | 如果主办方开放 |
| 实时活动变动 | 主办方通知 | 人工更新 |
| 用户反馈 | Bot 内收集 | 自动记录 |

### 3.5 核心能力设计

#### Bot 能做什么

| 能力 | 示例对话 | 实现难度 |
|------|---------|---------|
| **展商搜索** | "有哪些做智能硬件的？" | 低（RAG 检索） |
| **展品推荐** | "我想看最新的 AI 教育产品" | 低（语义匹配） |
| **路线规划** | "帮我规划一个 3 小时的参观路线" | 中（需要场馆地图数据） |
| **导航** | "X公司的展台怎么走？" | 中（室内定位 + 路径） |
| **活动提醒** | "下午有什么值得听的讲座？" | 低（日程检索） |
| **对比推荐** | "A公司和B公司的产品有什么区别？" | 中（需要深度展商信息） |
| **个性化** | "根据我的兴趣推荐展商" | 中（需要用户画像） |
| **实时更新** | "现在哪里人少？" | 高（需要实时数据） |

#### 典型用户旅程

```
展前（准备阶段）：
  "下周上海有什么免费展会？"
  → Bot 推荐展会列表，附简介和日期

  "我想去人工智能博览会，帮我规划一下"
  → Bot 根据你的兴趣推荐必看展商和必听讲座

  "帮我生成一份参观攻略"
  → Bot 输出：时间安排 + 推荐路线 + 注意事项

展中（现场）：
  "我到了南入口，先看什么？"
  → Bot 基于你的攻略推荐第一个目标 + 路线

  "AI 写作工具有哪些展商？"
  → Bot 列出展商 + 展位号 + 产品亮点 + 路线

  "下午 2 点有什么活动？"
  → Bot 列出同时间段的活动 + 推荐排序

展后（回顾）：
  "帮我总结今天看到的产品"
  → Bot 基于你的咨询记录生成观展报告
```

### 3.6 MVP 方案（最小可行产品）

**用 1 个人 + 1 周时间可以做出什么：**

```
技术栈：
  - 数据采集：手动整理（1 个展会的展商信息）
  - AI 对话：DeepSeek API（成本最低）
  - RAG：LangChain + Chroma
  - 交互界面：微信公众号 或 Telegram Bot
  - 部署：Vercel 或 Railway

工作量：
  Day 1：选一个展会，整理展商名录（100-200 家）到表格
  Day 2：把展商信息结构化（名称、产品、类别、展位号）
  Day 3：搭建 RAG 系统，导入数据
  Day 4：接入 DeepSeek API，调试对话质量
  Day 5：接入微信/TG Bot 界面
  Day 6-7：测试、优化提示词、修复问题

MVP 功能：
  ✅ 展商搜索（按类别/关键词）
  ✅ 产品介绍（基于展商信息回答）
  ✅ 活动日程查询
  ✅ 参观建议
  ❌ 室内导航（需要额外数据）
  ❌ 实时信息（需要主办方配合）
  ❌ 个性化推荐（需要用户数据积累）
```

### 3.7 商业模式分析

| 模式 | 说明 | 可行性 |
|------|------|--------|
| **免费工具 + 广告** | 展商付费获得推荐优先级 | 中（需要流量支撑） |
| **展商增值服务** | 展商付费开通"AI 展台"——Bot 主动介绍该展商 | 高（展商有营销预算） |
| **主办方合作** | 为展会主办方提供 AI 导览 SaaS | 高（但需要 BD 能力） |
| **C 端订阅** | 高级功能收费（个性化推荐、展后报告） | 低（C 端付费意愿弱） |
| **数据变现** | 聚合用户咨询数据，生成行业洞察报告 | 中（需要脱敏和合规） |

### 3.8 风险和挑战

| 风险 | 严重度 | 应对 |
|------|--------|------|
| 数据获取难 | 高 | 展前信息不完全，展商名录可能有误；建议与主办方或聚展网合作 |
| AI 幻觉 | 高 | Bot 可能编造不存在的展商或产品；必须限定回答范围在知识库内 |
| 室内定位不准 | 中 | GPS 在室内不可靠；可以用展位号 + 文字描述替代精确导航 |
| 展会周期性 | 中 | 每次展会数据都要更新，人工成本高；需要半自动化采集流程 |
| 用户获取 | 中 | 展会场景低频，用户用完即走；需要每次展会重新获客 |

### 3.9 关键判断

**这个方向可行，而且时机正好。**

理由：
1. **展会信息不对称严重** — 展商几百上千家，参观者根本看不过来，AI 筛选是刚需
2. **技术已成熟** — RAG + LLM 的组合完全能解决这个问题
3. **没有强势竞争者** — 聚展网等信息平台还是"搜索+列表"模式，没有对话式产品
4. **上海展会密度高** — 每周都有展会，足够支撑 MVP 验证

**最大的挑战不是技术，而是数据获取和用户获取。**

建议路径：
1. **先选一个展会做 MVP** — 比如 [Microsoft AI Tour Shanghai（2026.4.21，免费）](https://www.microsoft.com)，规模适中、信息相对公开
2. **验证用户需求** — 看是否有人真的用、用了是否觉得有用
3. **如果验证通过** — 扩展到更多展会，考虑主办方合作模式

---

## 四、总结

| 方向 | 现状 | 建议 |
|------|------|------|
| **Suno 音乐技能** | 生态已成熟，有 MCP + Skill 两种集成路径 | 装上 `suno-mcp` 立即体验，想认真做音乐用 `claude-ai-music-skills` |
| **手机摄影评估** | 无现成 Skill，但 Claude 视觉 + 开源工具可以组合 | 先用 Claude 直接评估，想做产品就写一个 `mobile-photo-coach` Skill |
| **展会 AI 导游** | 无现成产品，但技术完全可行、需求真实存在 | 选一个展会做 MVP，1 人 1 周可出原型 |

**三个方向的关系：** 它们都是"AI + 垂直场景"的落地，核心能力都是 RAG + 对话。展会导游是最具商业化潜力的方向，因为信息不对称最严重、付费方最明确（展商/主办方）。

---

## 参考来源

### Music (Suno)
- [bitwize-music-studio/claude-ai-music-skills](https://github.com/bitwize-music-studio/claude-ai-music-skills)
- [CodeKeanu/suno-mcp](https://github.com/CodeKeanu/suno-mcp)
- [nwp/suno-song-creator-plugin](https://github.com/nwp/suno-song-creator-plugin)
- [Shyft: Suno MusicGen Skill](https://shyft.ai/skills/claude-code-suno-musicgen-skill)
- [MCP Market: Suno Music Creator](https://mcpmarket.com/tools/skills/suno-music-creator)

### Photography
- [prasadabhishek/photo-quality-analyzer](https://github.com/prasadabhishek/photo-quality-analyzer)
- [SQAD: Smartphone Camera Quality Assessment](https://github.com/aiff22/SQAD)
- [PhotoCritique.ai](https://photocritique.ai/)
- [Photoreka](https://www.photoreka.com/photo_scoring)
- [Everypixel Aesthetics](https://aesthetics.everypixel.com/)

### 展会 AI 导游
- [聚展网](https://www.jufair.com)
- [上海市会展业公共信息服务平台](https://expo.sww.sh.gov.cn)
- [Cvent: Event Chatbots 2026](https://www.cvent.com/en/blog/events/event-chatbot)
- [UFI: Chatbots in Exhibitions](https://www.ufi.org/chatbots-a-gateway-to-ai-in-exhibitions/)
- [Thoughtworks: Transforming Exhibition with AI](https://www.thoughtworks.com/en-us/insights/blog/generative-ai/transforming-exhibition-experiences-with-AI)
