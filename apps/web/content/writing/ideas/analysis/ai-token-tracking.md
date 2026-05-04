# AI Token Tracking Tools — 综合分析报告

> 范围：个人 Token 追踪工具 / 全球 Token 监控平台 / AI 使用分析报告 / GitHub Pages 网站构建方案

---

## Task 1: Top GitHub Personal AI Token Tracking Tools

### 1.1 Top 8 个人 AI Token 追踪工具

| # | 项目 | Stars | 语言 | 支持平台 | 核心特点 |
|---|------|-------|------|----------|----------|
| 1 | **[tokscale](https://github.com/junhoyeo/tokscale)** | 新星（快速增长） | TypeScript CLI | Claude Code / OpenCode / Codex / Gemini / Cursor / AmpCode / OpenClaw / Kimi 等 20+ | 可视化仪表板、GitHub 集成、Profile 嵌入 Widget、本地隐私模式 |
| 2 | **[tokentop](https://github.com/tokentopapp/tokentop)** | 热门 | Rust | Anthropic / OpenAI / Gemini / Copilot / Codex / Perplexity 等 11 个 Provider，7 个 Coding Agent | "htop for AI costs"、实时终端监控、按会话/项目/天聚合 |
| 3 | **[AgentGuard](https://github.com/dipampaul17/AgentGuard)** | 新兴 | JavaScript | OpenAI / Anthropic | 实时 token 消耗显示、自动终止失控 LLM/Agent 循环、轻量级 |
| 4 | **[githubMeter](https://github.com/Bandonker/githubMeter)** | 新兴 | Tauri v2 + React + TypeScript | GitHub Copilot | 桌面小部件、实时监控 Copilot 请求/Actions 分钟/Packages 带宽、自动检测 Copilot 计划 |
| 5 | **[ppt-tracker](https://www.npmjs.com/package/ppt-tracker)** | Beta | Node.js + Python | Cursor / Claude Code | 详细分析、成本监控、PricePerToken 品牌出品 |
| 6 | **[tokenwise-tracker](https://www.npmjs.com/package/tokenwise-tracker)** | Beta | Node.js | OpenAI | 零依赖、SQLite 本地存储、自动记录每次 API 调用的成本/token/延迟 |
| 7 | **[toktrack](https://www.productcool.com/product/toktrack)** | 新兴 | Rust | Claude Code / Codex / Gemini / OpenCode | 解决 CLI 会话 30 天自动删除问题、永久保留成本历史 |
| 8 | **[Helicone](https://github.com/Helicone/helicone)** | ~3k | TypeScript | OpenAI / Anthropic / Azure / 自定义 | 开源 LLM 可观测性平台、代理网关、成本分析仪表板 |

### 1.2 详细分析

#### tokscale — 最全面的个人追踪方案

```
核心能力：
  - 支持 20+ AI 编程助手（Claude Code, OpenCode, Codex, Cursor, Gemini, Kimi 等）
  - 本地扫描会话文件 + LiteLLM 定价数据库 = 精确成本计算
  - 内置 Web 仪表板（localhost:3000）
  - GitHub 集成：可在 Profile README 中嵌入使用统计
  - 本地查看器模式：不上传数据，完全隐私

适用场景：
  - 同时使用多个 AI 编程助手的开发者
  - 需要精确了解每月 AI 成本的个人用户
  - 想在 GitHub Profile 展示 AI 使用活跃度

链接：https://github.com/junhoyeo/tokscale
```

#### tokentop — 终端实时监控的最佳选择

```
核心能力：
  - "htop for AI costs" —— 实时终端界面
  - 11 个 Provider（Anthropic, OpenAI, Gemini, Copilot, Codex 等）
  - 7 个 Coding Agent（Claude Code, OpenCode, Cursor, Copilot CLI 等）
  - 按会话/项目/天聚合展示
  - Rust 编写，性能极高

适用场景：
  - 喜欢终端界面的开发者
  - 需要实时监控 token 消耗（防止意外高额账单）
  - 同时使用多个 AI Provider 的重度用户

链接：https://github.com/tokentopapp/tokentop
```

#### AgentGuard — 防止失控 Agent 的安全网

```
核心能力：
  - 实时显示 token 消耗
  - 自动终止失控的 LLM/Agent 循环（防止无限循环消耗 token）
  - 轻量级，即插即用

适用场景：
  - 使用 AI Agent 进行自动化任务时
  - 担心 Agent 循环导致高额账单
  - 需要成本安全网

链接：https://github.com/dipampaul17/AgentGuard
```

### 1.3 个人工具选择建议

| 你的情况 | 推荐工具 |
|----------|----------|
| 同时用多个 AI 编程助手，想看总账 | **tokscale** |
| 喜欢终端实时监控 | **tokentop** |
| 只用 OpenAI API，想简单追踪 | **tokenwise-tracker** |
| 用 GitHub Copilot，想看使用量 | **githubMeter** |
| 担心 Agent 失控烧钱 | **AgentGuard** |
| 想要开源可观测性平台 | **Helicone** |

---

## Task 2: 全球范围的 AI Token Usage Tracking Tools

### 2.1 企业级/团队级 Token 监控平台

| # | 平台 | 类型 | 日处理量 | 核心能力 | 定价 |
|---|------|------|----------|----------|------|
| 1 | **[Prompts.ai](https://prompts.ai)** | Prompt 编排 + Token 追踪 | — | 35+ 模型实时 Token 追踪、多 Provider 聚合、FinOps 成本管理、预测性支出警报 | 付费（按 Token 使用量） |
| 2 | **[LangSmith](https://smith.langchain.com)** | LLM 可观测性 | — | 每次调用的成本分解（Input/Output/Tool/Retrieval）、Trace Tree 视图、工作区支出上限 | 免费层 + 付费 |
| 3 | **[Langfuse](https://langfuse.com)** | 开源 LLM 可观测性 | — | 实时分析、用户级成本归因（Tagging）、灵活定价配置、自托管 | 开源 / 云托管 |
| 4 | **[Portkey](https://portkey.ai)** | AI 网关 + 监控 | 500 亿 Token/天 | 200+ Provider、智能路由、语义缓存（降低成本）、速率限制 | 免费层 + 付费 |
| 5 | **[Arize AI](https://arize.com)** | ML 可观测性 | — | 企业级监控、缓存优化、多 Provider 支持、幻觉检测 | 企业定价 |
| 6 | **[Maxim AI](https://getmaxim.ai)** | AI 质量平台 | — | 语义缓存网关（节省 40%）、预算控制、日志分析、LLM-as-Judge 评估 | 免费层 + 付费 |
| 7 | **[Datadog LLM Observability](https://datadog.com)** | APM + LLM 监控 | — | SDK 自动注入（OpenAI/LangChain/Anthropic）、延迟/Token/错误追踪、幻觉检测 | 付费 |
| 8 | **[Helicone](https://helicone.ai)** | 开源 LLM 代理 | — | 代理网关、成本分析、日志记录、缓存、速率限制 | 开源 / 云托管 |
| 9 | **[Weights & Biases Weave](https://wandb.ai)** | ML 实验追踪 | — | LLM 实验管理、评估追踪、成本可视化 | 免费层 + 付费 |
| 10 | **[AWS Bedrock + CloudWatch](https://aws.amazon.com/bedrock/)** | 云原生 | — | AWS 原生 Token 监控、CloudWatch 集成、企业级 | 按 AWS 使用量 |

### 2.2 平台对比

| 能力 | Prompts.ai | LangSmith | Langfuse | Portkey | Maxim AI | Datadog |
|------|-----------|-----------|----------|---------|----------|---------|
| **实时 Token 追踪** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **多 Provider 支持** | 35+ | 主要 5 个 | 任意 | 200+ | 主要 5 个 | 主要 5 个 |
| **成本优化** | ✅ FinOps | ✅ 支出上限 | ✅ 标签归因 | ✅ 缓存+路由 | ✅ 语义缓存 | ✅ 基础 |
| **开源** | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **自托管** | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **幻觉检测** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| **预算控制** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **免费层** | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ |

### 2.3 选择建议

| 场景 | 推荐 |
|------|------|
| **个人/小团队，预算有限** | Langfuse（开源免费自托管） |
| **中型团队，需要一站式方案** | LangSmith（与 LangChain 生态集成） |
| **大规模生产，成本优化优先** | Portkey（500 亿 Token/天，智能缓存） |
| **AWS 生态深度用户** | AWS Bedrock + CloudWatch |
| **已有 Datadog 的团队** | Datadog LLM Observability（无缝集成） |
| **需要 Prompt 编辑 + Token 追踪一体** | Prompts.ai |
| **关注 AI 质量评估 + 成本** | Maxim AI |

---

## Task 3: AI 使用分析

### 3.1 最新 AI 使用分析核心数据（2025-2026）

#### 全球 AI 采用率

| 指标 | 数据 | 来源 |
|------|------|------|
| 组织至少在一个业务功能中使用 AI | **88%** | McKinsey 2025 State of AI |
| 企业正在扩大 AI 投资 | **92%** | McKinsey 2025 Workplace Report |
| 企业认为自己在 AI 部署上"成熟" | **仅 1%** | McKinsey 2025 |
| 已规模化部署 AI Agent 的企业 | **23%** | McKinsey 2025 |
| 正在试验 AI Agent 的企业 | **39%** | McKinsey 2025 |
| 企业应用将包含 AI 功能（2026） | **40%** | Gartner |
| AI 工具全球用户数（2025） | **3.78 亿** | Netguru 2025 |
| 使用 ChatGPT 的企业数 | **150 万+** | 多来源 |
| 使用 ChatGPT 后客户满意度提升 | **72%** 企业报告 | 多来源 |
| AI 对全球 GDP 的年贡献潜力 | **$4.4 万亿** | McKinsey Global Institute |
| 受 AI 影响的全球工作岗位 | **3 亿** | Goldman Sachs |
| 平均生产力提升 | **37%** | Stanford/MIT Research |

#### AI 市场规模

| 领域 | 2025 数据 | 2026 预测 | 来源 |
|------|-----------|-----------|------|
| 全球 AI 市场规模 | ~$200B | ~$300B | Gartner |
| AI 基础设施新增支出 | — | $401B | Gartner |
| 生成式 AI 市场 | ~$60B | ~$100B | Bloomberg Intelligence |
| AI 编程工具用户 | ~50M | ~80M | GitHub/GitLab |

### 3.2 Top 20 AI 使用分析报告资源

| # | 报告名称 | 发布机构 | 链接 | 核心内容 |
|---|----------|----------|------|----------|
| 1 | **The State of AI 2025** | McKinsey | [链接](https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai.html) | 企业 AI 采用率、Agent 趋势、ROI 分析 |
| 2 | **AI Index Report 2025** | Stanford HAI | [链接](https://aiindex.stanford.edu/report/) | 全球 AI 最全面的年度报告 |
| 3 | **Gartner Hype Cycle for Generative AI 2025** | Gartner | [链接](https://www.gartner.com/en/documents/5580424) | AI 技术成熟度曲线 |
| 4 | **Trends — AI Report 2025** | a16z | [链接](https://a16z.com/ai/) | 投资、技术、市场趋势 |
| 5 | **Top AI Statistics 2026** | AllAboutAI | [链接](https://www.allaboutai.com/resources/ai-statistics/) | 100+ 关键数据点 |
| 6 | **AI Statistics 2026: Key Data** | Axis Intelligence | [链接](https://axis-intelligence.com/ai-statistics-2026-key-data-market-trends/) | 市场趋势与数据 |
| 7 | **Enterprise AI Statistics 2026** | Medha Cloud | [链接](https://medhacloud.com/blog/enterprise-ai-statistics-2026) | 企业 AI 采用、ROI、支出 |
| 8 | **70+ AI Statistics 2026** | CXOVoice | [链接](https://cxovoice.com/70-ai-statistics-2026-adoption-market-size-enterprise-trends-global-india/) | 全球及印度 AI 数据 |
| 9 | **AI Reality Check 2025 vs 2026** | LowTouch.ai | [链接](https://www.lowtouch.ai/ai-adoption-2025-vs-2026/) | 2025 现状 vs 2026 展望 |
| 10 | **2026 AI 行业趋势深度报告** | ZeekLog | [链接](https://zeeklog.com/2026-nian-ai-xing-ye-qu-shi-shen-du-bao-gao/) | 中国视角的 AI 行业分析 |
| 11 | **AI Stats You Need to Know 2025** | ALOA | [链接](https://aloa.co/ai/resources/industry-insights/ai-stats) | 15 个关键 AI 统计 |
| 12 | **15 AI Stats for 2025** | SearchLab | [链接](https://searchlab.nl/statistieken/generative-ai-statistieken-2026) | 生成式 AI 统计 |
| 13 | **World Economic Forum: Future of Jobs Report** | WEF | [链接](https://www.weforum.org/publications/the-future-of-jobs-report-2025/) | AI 对就业的影响 |
| 14 | **OECD AI Policy Observatory** | OECD | [链接](https://oecd.ai/en/) | 全球 AI 政策与数据 |
| 15 | **PwC Global AI Study** | PwC | [链接](https://www.pwc.com/gx/en/issues/analytics/assets/pwc-ai-analysis-sizing-the-prize-report.pdf) | AI 经济影响分析 |
| 16 | **Grand View Research: AI Market** | Grand View Research | [链接](https://www.grandviewresearch.com/industry-analysis/artificial-intelligence-ai-market) | AI 市场规模预测 |
| 17 | **IDC AI Spending Guide** | IDC | [链接](https://www.idc.com/getdoc.jsp?containerId=prUS52574525) | AI 支出追踪 |
| 18 | **CB Insights AI Report** | CB Insights | [链接](https://www.cbinsights.com/research/report-ai/) | AI 投资与创业 |
| 19 | **2025 麦肯锡 AI 应用现状调研（中文）** | McKinsey China | [链接](https://www.mckinsey.com.cn/2025%e9%ba%a6%e8%82%af%e9%94%a1ai%e5%ba%94%e7%94%a8%e7%8e%b0%e7%8a%b6%e8%b0%83%e7%a0%94%ef%bc%9a%e4%bb%856%e4%bc%81%e4%b8%9a%e6%88%90%e4%b8%ba%e9%ab%98%e7%bb%a9%e6%95%88%e8%b5%a2%e5%ae%b6%ef%bc%8c/) | 中文版 AI 应用调研 |
| 20 | **AI Use Cases Across 20+ Industries** | Vegavid | [链接](https://vegavid.com/blog/ai-use-cases-and-applications) | 20+ 行业 AI 用例 |

### 3.3 Top 20 AI 使用场景报告与资源

| # | 使用场景 | 行业 | 采用率/效果 | 代表资源 |
|---|----------|------|-------------|----------|
| 1 | **智能客服 / 聊天机器人** | 全行业 | 消化 70% 重复咨询 | [ofox.ai](https://ofox.ai/zh/blog/enterprise-ai-high-roi-scenarios-model-selection-2026/) |
| 2 | **内容生成（文案/营销/代码）** | 营销/媒体 | 效率提升 5 倍 | [ITransition](https://www.itransition.com/ai/use-cases) |
| 3 | **代码生成与审查** | 软件开发 | 生产力提升 37-55% | [GitHub Research](https://github.com/research) |
| 4 | **数据分析助手** | 全行业 | 非技术人员用自然语言查数据 | [Databricks](https://www.databricks.com/blog/top-ai-use-cases-transforming-industries-2025) |
| 5 | **个性化推荐系统** | 零售/电商 | 47% 零售企业重点投入 | [ITransition](https://www.itransition.com/ai/use-cases) |
| 6 | **药物研发加速** | 医疗健康 | 研发周期缩短 50%+ | [ZeekLog](https://zeeklog.com/2026-nian-ai-xing-ye-qu-shi-shen-du-bao-gao/) |
| 7 | **AI 辅助诊断** | 医疗健康 | 基层医院渗透率 >60% | [ZeekLog](https://zeeklog.com/2026-nian-ai-xing-ye-qu-shi-shen-du-bao-gao/) |
| 8 | **自动驾驶** | 汽车/交通 | Tesla/Waymo/Cruise 领先 | [Vegavid](https://vegavid.com/blog/ai-use-cases-and-applications) |
| 9 | **企业知识库问答** | 全行业 | 2M 上下文的杀手级应用 | [ofox.ai](https://ofox.ai/zh/blog/enterprise-ai-high-roi-scenarios-model-selection-2026/) |
| 10 | **AI Agent 自动化** | 全行业 | 从"聊天"到"执行" | [ofox.ai](https://ofox.ai/zh/blog/enterprise-ai-high-roi-scenarios-model-selection-2026/) |
| 11 | **营销内容生成** | 营销 | 59% 零售企业使用 | [ITransition](https://www.itransition.com/ai/use-cases) |
| 12 | **预测性分析** | 金融/供应链 | 50% 企业使用 | [ITransition](https://www.itransition.com/ai/use-cases) |
| 13 | **安全威胁检测** | 网络安全 | 实时检测 Prompt 注入/数据泄露 | [Maxim AI](https://getmaxim.ai) |
| 14 | **虚拟试衣间 / 3D 商品** | 零售/电商 | AI 生成 3D 模型 < $1/个 | [ZeekLog](https://zeeklog.com/2026-nian-ai-xing-ye-qu-shi-shen-du-bao-gao/) |
| 15 | **会议摘要与行动项** | 全行业 | AI 自动总结 + 建议 | [LisaIceland](https://docs.lisaiceland.com/smarter-ai-learn-more/.incredible-trends) |
| 16 | **计算机视觉质检** | 制造业 | 施工进度监控/安全检查 | [Databricks](https://www.databricks.com/blog/top-ai-use-cases-transforming-industries-2025) |
| 17 | **语音助手** | 消费电子 | 全球 4.69 亿美国成年人使用 | [AllAboutAI](https://www.allaboutai.com/resources/ai-statistics/) |
| 18 | **动态定价与促销** | 零售 | 28% 零售企业投入 | [ITransition](https://www.itransition.com/ai/use-cases) |
| 19 | **供应链优化** | 物流/制造 | Agent 预测/调度 | [LowTouch](https://www.lowtouch.ai/ai-adoption-2025-vs-2026/) |
| 20 | **品牌 AI 助手** | 零售/消费 | 52% 零售企业考虑/实施 | [ITransition](https://www.itransition.com/ai/use-cases) |

---

## GitHub Pages 静态网站构建方案

### 方案选型

| 框架 | 适合场景 | 学习成本 | 推荐度 |
|------|----------|----------|--------|
| **[Astro](https://astro.build)** | 数据展示/分析报告站 | 低 | ⭐⭐⭐⭐⭐ |
| **[Jekyll](https://jekyllrb.com)** | 博客/文档站（GitHub Pages 原生支持） | 低 | ⭐⭐⭐⭐ |
| **[VitePress](https://vitepress.dev)** | 文档站 | 低 | ⭐⭐⭐⭐ |
| **[Docusaurus](https://docusaurus.io)** | 文档站（版本管理） | 中 | ⭐⭐⭐ |
| **[Hugo](https://gohugo.io)** | 超快速博客/内容站 | 中 | ⭐⭐⭐ |
| **[Next.js Static Export](https://nextjs.org)** | 复杂交互站 | 高 | ⭐⭐ |

### 推荐方案：Astro + GitHub Pages

Astro 是构建 AI 数据分析报告网站的最佳选择：
- 零 JavaScript 默认（极快加载）
- 支持交互组件（React/Vue/Svelte 按需加载）
- 内置内容集合（Content Collections）适合管理报告数据
- 天然支持 Markdown 内容

### 项目结构

```
ai-token-tracker-site/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions 自动部署
├── src/
│   ├── components/
│   │   ├── TokenChart.astro    # Token 使用图表组件
│   │   ├── ToolCard.astro      # 工具卡片组件
│   │   ├── DataTable.astro     # 数据表格组件
│   │   └── ComparisonTable.astro
│   ├── content/
│   │   ├── tools/              # 工具数据（Markdown/JSON）
│   │   │   ├── tokscale.md
│   │   │   ├── tokentop.md
│   │   │   └── ...
│   │   ├── reports/            # 报告数据
│   │   │   ├── ai-adoption-2025.md
│   │   │   └── ...
│   │   └── use-cases/          # 使用场景
│   │       ├── code-generation.md
│   │       └── ...
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro         # 首页（概览仪表板）
│   │   ├── personal-tools.astro # 个人工具页
│   │   ├── enterprise-tools.astro # 企业工具页
│   │   ├── reports.astro       # AI 使用分析页
│   │   └── use-cases.astro     # 使用场景页
│   └── styles/
│       └── global.css
├── public/
│   └── images/                 # 工具截图、图表图片
├── astro.config.mjs
├── package.json
└── README.md
```

### 关键实现步骤

#### Step 1：初始化项目

```bash
npm create astro@latest ai-token-tracker-site
cd ai-token-tracker-site
npm install
```

#### Step 2：添加交互图表（可选）

```bash
npm install chart.js react-chartjs-2 react
npx astro add react
```

#### Step 3：配置 GitHub Pages 部署

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
    steps:
      - uses: actions/deploy-pages@v4
```

#### Step 4：内容数据格式

```yaml
# src/content/tools/tokscale.md
---
title: tokscale
type: personal
language: TypeScript
stars: growing
providers:
  - Claude Code
  - OpenCode
  - Codex
  - Cursor
  - Gemini
  - Kimi
features:
  - 可视化仪表板
  - GitHub Profile 嵌入
  - 本地隐私模式
  - 20+ 平台支持
links:
  github: https://github.com/junhoyeo/tokscale
  website: https://tokscale.ai
image: /images/tools/tokscale.png
---

tokscale 是一个 CLI 工具 + Web 仪表板，用于追踪多个 AI 编程助手的 Token 使用量和成本。
```

#### Step 5：部署

```bash
# 本地预览
npm run dev

# 构建
npm run build

# 推送到 GitHub 后自动部署到：
# https://<username>.github.io/ai-token-tracker-site/
```

### 图片资源需求

构建此网站需要的图片资源：

| 图片类型 | 数量 | 来源 |
|----------|------|------|
| 工具截图 | 8-10 张 | 各工具 GitHub README 截图 |
| 平台 Logo | 10+ | 各平台官网 |
| 数据图表 | 5-10 张 | AI 报告中的公开图表 |
| 行业图标 | 20+ | SVG 图标库（Lucide/Heroicons） |

**注意**：使用图片时应注意版权。建议：
- 优先使用各项目的开源 Logo（MIT/Apache 项目通常允许）
- 数据图表建议自行用 Chart.js 重新生成，而非直接截图
- 使用 Unsplash/Pexels 的免费图片作为装饰

---

## 使用 innate-frontend Skill 构建此网站的创建计划

如果使用 `innate-frontend`（基于 `@innate/ui`）构建此分析报告网站，计划如下：

### Phase 1：项目初始化（Day 1）

```
1. 使用 innate-frontend SKILL.md 的初始化步骤创建项目
2. 配置 @innate/ui + TailwindCSS + shadcn/ui
3. 建立项目结构（参考上述 Astro 结构，适配 Next.js/React）
4. 配置 GitHub Pages 静态导出（next.config.js → output: 'export'）
```

### Phase 2：数据层（Day 2-3）

```
1. 创建工具数据 JSON 文件（src/data/tools.json）
2. 创建报告数据 JSON 文件（src/data/reports.json）
3. 创建使用场景数据 JSON 文件（src/data/use-cases.json）
4. 编写数据获取工具函数（src/lib/data.ts）
```

### Phase 3：页面开发（Day 4-7）

```
Day 4: 首页 — 概览仪表板
  - Hero Section（Landing Block）
  - 核心数据卡片（88% 采用率、$4.4T 市场等）
  - 工具分类快速导航

Day 5: 个人工具页
  - 工具卡片网格（使用 @innate/ui Card 组件）
  - 筛选/搜索功能
  - 对比表格

Day 6: 企业工具页
  - 平台对比表格
  - 选择指南
  - 成本对比图表

Day 7: AI 使用分析页 + 使用场景页
  - 数据可视化图表
  - 报告资源列表
  - 使用场景分类展示
```

### Phase 4：部署（Day 8）

```
1. next.config.js 配置静态导出
2. GitHub Actions 自动部署到 GitHub Pages
3. 验证线上站点
```

### 关键组件映射（@innate/ui）

| 页面区域 | 推荐组件 |
|----------|----------|
| 导航栏 | NavigationMenu / Header |
| 数据卡片 | Card + Badge |
| 工具列表 | DataTable / Grid |
| 对比表格 | Table |
| 图表 | 外部引入 Chart.js 或 Recharts |
| 报告链接 | Button + External Link |
| 筛选 | Select / Tabs |
| 页脚 | Footer |

---

*分析时间：2026-04-15*
*数据来源：GitHub、McKinsey、Gartner、Stanford HAI、a16z、Prompts.ai、LangSmith、Langfuse、Portkey、各工具官方文档*
