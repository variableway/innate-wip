# GitHub Trending 分析自动化系统 — 技术报告 (GLM-5.1)

> 生成日期: 2026-04-14
> 模型: GLM-5.1
> 任务来源: `ideas/trending-analysis/analysis-skill-tools.md`

---

## 一、系统目标

构建一个自动化流水线，完成以下闭环:

```
获取 GitHub Trending → 克隆/分析项目 → AI 生成技术报告 → 发布为博客/网站
```

核心需求:
1. **Task 1**: Git clone 到 `references/<category-folder>` → 触发 AI 分析脚本 → 生成结构化技术报告
2. **Task 2**: 获取 GitHub Trending → 用 Task 1 工具分析 → 汇总结果 → 发布到网站/博客

---

## 二、数据源: 如何获取 GitHub Trending

### 关键事实: GitHub 没有官方 Trending API

`github.com/trending` 页面的数据**没有官方 API 端点**。所有方案都依赖爬取或近似查询。

### 方案对比

| 方案 | 数据质量 | 稳定性 | 成本 | 推荐度 |
|---|---|---|---|---|
| **爬取 github.com/trending** | 最高 (含 star 增速) | 中 (HTML 变动会 break) | 免费 | **首选** |
| **GitHub Search API 近似** | 中 (只能按创建时间/推送时间排序) | 高 | 免费 (30 req/min 认证) | 补充 |
| **第三方托管 API** | 高 | 低 (可能下线) | 免费 | 备选 |
| **TrendRadar 等现成工具** | 高 | 中 | 免费 | 快速启动 |

### 推荐工具库

#### Python 方案 (推荐)

