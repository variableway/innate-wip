# GitHub Daily Trending 自动化分析系统：技术实现报告

> 任务来源：`ideas/trending-analysis/analysis-skill-tools.md`
> 目标：设计并实现一个可自动获取 GitHub Trending 项目、使用 AI CLI 工具（Claude Code / Kimi CLI）进行深度分析、并将结果发布到网站/博客的端到端系统。

---

## 1. 系统架构总览

整个系统分为两条主线，对应 Task 1 和 Task 2：

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Data Ingestion Layer                              │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────────┐  │
│  │ GitHub Trending  │    │ GitHub Search    │    │ Manual / RSS /       │  │
│  │ API / Scraping   │    │ API (Daily Top)  │    │ Newsletter Input     │  │
│  └────────┬─────────┘    └────────┬─────────┘    └──────────┬───────────┘  │
└───────────┼───────────────────────┼─────────────────────────┼──────────────┘
            │                       │                         │
            └───────────────────────┼─────────────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Orchestration & Storage                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  Scheduler (GitHub Actions / cron / Airflow)                        │    │
│  │  └─> Daily Trigger @ 08:00 UTC                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  Repo Metadata DB (SQLite / PostgreSQL)                             │    │
│  │  ├─ repo_url, clone_url, language, stars_gained, category           │    │
│  │  ├─ cloned_path: references/<category-folder>/<repo-name>           │    │
│  │  ├─ analysis_status: pending / analyzing / done / failed            │    │
│  │  └─ created_at, analyzed_at, report_url                             │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
            ┌───────────────────────┼───────────────────────┐
            ▼                       ▼                       ▼
┌───────────────────┐   ┌───────────────────┐   ┌───────────────────┐
│   Task 1 Pipeline │   │   Task 1 Pipeline │   │   Task 1 Pipeline │
│   (Repo A)        │   │   (Repo B)        │   │   (Repo C)        │
│                   │   │                   │   │                   │
│  1. git clone     │   │  1. git clone     │   │  1. git clone     │
│  2. spark-cli     │   │  2. spark-cli     │   │  2. spark-cli     │
│     analyze       │   │     analyze       │   │     analyze       │
│  3. save report   │   │  3. save report   │   │  3. save report   │
└─────────┬─────────┘   └─────────┬─────────┘   └─────────┬─────────┘
          │                       │                       │
          └───────────────────────┼───────────────────────┘
                                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Task 2: Aggregation & Publishing                    │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────────┐  │
│  │ Report Summarizer│    │  Trend Dashboard │    │  Static Site / Blog  │  │
│  │ (AI-powered)     │    │  Generator       │    │  Publisher           │  │
│  └──────────────────┘    └──────────────────┘    └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Task 1 详细实现：单项目深度分析流水线

### 2.1 数据获取层：GitHub Trending 数据源

GitHub 官方没有专门的 Trending API（2022 年后已弃用），但有多种替代方案：

| 数据源 | 获取方式 | 优点 | 缺点 |
|--------|----------|------|------|
| **GitHub Search API** | `search/repositories?q=created:>YYYY-MM-DD&sort=stars&order=desc` | 官方 API，稳定 | 速率限制严格（10 req/min 未认证），无法精确获取 "trending" |
| **gh-trending-api (第三方)** | `github.com/huchenme/github-trending-api` 等社区服务 | 直接返回 trending 数据 | 依赖第三方维护，可能不稳定 |
| **Web Scraping** | 直接解析 `github.com/trending` HTML | 数据最准确 | 易因 GitHub UI 变更而失效，需注意 robots.txt |
| **GitHub Events API** | 监听 `WatchEvent` / `CreateEvent` | 实时性高 | 数据噪音大，需要复杂清洗 |

**推荐策略**：
- **主力**：使用一个稳定的第三方 Trending API 包装器（如 `github-trending-api` 的公开实例或自建 scraper）。
- **备份**：每日定时用 GitHub Search API 获取 "今日新增且 star 增长最快" 的仓库作为补充。
- **手动入口**：提供一个 `spark-cli add <repo-url>` 命令，允许用户手动添加感兴趣的仓库到分析队列。

### 2.2 存储与目录结构设计

克隆目录遵循 `references/<category-folder>/<repo-name>/` 的结构：

```bash
references/
├── ai-ml/
│   ├── llama.cpp/
│   ├── stable-diffusion-webui/
│   └── ...
├── devtools/
│   ├── biome/
│   ├── turbo/
│   └── ...
├── frontend/
│   ├── shadcn-ui/
│   └── ...
└── unknown/          # 自动分类失败时的兜底文件夹
```

**分类逻辑**：
- 基于 GitHub Topics（`topics` 字段）进行关键词映射。
- 示例映射表：
  - `llm`, `machine-learning`, `ai`, `neural-networks` → `ai-ml`
  - `cli`, `developer-tools`, `vscode`, `eslint` → `devtools`
  - `react`, `vue`, `css`, `ui` → `frontend`
  - `rust`, `python`, `go`（纯语言标签无其他主题）→ 按语言分子目录 `lang-rust/`, `lang-python/`

### 2.3 自动克隆触发机制

推荐使用 **GitHub Actions** 作为调度器（零服务器成本）：

```yaml
# .github/workflows/daily-trending-analysis.yml
name: Daily Trending Analysis
on:
  schedule:
    - cron: '0 8 * * *'  # 每天 UTC 08:00 运行
  workflow_dispatch:

jobs:
  ingest-and-analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      
      - name: Install spark-cli
        run: pip install -e ./spark-cli
      
      - name: Fetch trending repos
        run: python scripts/fetch_trending.py --output daily_queue.json
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Clone and analyze
        run: python scripts/batch_analyze.py --queue daily_queue.json --max-repos 10
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          # 或 KIMI_API_KEY: ${{ secrets.KIMI_API_KEY }}
```

### 2.4 spark-cli 设计：AI 驱动的仓库分析 CLI

`spark-cli` 是本系统的核心分析引擎。它是一个 Python CLI 工具，封装了对 Kimi CLI / Claude Code 的调用。

#### 核心命令设计

```bash
# 分析当前目录下的 Git 仓库
spark-cli analyze --repo-path ./references/ai-ml/llama.cpp --output ./reports/ai-ml/llama-cpp.md

# 指定分析深度
spark-cli analyze --depth quick|standard|deep

# 批量分析（从队列文件读取）
spark-cli batch --queue daily_queue.json --workers 3

# 手动添加仓库到分析队列
spark-cli add https://github.com/... --category ai-ml

# 生成每日汇总报告
spark-cli summarize --date 2026-04-14 --output ./daily-reports/
```

#### 内部实现逻辑

`spark-cli analyze` 的伪代码：

```python
def analyze_repo(repo_path: str, output_path: str, depth: str = "standard"):
    # 1. 预处理：提取仓库元数据
    metadata = extract_metadata(repo_path)
    
    # 2. 选择关键文件（避免 token 爆炸）
    key_files = select_key_files(repo_path, depth)
    #    - README.md (必含)
    #    - package.json, Cargo.toml, pyproject.toml (语言生态)
    #    - src/ 下按目录深度和文件大小筛选的 Top N 文件
    
    # 3. 构建 Prompt
    prompt = build_analysis_prompt(metadata, key_files)
    
    # 4. 调用 AI CLI 工具
    if engine == "claude":
        report = run_claude_code(repo_path, prompt)
    elif engine == "kimi":
        report = run_kimi_cli(repo_path, prompt)
    
    # 5. 后处理：保存报告、提取标签、生成摘要
    save_report(report, output_path)
    update_db(repo_path, status="done", report_url=output_path)
```

#### Prompt 模板示例（标准深度）

```markdown
You are an expert software architect. Please analyze the following GitHub repository:

Repository: {{repo_name}}
Language: {{primary_language}}
Topics: {{topics}}
Stars: {{stars}} | Forks: {{forks}}

Key Files:
{{file_contents}}

Please provide a structured analysis covering:
1. **What it does** (one sentence summary)
2. **Problem it solves** (why does it exist?)
3. **Architecture highlights** (key design patterns, tech stack choices)
4. **Unique innovations** (what makes it stand out from alternatives?)
5. **Adoption signals** (who would use this, and why now?)
6. **Caveats / Risks** (license issues, immaturity, security concerns)
7. **Related projects** (top 3-5 comparable tools)

Output in Markdown format.
```

#### 与 Kimi CLI / Claude Code 的集成方式

| 集成方式 | 适用场景 | 实现方式 |
|----------|----------|----------|
| **方式 A: 调用底层 API** (`anthropic-sdk` / `openai-sdk`) | 批量处理、需要精确控制 token | Python SDK 直接调用，将文件内容作为 context 传入 |
| **方式 B: 调用本地 CLI** (`claude` / `kimi`) | 利用 CLI 的 Agent 能力（自动读取文件、执行命令） | `subprocess.run(["kimi", "-p", prompt], cwd=repo_path, capture_output=True)` |
| **方式 C: MCP (Model Context Protocol)** | 需要 AI 工具直接操作文件系统 | 注册一个 MCP server，暴露 `read_file`, `list_dir`, `run_command` 等能力 |