| 工具 | 安装 | 说明 |
|---|---|---|
| [gtrending](https://github.com/hedyhli/gtrending) | `pip install gtrending` | **最成熟的 Python 爬取库**。`fetch_repos(language, since)` 返回完整数据。自带 CLI: `gtrending repos --language python --since daily --json` |
| GitHub Search API | `requests` + REST API | 补充数据: 获取 README、贡献者、最近 commits 等 |

**gtrending 返回的数据结构:**
```python
{
    "author": "username",
    "name": "repo-name",
    "url": "https://github.com/username/repo-name",
    "description": "...",
    "language": "Python",
    "languageColor": "#3572A5",
    "stars": 15000,
    "forks": 1200,
    "currentPeriodStars": 350,  # 本周期新增 star 数 (关键!)
    "builtBy": [{"username": "...", "href": "...", "avatar": "..."}]
}
```

#### Node.js 方案

| 工具 | 安装 | 说明 |
|---|---|---|
| [@huchenme/github-trending](https://github.com/huchenme/github-trending-api) | `npm install @huchenme/github-trending` | 最流行的 JS 库，同时提供托管 REST API |
| [github-trending](https://github.com/bonfy/github-trending) | `npm install github-trending` | 更简单的替代方案 |

#### 托管 API (无需自己爬)

```
GET https://ghapi.huchen.dev/repositories?language=python&since=daily
```

#### Rust 方案 (生产级)

[antonkomarev/github-trending-api](https://github.com/antonkomarev/github-trending-api) — Rust 微服务，高性能 JSON API。配套 [github-trending-archive](https://github.com/antonkomarev/github-trending-archive) 提供历史趋势归档。

#### GitHub Search API 近似查询

```
# 近期创建的高星项目 (新热门)
GET /search/repositories?q=created:>2026-04-01&sort=stars&order=desc

# 近期活跃的高星项目 (持续热门)
GET /search/repositories?q=pushed:>2026-04-07+stars:>500&sort=stars&order=desc
```

限制: 无法获取 star 增速 (`currentPeriodStars`)，只能按总量排序。

---

## 三、项目分析: AI 驱动的代码理解工具

### 核心工具矩阵

| 工具 | Stars | 功能 | 输出格式 | 推荐场景 |
|---|---:|---|---|---|
| [Repomix](https://github.com/yamadashy/repomix) | 20k+ | **将整个仓库打包为 AI 友好的单文件** (XML/Markdown/纯文本)。支持远程仓库分析 | 单文件 | Claude/GPT 上下文输入 |
| [Claude Code CLI](https://code.claude.com) | - | 官方 CLI agent。`--print` 非交互模式用于脚本化。Explore 子代理专门用于代码库分析 | 自然语言 | 深度架构分析 |
| [analyzeRepo](https://github.com/rlnorthcutt/analyzeRepo) | 新项目 | Go CLI: 输入 repo → Claude 分析 → 生成 3 个文件: 分析文档 + 入职指南 + CLAUDE.md | Markdown | 快速生成标准文档 |
| [DeepWiki](https://github.com/AsyncFuncAI/deepwiki-open) | 新项目 | Cognition AI 出品。自动将仓库转换为 Wiki 文档 + 可视化图表 | Wiki/HTML | 生成交互式文档 |
| [code2flow](https://github.com/scottrogowski/code2flow) | 成熟 | 生成函数调用关系图。支持 Python/JS/Ruby/PHP。有 MCP Server 集成 | DOT/PNG | 可视化代码结构 |
| [TrendRadar](https://github.com/sansan0/TrendRadar) | v5.0 | **最接近目标的现成工具**。AI 驱动趋势分析，支持 100+ LLM (通过 LiteLLM)，分析流行度、跨平台关联、潜在影响 | 推送通知 | 趋势分析流水线 |

### Claude Code CLI 用于自动分析

Claude Code 的 `--print` 模式支持非交互式脚本化:

```bash
# 非交互模式分析项目
claude --print "分析这个项目的技术栈、架构和核心功能" \
  --allowedTools Read,Glob,Grep \
  --maxTurns 10

# 生成结构化报告
claude --print "请为这个项目生成一份技术分析报告，包含:
1. 项目概述 (一句话)
2. 技术栈
3. 核心功能模块
4. 架构模式
5. 适用场景
6. 潜在影响" \
  --maxTurns 15 > analysis-report.md
```

### Repomix 用于打包仓库上下文

```bash
# 安装
npm install -g repomix

# 远程仓库分析 (无需 clone)
repomix --remote https://github.com/user/repo --no-files

# 打包为 Markdown
repomix --remote https://github.com/user/repo --output-style markdown -o output.md
```

### analyzeRepo 快速生成三件套

```bash
# 安装
go install github.com/rlnorthcutt/analyzeRepo@latest

# 分析仓库 (需要 Claude API Key)
analyzeRepo --repo https://github.com/user/repo

# 输出:
#   analysis.md      — 完整技术分析
#   onboarding.md    — 新贡献者指南
#   CLAUDE.md        — Claude Code 上下文文件
```

---

## 四、系统架构设计

### 整体流水线

```
┌─────────────────────────────────────────────────────────────────────┐
│                     GitHub Trending Analyzer                        │
│                                                                     │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────────┐  │
│  │  Step 1:     │    │  Step 2:     │    │  Step 3:             │  │
│  │  获取 Trending│───→│  克隆 & 分析 │───→│  AI 分析 & 报告生成  │  │
│  │              │    │              │    │                      │  │
│  │  gtrending   │    │  git clone   │    │  Repomix + Claude    │  │
│  │  或 Search   │    │  → refer-    │    │  API → Markdown      │  │
│  │  API         │    │  ences/<cat> │    │  报告                │  │
│  └──────────────┘    └──────────────┘    └──────────┬───────────┘  │
│                                                     │              │
│  ┌──────────────┐    ┌──────────────┐               │              │
│  │  Step 5:     │    │  Step 4:     │               │              │
│  │  发布        │←──│  汇总 & 排版 │←──────────────┘              │
│  │              │    │              │                              │
│  │  Hugo/Astro  │    │  每日/每周   │                              │
│  │  → GitHub    │    │  Trending    │                              │
│  │    Pages     │    │  Digest      │                              │
│  └──────────────┘    └──────────────┘                              │
│                                                                     │
│  触发: GitHub Actions cron / 本地 cron / 手动                       │
└─────────────────────────────────────────────────────────────────────┘
```

### Step 1: 获取 Trending 数据

```python
# fetch_trending.py
from gtrending import fetch_repos
import json

def fetch_daily_trending(languages=None):
    """获取每日 trending 仓库"""
    results = {}

    if languages is None:
        languages = ['', 'python', 'typescript', 'rust', 'go']

    for lang in languages:
        repos = fetch_repos(language=lang, since='daily')
        results[lang or 'all'] = repos

    return results

def filter_top_repos(results, max_per_language=10):
    """筛选 top N 仓库"""
    filtered = {}
    for lang, repos in results.items():
        # 按 currentPeriodStars 降序
        sorted_repos = sorted(repos, key=lambda r: r.get('currentPeriodStars', 0), reverse=True)
        filtered[lang] = sorted_repos[:max_per_language]
    return filtered
```

### Step 2: 克隆到分类目录

```python
# clone_repos.py
import os
from pathlib import Path

BASE_DIR = Path("references")

CATEGORY_MAP = {
    'python': 'python',
    'typescript': 'javascript',
    'rust': 'rust',
    'go': 'go',
    '': 'general',
}

def clone_repo(repo_url, language, base_dir=BASE_DIR):
    """Clone 仓库到分类目录"""
    category = CATEGORY_MAP.get(language, 'general')
    target_dir = base_dir / category / repo_url.split('/')[-1]

    if target_dir.exists():
        # 已存在则 pull 最新
        os.system(f"cd {target_dir} && git pull")
    else:
        target_dir.parent.mkdir(parents=True, exist_ok=True)
        os.system(f"git clone --depth 1 {repo_url} {target_dir}")

    return target_dir
```

### Step 3: AI 分析

**方案 A: Repomix + Claude API (推荐)**

```bash
# 对每个仓库执行
repomix --remote $REPO_URL --output-style markdown -o /tmp/repo-context.md

# 发送给 Claude API 生成分析报告
curl -X POST https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "content-type: application/json" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-sonnet-4-6",
    "max_tokens": 4000,
    "messages": [{
      "role": "user",
      "content": "请分析以下 GitHub 项目，生成结构化技术报告:\n\n" + $(cat /tmp/repo-context.md)
    }]
  }'
```

**方案 B: Claude Code CLI (本地运行)**

```bash
cd references/$CATEGORY/$REPO_NAME

claude --print "请生成一份技术分析报告，包含:
1. 项目概述 (一句话描述)
2. 技术栈和依赖
3. 核心功能模块 (列表)
4. 架构模式
5. 创新点/亮点
6. 适用场景
7. 与同类项目的对比优势
8. Star 增速分析和潜力评估
9. 一句话推荐理由" \
  --allowedTools Read,Glob,Grep \
  --maxTurns 15 > analysis.md
```

**方案 C: analyzeRepo (最快)**

```bash
analyzeRepo --repo $REPO_URL
# 自动生成 analysis.md + onboarding.md + CLAUDE.md
```

### Step 4: 汇总生成每日 Digest

```python
# generate_digest.py
from datetime import datetime
from pathlib import Path

DAILY_TEMPLATE = """# GitHub Trending Daily Digest — {date}

> 自动生成于 {timestamp}
> 数据来源: GitHub Trending (gtrending)

---

## 今日 Top 项目

{project_summaries}

---

## 按语言分类

{by_language}

---

## 趋势洞察

{insights}

---

## 值得关注

{recommended}

---

*Generated by GitHub Trending Analyzer*
"""
```

### Step 5: 发布到网站

#### 推荐方案: Hugo + GitHub Pages

| 维度 | 选择 | 理由 |
|---|---|---|
| **静态站点生成器** | **Hugo** | 单 Go 二进制，零依赖，构建极快 (秒级)，原生 Markdown |
| **部署** | GitHub Pages | 免费，自动部署 |
| **CI/CD** | GitHub Actions | cron 触发，自动运行全流水线 |
| **替代方案** | Astro | 如需交互式图表和数据可视化 |

#### Hugo 项目结构

```
trending-site/
├── config.toml
├── content/
│   └── posts/
│       ├── 2026-04-14-daily-digest.md
│       ├── 2026-04-13-daily-digest.md
│       └── ...
├── layouts/
│   └── _default/
│       └── single.html
├── static/
└── themes/
    └── papermod/    # 推荐: PaperMod 主题 (简洁、快速)
```

#### GitHub Actions 工作流

```yaml
# .github/workflows/daily-trending.yml
name: Daily GitHub Trending Analysis

on:
  schedule:
    - cron: '0 2 * * *'  # 每天 UTC 02:00 (北京时间 10:00)
  workflow_dispatch:       # 手动触发

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'

      - name: Install dependencies
        run: |
          pip install gtrending requests
          npm install -g repomix

      - name: Fetch trending repos
        run: python scripts/fetch_trending.py

      - name: Analyze repos
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: python scripts/analyze_repos.py

      - name: Generate digest
        run: python scripts/generate_digest.py

      - name: Build Hugo site
        uses: peaceiris/actions-hugo@v2
        with:
          hugo-version: 'latest'

      - run: hugo

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
```

---

## 五、CLI 工具设计 (spark-cli)

基于原始需求中提到的 "spark-cli"，设计一个统一的命令行工具:

### 命令结构

```bash
spark trending fetch [--lang python] [--since daily] [--top 10]
spark trending analyze [--repo-url URL] [--local-path PATH]
spark trending digest [--date 2026-04-14] [--format markdown]
spark trending publish [--site-dir PATH]
spark trending run [--config spark.yaml]  # 一键执行全流水线
```

### 配置文件

```yaml
# spark.yaml
trending:
  languages: ['python', 'typescript', 'rust', 'go']
  since: daily
  top_n: 10

analysis:
  engine: repomix+claude  # 或 claude-code, analyze-repo
  claude_model: claude-sonnet-4-6
  output_dir: references/

publishing:
  engine: hugo
  site_dir: ./trending-site
  deploy: github-pages

schedule:
  cron: '0 2 * * *'  # UTC
```

### 技术栈建议

| 组件 | 技术 | 理由 |
|---|---|---|
| CLI 框架 | Python + Click/Typer | 开发快，与 gtrending 同语言 |
| 分析引擎 | Repomix + Claude API | 最成熟的组合 |
| 报告模板 | Jinja2 | 灵活的 Markdown 模板 |
| 站点生成 | Hugo | 最快的 SSG |
| 部署 | GitHub Actions + Pages | 免费 + 自动化 |
| 数据存储 | SQLite 或 JSON 文件 | 轻量，存储历史分析结果 |

---

## 六、现成可用的项目参考

如果不想从零开始，以下项目可以直接使用或 Fork:

| 项目 | 功能 | Stars | 推荐用途 |
|---|---|---|---|
| [TrendRadar](https://github.com/sansan0/TrendRadar) | AI 趋势分析推送系统，v5.0 支持 100+ LLM | v5.0 | **最接近目标**，可直接用 |
| [trend-monitor](https://github.com/dongzhang84/trend-monitor) | 每日 AI/Tech 趋势摘要，6 数据源，邮件推送 | 活跃 | 参考数据采集架构 |
| [Repomix](https://github.com/yamadashy/repomix) | 仓库→AI 友好文件打包器 | 20k+ | 核心分析组件 |
| [analyzeRepo](https://github.com/rlnorthcutt/analyzeRepo) | Go CLI: repo → 3 个分析文档 | 新 | 快速单仓库分析 |
| [DeepWiki](https://github.com/AsyncFuncAI/deepwiki-open) | repo → Wiki 文档 + 图表 | 新 | 生成交互式文档 |
| [github-trending-api](https://github.com/antonkomarev/github-trending-api) | Rust 微服务，生产级 Trending API | 成熟 | 自建 API 服务 |
| [github-trending-archive](https://github.com/antonkomarev/github-trending-archive) | 每日历史 Trending 归档 | 成熟 | 历史趋势分析 |

---

## 七、推荐实施路径

### Phase 1: 最小可用 MVP (1 周)

```
gtrending (Python) → 手动选取 top 5 → Repomix + Claude API 分析 → Markdown 文件
```

- 安装 `gtrending`，手动运行获取 trending 列表
- 用 Repomix 打包 top 5 仓库
- 用 Claude API 生成分析报告
- 输出为 Markdown 文件

### Phase 2: 自动化流水线 (2-3 周)

```
GitHub Actions cron → fetch_trending.py → clone_repos.py → analyze_repos.py → Hugo → GitHub Pages
```

- 实现完整的 Python 脚本链
- 配置 GitHub Actions 定时运行
- Hugo 站点 + GitHub Pages 自动部署

### Phase 3: CLI 工具 + 高级功能 (1-2 月)

```
spark CLI → 全流水线一键执行 → 历史趋势分析 → 主题/邮件订阅
```

- 封装为 `spark` CLI 工具
- SQLite 存储历史数据
- 趋势对比 (本周 vs 上周)
- 邮件/RSS 订阅推送

---

## 八、关键风险与注意事项

| 风险 | 影响 | 应对 |
|---|---|---|
| GitHub Trending 页面 HTML 变动 | 爬取脚本失效 | 使用 `gtrending` 等社区维护的库；备选 Search API |
| Claude API 成本 | 每日分析 10+ 仓库的费用 | 使用 `--maxTokens` 限制输出；批量分析减少调用；用 Haiku 模型降成本 |
| GitHub API Rate Limit | 30 req/min (认证) | 缓存结果；避免重复分析；使用 `--depth 1` 克隆 |
| Clone 大仓库耗时 | 分析流水线超时 | `git clone --depth 1`；Repomix `--remote` 模式无需 clone |
| Trending 数据无官方 API | 长期稳定性风险 | 自建 `github-trending-api` Rust 服务；或用 `github-trending-archive` 做备份 |

---

## 九、数据来源

- [gtrending (Python)](https://github.com/hedyhli/gtrending)
- [@huchenme/github-trending (Node.js)](https://github.com/huchenme/github-trending-api)
- [antonkomarev/github-trending-api (Rust)](https://github.com/antonkomarev/github-trending-api)
- [antonkomarev/github-trending-archive](https://github.com/antonkomarev/github-trending-archive)
- [TrendRadar](https://github.com/sansan0/TrendRadar)
- [trend-monitor](https://github.com/dongzhang84/trend-monitor)
- [Repomix](https://github.com/yamadashy/repomix)
- [analyzeRepo](https://github.com/rlnorthcutt/analyzeRepo)
- [DeepWiki](https://github.com/AsyncFuncAI/deepwiki-open)
- [Claude Code CLI Docs](https://code.claude.com/docs/en/sub-agents)
- [GitHub Search API](https://docs.github.com/en/rest/search)
- [Hugo SSG](https://gohugo.io/)
- [peaceiris/actions-hugo](https://github.com/peaceiris/actions-hugo)
- [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages)