**推荐策略**：
- **MVP 阶段**：用 **方式 B**（调用本地 CLI），因为 Kimi CLI 和 Claude Code 都内置了优秀的文件系统 Agent 能力，你只需要给一个 Prompt，它自己就会去读取 README、分析目录结构、甚至运行 `npm install` 来检查依赖。
- **规模化阶段**：当每天需要分析 50+ 仓库时，切换到 **方式 A**（API 调用），自己实现文件选择逻辑，成本更低且更可控。

### 2.5 文件选择算法（控制 Token 成本）

盲目把整个仓库塞进 AI context 会导致：
- Token 费用爆炸（Claude 3.5 Sonnet 的 200K context 虽大，但输入 token 依然收费）。
- 输出质量下降（AI 被噪音淹没）。

**推荐的分层文件选择策略**：

```python
def select_key_files(repo_path, depth="standard"):
    files = []
    
    # Tier 1: 必读的元数据文件（~500 tokens）
    files.extend(read_if_exists([
        "README.md", "README.rst", "LICENSE", "CONTRIBUTING.md"
    ]))
    
    # Tier 2: 构建/依赖文件（~500-2000 tokens）
    files.extend(read_if_exists([
        "package.json", "Cargo.toml", "pyproject.toml", "setup.py",
        "go.mod", "requirements.txt", "Makefile"
    ]))
    
    # Tier 3: 架构入口文件（~1000-5000 tokens）
    files.extend(glob_priority([
        "src/main.*", "src/index.*", "src/lib.rs",
        "app/main.py", "cmd/*/main.go"
    ]))
    
    # Tier 4: 深度分析时追加核心模块（可控扩展）
    if depth == "deep":
        core_modules = find_largest_modules(repo_path, max_files=5)
        files.extend(core_modules)
    
    return truncate_to_budget(files, max_tokens=120000)
```

---

## 3. Task 2 详细实现：趋势汇总与发布

### 3.1 分析结果聚合层

每个仓库的分析报告是一份独立的 Markdown 文件。Task 2 需要：
1. 读取当日所有报告
2. 按领域分类（AI、DevTools、Frontend 等）
3. 提取关键标签和创新点
4. 生成一篇可读性强的「每日 GitHub 趋势洞察」文章

**聚合数据结构示例**（`daily_summary.json`）：

```json
{
  "date": "2026-04-14",
  "total_repos": 10,
  "categories": {
    "ai-ml": {
      "count": 3,
      "repos": ["llama.cpp", "open-interpreter", "..."],
      "themes": ["edge AI", "local LLM", "agent frameworks"]
    },
    "devtools": {
      "count": 4,
      "repos": ["biome", "turbo", "..."],
      "themes": ["Rust-based tooling", "monorepo solutions"]
    }
  },
  "highlights": [
    {
      "repo": "llama.cpp",
      "tagline": "Running LLMs on consumer hardware",
      "why_it_matters": " Democratizes access to large language models by enabling CPU/GPU inference on everyday devices."
    }
  ]
}
```

**生成方式**：
- 先由规则引擎提取结构化数据（YAML frontmatter 或 JSON）。
- 再由一个「Summarizer Prompt」调用 AI 生成最终的 narrative。

### 3.2 汇总 Prompt 示例

```markdown
You are a tech editor writing a daily newsletter. Here are the analysis reports for today's top GitHub trending repos ({{date}}):

{{reports}}

Write a ~1500 word blog post in Markdown with the following sections:
1. **Daily Pulse**: 1-paragraph overview of today's biggest trend.
2. **Category Spotlights**: 2-3 paragraphs per major category.
3. **Project of the Day**: Deep dive into the most innovative repo.
4. **Worth Watching**: Bullet list of other notable projects with 1-sentence summaries.
5. **Thematic Takeaway**: What do these projects collectively signal about the direction of open source?

Tone: enthusiastic but analytical. Avoid hype. Include links to each repo.
```

### 3.3 发布层：网站 / 博客 /  newsletter

推荐几种零成本/低成本的发布方案：

| 方案 | 技术栈 | 优点 | 缺点 |
|------|--------|------|------|
| **A. GitHub Pages + Jekyll/MkDocs** | Markdown → 静态 HTML | 完全免费，与 GitHub 工作流天然集成 | 设计灵活性一般 |
| **B. Vercel + Next.js / Astro** | 现代 React/Svelte 框架，SSG | 高性能，可自定义精美 UI | 需要一点前端开发 |
| **C. Notion / 飞书文档（自动同步）** | API 写入页面 | 零开发，自带阅读体验和评论功能 | 品牌感弱，SEO 差 |
| **D. 微信公众号 / 小报童 newsletter** | 人工或 API 辅助排版 | 直接触达中文读者， monetization 潜力大 | 需要内容运营精力 |

**推荐组合**：
- **英文/全球受众**：Astro 静态站点部署在 Vercel，自动从 `daily-reports/` 目录生成文章列表和 RSS feed。
- **中文受众**：小报童/Newsletter（付费订阅）+ 微信公众号（流量放大）。
- **双管齐下**：同一份 Markdown 通过 CI pipeline 同时推送到 GitHub Pages（SEO）和 微信公众号（私域）。

### 3.4 自动化发布流水线示例

```yaml
# .github/workflows/publish-report.yml
name: Publish Daily Report
needs: ingest-and-analyze
on:
  workflow_run:
    workflows: ["Daily Trending Analysis"]
    types: [completed]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Build Astro site
        run: cd site && npm install && npm run build
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./site/dist
      
      - name: Sync to Notion (optional)
        run: python scripts/publish_notion.py --report daily-reports/2026-04-14.md
        env:
          NOTION_TOKEN: ${{ secrets.NOTION_TOKEN }}
```

---

## 4. 推荐技术栈

| 层级 | 推荐工具 | 备选方案 |
|------|----------|----------|
| **调度器** | GitHub Actions | cron + 自建服务器, Airflow |
| **编程语言** | Python 3.11+ | Node.js / TypeScript |
| **CLI 框架** | `typer` (Python) | `click`, `argparse` |
| **AI 引擎** | Claude Code CLI (MVP) → Anthropic API (规模化) | Kimi CLI, OpenAI API, local LLM |
| **数据库** | SQLite (MVP) | PostgreSQL, DuckDB |
| **前端站点** | Astro + Tailwind CSS | Next.js, Hugo, Jekyll |
| **部署** | Vercel / GitHub Pages | Netlify, Cloudflare Pages |
| **内容分发** | RSS + Newsletter (Buttondown/ConvertKit) | Substack, 小报童 |

---

## 5. 实施路线图（MVP → 规模化）

### Phase 1: MVP（1-2 周）
- [ ] 编写 `fetch_trending.py`：每日获取 GitHub Trending 前 10 个仓库的元数据。
- [ ] 编写 `spark-cli` 的 `analyze` 命令：调用本地 Claude Code / Kimi CLI 分析单个仓库，输出 Markdown 报告。
- [ ] 建立 `references/` 目录结构和分类映射规则。
- [ ] 设置 GitHub Actions：每日自动触发 `fetch → clone → analyze`。
- [ ] 手动审阅前几天的报告，优化 Prompt。

### Phase 2: 自动化与质量提升（3-4 周）
- [ ] 引入 SQLite 数据库，追踪每个仓库的分析状态和历史。
- [ ] 实现 `spark-cli batch`：并发分析多个仓库，支持失败重试。
- [ ] 优化文件选择算法，控制 token 成本。
- [ ] 实现 `summarize` 命令，生成每日汇总报告。
- [ ] 搭建 Astro 静态站点，自动渲染 `daily-reports/` 目录。

### Phase 3: 发布与运营（5-8 周）
- [ ] 部署站点到 Vercel/GitHub Pages，配置自定义域名。
- [ ] 开通 Newsletter（Buttondown / 小报童），将每日报告推送给订阅者。
- [ ] 增加 RSS feed、Twitter/X 自动发帖。
- [ ] 收集读者反馈，迭代 Prompt 和分类策略。
- [ ] 探索 monetization（赞助、付费深度报告、定制分析服务）。

---

## 6. 关键风险与应对

| 风险 | 可能性 | 影响 | 应对策略 |
|------|--------|------|----------|
| **GitHub Trending 数据源失效** | 中 | 高 | 同时维护 Search API 备份和 scraper 备份两条链路 |
| **AI CLI 成本过高** | 高 | 中 | MVP 用本地 CLI（按订阅付费）；规模化后切换 API + 精简文件选择 |
| **AI 分析质量不稳定** | 中 | 中 | 建立 Prompt 版本管理（A/B 测试），定期用人工评分校准 |
| **仓库过大导致克隆/分析超时** | 高 | 低 | 设置 `--max-repo-size-mb=100` 阈值，超大仓库跳过或只做 README 分析 |
| **内容同质化** | 中 | 中 | 差异化定位：不做简单翻译，而是强调「架构洞察」和「为什么现在火」 |
| **版权/合规风险** | 低 | 高 | 明确引用仓库来源，不搬运代码，只做事实性分析和评论 |

---

## 7. 一句话总结

> **系统的核心设计是「调度器 + spark-cli（AI 分析引擎）+ 静态站点发布」的三层架构。**
>
> **MVP 阶段用 GitHub Actions 每日调度，调用 Claude Code / Kimi CLI 做文件级深度分析，输出 Markdown 报告；规模化后切换到 API 调用以降低成本，并叠加 Astro 站点和 Newsletter 形成完整的内容分发闭环。**
