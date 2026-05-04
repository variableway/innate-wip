# Content Pipeline Research Report

## Table of Contents
1. [WaytoAGI (通往AGI之路)](#1-waytoagi-通往agi之路)
2. [Feishu (Lark) API for Wiki Content](#2-feishu-lark-api-for-wiki-content)
3. [Content Input/Sourcing Tools](#3-content-inputsourcing-tools)
4. [Content Analysis Tools](#4-content-analysis-tools)
5. [Content Generation & Repurposing Tools](#5-content-generation--repurposing-tools)
6. [Content Operation Systems & Open Source Projects](#6-content-operation-systems--open-source-projects)
7. [Monetization on Chinese Social Media Platforms](#7-monetization-on-chinese-social-media-platforms)
8. [Technical Approaches for Building a Content Pipeline](#8-technical-approaches-for-building-a-content-pipeline)

---

## 1. WaytoAGI (通往AGI之路)

### What is WaytoAGI?

WaytoAGI (通往AGI之路 / The Way to AGI) is the **largest and most comprehensive Chinese AI open-source knowledge base and learning community**.

- **Founded**: April 26, 2023
- **Scale**: 7 million+ users, tens of millions of visits, no paid promotion
- **Mission**: "To achieve AGI may be a long journey, but our goal is to help everyone learn with fewer detours and empower more people through AI."
- **Philosophy**: "人人都是创作者" (Everyone is a creator) - community-driven collaborative knowledge building
- **Platforms**: Hosted on Feishu (飞书) wiki + website at [waytoagi.com](https://www.waytoagi.com/)

### Content Structure (6 Major Sections)

| Part | Topic | Description |
|------|-------|-------------|
| Part 1 | AI 认知 (AI Cognition) | Foundational AI knowledge, concepts, paradigms |
| Part 2 | AI 短片 (AI Shorts) | Brief tutorials, quick-start guides, bite-sized learning |
| Part 3 | AI 音乐 (AI Music) | AI-generated music tools and techniques |
| Part 4 | AI 辅助 (AI Assistance) | Using AI tools for daily work and productivity |
| Part 5 | AI 商业变现 (AI Monetization) | Business strategies and revenue generation with AI |
| Part 6 | AI Agent 智能体 (AI Agents) | Intelligent agents, autonomous AI systems development |

Additional features:
- **AI Tool Station (AI工具站)**: Thousands of categorized AI tools
- **Open-source Wiki**: Collaboratively built, systematic learning paths
- **Community Q&A**: Question-and-answer section on the website
- **Social Media**: Active on Twitter/X (@WaytoAGI)
- **AIPO Events**: Monthly offline AI meetups and AIGC competitions

### Key URLs
- Website: https://www.waytoagi.com/
- Feishu Wiki: https://waytoagi.feishu.cn/wiki
- Feishu Docs (overview): https://docs.feishu.cn/v/wiki/Hxrbwx4XridGlWkp0ZtcqKVanBn/a1
- Usage Guide: https://waytoagi.feishu.cn/wiki/IvrXwCuX1i0nwWk2YFxcdnYDnrc

### GitHub Organization
- **GitHub Org**: https://github.com/Way-To-AGI
- Key repos:
  - `remove_cursor_custom_mode` - Cursor IDE custom mode manager
  - `lmstudio-zh-help` - LM Studio Chinese mirror switcher
- Related community repo: https://github.com/iaiuse/WaytoAIGuide (meetup guide)
- Related ecosystem: https://github.com/fogsightai/fogsight (AI agent/animation engine)
- Related resource list: https://github.com/EmbraceAGI/Awesome-AGI

---

## 2. Feishu (Lark) API for Wiki Content

### Authentication

**Token Types:**
- `tenant_access_token`: For app-as-tenant operations (most common for automation); valid up to 2 hours
- `user_access_token`: For operations on behalf of a specific user
- `app_access_token`: For app identity operations

**How to get tenant_access_token:**
1. Create a Custom App in [Feishu Open Platform](https://open.feishu.cn/)
2. Get App ID and App Secret
3. Call: `POST https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal`
4. Use the returned token in request headers: `Authorization: Bearer <token>`

**Required Permission Scopes for Wiki:**
- `wiki:wiki:readonly` - Read wiki spaces and nodes
- `docx:document:readonly` - Read document content
- `drive:drive:readonly` - Read drive/file content

**Documentation:**
- Token guide: https://open.feishu.cn/document/server-docs/api-call-guide/calling-process/get-access-token
- tenant_access_token: https://open.feishu.cn/document/server-docs/authentication-management/access-token/tenant_access_token_internal
- Access guide: https://open.feishu.cn/document/ukTMukTMukTM/ugDOyYjL4gjM24CO4IjN

### API Endpoints for Wiki Content

#### Step-by-step workflow to fetch all wiki content:

| Step | API | Method | Purpose |
|------|-----|--------|---------|
| 1 | `/open-apis/wiki/v2/spaces` | GET | List all wiki spaces |
| 2 | `/open-apis/wiki/v2/spaces/{space_id}` | GET | Get space info |
| 3 | `/open-apis/wiki/v2/spaces/{space_id}/nodes` | GET | List all nodes in a space (paginated) |
| 4 | `/open-apis/wiki/v2/spaces/get_node?token={node_token}` | GET | Get node info (returns `obj_token` and `obj_type`) |
| 5 | `/open-apis/docx/v1/documents/{document_id}/blocks` | GET | Get document block content using `obj_token` |
| 6 | `/open-apis/docx/v1/documents/{document_id}/raw_content` | GET | Get document plain text content |
| 7 | `/open-apis/docs/v1/content` | GET | Get document content in Markdown format |

**Key insight**: The node's `obj_token` from Step 4 serves as the `document_id` in Steps 5-7.

#### Rate Limits

| API Operation | Rate Limit (QPS) |
|---|---|
| Query All Blocks | 5/sec |
| Get Single Block | 5/sec |
| Query Raw Content | 5/sec |
| Create Block | 3/sec |
| Update Block | 3/sec |
| Delete Blocks | 3/sec |
| Create Online Document | 5/sec (10,000/day) |

When rate limits are exceeded, the API returns HTTP 400 with a rate-limit error code.

General rate limit docs: https://open.larksuite.com/document/ukTMukTMukTM/uUzN04SN3QjL1cDN

#### Permissions & Scopes

- **Required Scope**: App needs `docx:document` or `docx:document:readonly` scope to read document content
- **Token Types**: Supports both `tenant_access_token` (app-level) and `user_access_token` (user-level)
- **User Access Token**: The user must have read permission on the document
- **Scope List Reference**: https://open.feishu.cn/document/ukTMukTMukTM/uYTM5UjL2ETO14iNxkTN/scope-list

**API Documentation:**
- Wiki overview: https://open.feishu.cn/document/ukTMukTMukTM/uUDN04SN0QjL1QDN/wiki-overview
- List spaces: https://open.larksuite.com/document/ukTMukTMukTM/uUDN04SN0QjL1QDN/wiki-v2/space/list
- Get node info: https://open.feishu.cn/document/server-docs/docs/wiki-v2/space-node/get_node
- Space info: https://open.feishu.cn/document/ukTMukTMukTM/uUDN04SN0QjL1QDN/wiki-v2/space/get
- Query all blocks: https://open.larksuite.com/document/ukTMukTMukTM/uUDN04SN0QjL1QDN/document-docx/docx-v1/document-block/list
- Get docs content (markdown): https://open.larksuite.com/document/ukTMukTMukTM/uUDN04SN0QjL1QDN/docs-v1/content/get
- FAQ: https://open.feishu.cn/document/server-docs/docs/faq
- Export API: https://open.feishu.cn/document/server-docs/docs/drive-v1/export_task/export-user-guide

### SDKs and Libraries

| Language | Package | Install | Link |
|----------|---------|---------|------|
| Python (official) | `lark-oapi` | `pip install lark-oapi -U` | https://open.feishu.cn/document/server-side-sdk/python--sdk/preparations-before-development |
| Python (community) | `feishu-python-sdk` | `pip install feishu-python-sdk` | https://github.com/cyclone-robotics/feishu-python-sdk |
| Python (community) | `larkpy` | `pip install larkpy` | https://github.com/Benature/larkpy |
| Go | Official SDK | - | https://open.feishu.cn/document/server-docs/server-side-sdk |
| Java | Official SDK | - | https://open.feishu.cn/document/server-docs/server-side-sdk |
| Node.js | Official SDK | - | https://open.feishu.cn/document/server-docs/server-side-sdk |

**Official SDK GitHub**: https://github.com/larksuite/oapi-sdk-python (supports Go, Python, Java, NodeJS)

**Python SDK Quick Start:**
```python
import lark_oapi as lark

client = lark.Client.builder() \
    .app_id("your_app_id") \
    .app_secret("your_app_secret") \
    .log_level(lark.LogLevel.DEBUG) \
    .build()
```

**Lark MCP Server**: https://docs.uselark.ai/api/python/ -- allows AI assistants to call Lark APIs directly.

### Tools for Feishu Wiki to Markdown

| Tool | GitHub | Key Features |
|------|--------|-------------|
| **feishu-doc-export** | https://github.com/eternalfree/feishu-doc-export | Cross-platform one-click export; MD/DOCX/PDF; preserves directory structure |
| **feishu-backup** | https://github.com/dicarne/feishu-backup | Backup to Markdown; includes images; supports doc/docx only |
| **doc-export-helper** | https://github.com/sancijun/doc-export-helper | Configurable image/attachment upload destinations |
| **Cloud Document Converter** | Browser extension | One-click Feishu to Markdown conversion |
| **markdown-export** | https://github.com/yang-shuohao/markdown-export | Browser extension, right-click export from Feishu |
| **Feishu/Lark OpenAPI MCP** | https://lobehub.com/mcp/larksuite-lark-mcp | MCP server for document content retrieval and wiki node search |

**Best tool for automated pipeline**: `feishu-doc-export` - command-line, preserves directory structure, supports Markdown output.

---

## 3. Content Input/Sourcing Tools

### 3.1 RSS Feed Aggregators (Self-Hosted)

| Tool | Language | Best For | Key Features | Link |
|------|----------|----------|--------------|------|
| **FreshRSS** | PHP | Features & customization | Multi-user, plugin extensions, Google Reader API sync, AI summary extensions | https://github.com/FreshRSS/FreshRSS |
| **Miniflux** | Go | Simplicity & speed | Minimalist design, REST API, lightweight | https://github.com/miniflux/v2 |
| **Tiny Tiny RSS** | PHP | Power users | Themes, plugins, OPML import/export, own API | https://tt-rss.org |
| **RSSHub** | Node.js | RSS generation | Generates RSS from 300+ websites/sources | https://github.com/DIYgod/RSSHub |

**Comparison of self-hosted RSS readers:**

| Feature | FreshRSS | Miniflux | Tiny Tiny RSS |
|---|---|---|---|
| Language | PHP | Go | PHP |
| Multi-User | Yes | Yes | Yes |
| Plugins/Extensions | Yes | Minimal | Yes (themes + plugins) |
| API Sync | Google Reader API | REST API | Own API |
| OPML Support | Yes | Yes | Yes |
| License | AGPL-3.0 | Apache 2.0 | GPL-3.0 |

**Common deployment**: FreshRSS + RSSHub via Docker Compose, with AI summary extensions.

### 3.2 Hosted/Cloud RSS & Content Aggregation

| Tool | API Access | Automation | Best For | Pricing |
|------|-----------|------------|----------|---------|
| **Feedly** | Threat Intelligence API (paid) | Zapier integrations | Enterprise/threat intelligence, AI-powered insights (Leo AI) | Free tier + paid |
| **Inoreader** | Full API (Pro+ plans) | IFTTT, Zapier, n8n | Power users, flexible feed management, built-in Rules engine | Free tier + paid |
| **Readless** | - | - | Newsletter management | - |
| **Meco** | - | - | Newsletter management | - |

**Key insight**: Inoreader integrates directly with n8n, IFTTT, and Zapier for programmatic content distribution. Its built-in Rules engine can auto-tag, notify, and export content to external services. Feedly has a stronger AI engine (Leo) but is more enterprise-focused.

### 3.3 Newsletter & Email Content Sourcing

| Tool | Description | Link |
|------|-------------|------|
| **Readwise Reader** | Aggregates newsletters, RSS, web articles into one reading inbox with AI summaries | https://readwise.io/read |
| **Meco** | Dedicated newsletter inbox, separates newsletters from email | https://meco.app |
| **Substack** | Newsletter platform with RSS feed output for each publication | https://substack.com |
| **Mailbrew** | Create digest emails from multiple sources (RSS, Twitter, Reddit) | https://mailbrew.com |

### 3.4 Social Media Monitoring / Content Sourcing

| Tool | Type | Description | Link |
|------|------|-------------|------|
| **RSSHub** | RSS Generator | Can generate RSS feeds from Twitter, Weibo, Xiaohongshu, Bilibili, etc. | https://github.com/DIYgod/RSSHub |
| **Huginn** | Agent Platform | Self-hosted; monitors social media, analyzes, acts on data | https://github.com/huginn/huginn |
| **Brandwatch** | SaaS | Social listening and content monitoring at scale | https://www.brandwatch.com |
| **Talkwalker** | SaaS | Social media monitoring and analytics | https://www.talkwalker.com |

---

## 4. Content Analysis Tools

### 4.1 AI-Powered Trend Detection & Analysis

| Tool | Type | Key Features | Link |
|------|------|-------------|------|
| **Feedly Leo AI** | AI Research Assistant | AI-powered trend tracking, topic clustering, competitive intelligence | https://feedly.com |
| **Exploding Topics** | Trend Discovery | Identifies rapidly growing trends before they peak | https://explodingtopics.com |
| **Google Trends** | Free Tool | Search trend analysis, comparison, geographic breakdown | https://trends.google.com |
| **Revuze** | AI Market Analysis | Consumer brand insights through AI-driven listening and analysis | https://www.revuze.it |
| **Brandwatch** | Social Listening | AI-powered social media analysis, trend spotting, sentiment analysis | https://www.brandwatch.com |
| **Sprout Social** | Social Analytics | AI-powered listening, competitive analysis, trend identification | https://sproutsocial.com |

### 4.2 Content Classification & Processing (Open Source)

| Tool | Description | Link |
|------|-------------|------|
| **FreshRSS AI Summary Extension** | Summarize articles with OpenAI, Gemini, Claude, or Ollama | https://github.com/FreshRSS/Extensions |
| **xExtension-ArticleSummary** | FreshRSS extension for article summaries via OpenAI-compatible API | https://github.com/LiangWei88/xExtension-ArticleSummary |
| **MrRSS** | AI translation/summarization of RSS feeds with caching | https://github.com/WCY-dt/MrRSS |
| **Rig RSS Summarizer** | AI-based summarization with relevance scores | https://github.com/0xPlaygrounds/rig-rss-summarizer-example |

### 4.3 AI Content Detection (for classifying human vs. AI content)

| Tool | Purpose | Accuracy |
|------|---------|----------|
| **GPTZero** | Detect AI-generated text | Leading accuracy in benchmarks |
| **Originality.ai** | AI content detection + plagiarism | High accuracy for GPT-4 content |
| **Copyleaks** | Enterprise AI detection | Supports multiple AI models |
| **Winston AI** | Multi-modal detection (text, image) | Strong in educational contexts |

**Note**: Chinese social media platforms (Xiaohongshu, Douyin, etc.) now mandate labeling AI-generated content with visible and hidden markers as of 2025.

### 4.4 Building Your Own Content Analysis Pipeline

**Recommended approach using LLM APIs:**
1. **Content Deduplication**: Use vector embeddings (e.g., OpenAI text-embedding-3-small) + cosine similarity to detect duplicates and near-duplicates
2. **Topic Classification**: Use LLM to classify content into predefined categories
3. **Trend Detection**: Track content frequency per topic over time; detect spikes
4. **Novelty Detection**: Compare new content embeddings against historical embeddings; flag content with low similarity scores as "new"
5. **Summarization**: Use LLM to generate concise summaries for each piece of content
6. **Priority Scoring**: Combine relevance, novelty, and engagement signals into a single priority score

---

## 5. Content Generation & Repurposing Tools

### 5.1 AI Content Generation APIs

| API/Tool | Best For | Key Features | Pricing |
|----------|----------|-------------|---------|
| **OpenAI GPT-4o / o1** | General content generation | Text, code, structured output, function calling | Pay-per-token |
| **Anthropic Claude** | Long-form content, analysis | 200K context window, strong at nuanced writing | Pay-per-token |
| **Google Gemini** | Multi-modal content | Text, image, video understanding | Free tier + paid |
| **DeepSeek** | Chinese-language content | Strong Chinese language capabilities, cost-effective | Very competitive pricing |
| **Moonshot (Kimi)** | Chinese content | Chinese AI model with strong long-context | Free tier + paid |
| **GLM (Zhipu AI)** | Chinese content | ChatGLM series, bilingual | Free tier + paid |

### 5.2 Content Repurposing Tools

| Tool | Best For | Key Feature | Link |
|------|----------|-------------|------|
| **Repurpose.io** | Cross-platform video/audio distribution | Automated publishing to TikTok, Reels, Shorts from one upload | https://repurpose.io |
| **Recast Studio** | Video-first repurposing | Long-form video to short clips with captions and reframing | https://recast.studio |
| **WaveGen** | Multi-format transformation | Blogs/videos/podcasts to carousels & social posts | https://wavegen.ai |
| **quso.ai** | High-volume short-form content | 1 video to 15+ posts, auto-scheduling | https://quso.ai |
| **Typeface** | Enterprise content workflows | Video to blogs, emails, social posts | https://www.typeface.ai |
| **Opus Clip** | Long video to short clips | AI identifies best moments, auto-captions | https://www.opus.pro |

### 5.3 Social Media Scheduling Tools

| Tool | Type | Platforms Supported | Self-Hosted | Link |
|------|------|-------------------|-------------|------|
| **Postiz** | Open Source | 25+ platforms (X, Bluesky, Mastodon, Discord, LinkedIn, etc.) | Yes | https://github.com/gitroomhq/postiz-app |
| **Buffer** | SaaS | X, LinkedIn, Instagram, Facebook, Pinterest, TikTok | No | https://buffer.com |
| **Hootsuite** | SaaS | 35+ platforms | No | https://hootsuite.com |
| **Later** | SaaS | Instagram, TikTok, Pinterest, X, LinkedIn | No | https://later.com |
| **eClincher** | SaaS | Multi-platform, RSS/blog-to-social automation | No | https://eclincher.com |
| **Sprout Social** | SaaS | Multi-platform with AI optimization | No | https://sproutsocial.com |

**Postiz** is the leading open-source self-hosted option, supporting 25+ social media channels. Latest version: v2.11.3. Can be deployed via Docker or Railway (one-click).

### 5.4 Xiaohongshu-Specific Content Tools

| Tool | Type | Notes | Link |
|------|------|-------|------|
| **xiaohongshu-mcp** | MCP Tool | HTTP API + MCP tool calls for fetching notes; requires login cookies | https://github.com/xpzouying/xiaohongshu-mcp |
| **CodeDuoGun MCP Server** | MCP Server | Automated publishing, browsing, interactions | https://www.pulsemcp.com/servers/codeduogun-xiaohongshu |
| **XHS Robot** | Bot/Script | Automated note publishing via internal APIs | https://www.sddtc.florist/blog/2025-06-24-xhs-robot/ |
| **One-Click XHS Publish** | Web App | JS SDK-based via `xhs.share()` | https://juejin.cn/post/7552489208804491316 |
| **XHS Built-in AI Tool** | Platform Feature | Native AI content creation tool within Xiaohongshu app | Built into XHS app |
| **DeepSeek for XHS** | AI Tool | Used by brands for XHS content ideation and design | https://www.charlesworth-group.com/blog/how-ai-is-revolutionising-xiaohongshu/ |

**Important**: Xiaohongshu has NO official public API for publishing. Tools rely on reverse-engineered internal APIs and browser cookies. Risk of ToS violation and account ban. XHS now labels AI-generated content (2025 policy).

### 5.5 WeChat Official Account Tools

| Tool | Language | Description | Link |
|------|----------|-------------|------|
| **WeRoBot** | Python | WeChat Official Account development framework (MIT license) | https://github.com/offu/WeRoBot |
| **Wechaty** | TypeScript/JS | Conversational RPA SDK; supports WeChat personal accounts | https://github.com/wechaty/wechaty |
| **Python Wechaty** | Python | Python wrapper for Wechaty | https://github.com/wechaty/python-wechaty |
| **wxbot** | - | WeChat robot/personal assistant platform | https://github.com/wux-weapp/wxbot |

**Note**: WeChat Official Account has an official API (微信公众平台 API) for publishing articles, managing materials, etc. WeRoBot wraps this API in Python. WeChat OA API docs: https://mp.weixin.qq.com/ (login required).

### 5.6 Twitter/X Tools

| Tool | Type | Description | Link |
|------|------|-------------|------|
| **TwitterAutoPoster** | Open Source | Auto-posts from spreadsheet on schedule | https://github.com/ReactorcoreGames/TwitterAutoPoster |
| **socialautonomies** | Open Source | AI Agent that posts, schedules, auto-replies | https://github.com/Prem95/socialautonomies |
| **OpenTweet** | SaaS | Twitter scheduler with AI content generation | https://opentweet.io/ |
| **Postpone** | API Service | Schedule tweets via API; supports media, polls, threads | https://developers.postpone.app/ |

**Important**: Official X API for posting costs ~$5,000/month (Pro/Enterprise tier). Most open-source tools use the free read-only tier or browser automation.

---

## 6. Content Operation Systems & Open Source Projects

### 6.1 Workflow Automation Platforms

| Tool | Type | Description | Self-Hosted | Link |
|------|------|-------------|-------------|------|
| **n8n** | Workflow Automation | Most flexible for content pipelines; 538+ pre-built social media templates; strong AI integration | Yes | https://n8n.io / https://github.com/n8n-io/n8n |
| **Activepieces** | Workflow Automation | Open-source alternative to Make/Zapier; built for content creation automation | Yes | https://github.com/activepieces/activepieces |
| **Huginn** | Agent Platform | Self-hosted Zapier alternative; monitors RSS/social media, analyzes, acts | Yes | https://github.com/huginn/huginn |
| **Langflow** | AI Agent Builder | Drag-and-drop visual builder for multi-step content workflows | Yes | https://github.com/langflow-ai/langflow |
| **Flowise** | AI Workflow | No-code AI workflow builder for managing model calls and data processing | Yes | https://github.com/FlowiseAI/Flowise |

### 6.2 n8n Content Pipeline Templates (538+ available)

| Workflow | What it Does | Link |
|----------|-------------|------|
| Multi-Platform AI Content Creation | RSS to AI-generated platform-specific content; 80% manual work reduction | https://n8n.io/workflows/3066-automate-multi-platform-social-media-content-creation-with-ai/ |
| RSS-to-Social with AI Summaries | RSS -> AI summary + image -> Facebook/Instagram | https://n8n.io/workflows/9208-automate-rss-to-social-media-with-ai-summaries-and-image-generation/ |
| RSS News Multi-Platform | RSS -> process -> publish to multiple platforms | https://n8n.io/workflows/8800-automate-rss-news-to-multi-platform-social-media-publishing-via-postpulse/ |
| RSS + OpenAI + Telegram Approval | RSS -> AI post generation -> human approval -> publish | https://n8n.io/workflows/5397-auto-generate-and-approve-social-media-posts-from-rss-feeds-with-openai-and-telegram/ |
| AI Content Factory | RSS -> AI -> blog + Instagram + TikTok with Slack approval | https://n8n.io/workflows/11298-ai-powered-content-factory-rss-to-blog-instagram-and-tiktok-with-slack-approval/ |
| GPT-4 + Buffer from Google Sheets | Google Sheets -> GPT-4 content -> schedule via Buffer | https://n8n.io/workflows/7517-generate-and-schedule-social-media-content-with-gpt-4-and-buffer-from-google-sheets/ |
| Airtable + Postiz (25 channels) | Airtable -> download media -> upload to Postiz -> publish across 25 channels | https://n8n.io/workflows/7814-automate-content-publishing-across-25-social-media-channels-with-airtable-and-postiz/ |
| AI Tech Newsletter | RSS -> collect + summarize -> newsletter via Gmail | https://n8n.io/workflows/3986-personalized-ai-tech-newsletter-using-rss-openai-and-gmail/ |
| Auto-Post Videos | Google Sheets -> schedule and auto-post videos to Instagram, LinkedIn, TikTok | https://n8n.io/workflows/9786-schedule-and-auto-post-videos-to-instagram-linkedin-and-tiktok-with-google-sheets/ |

**Common n8n pattern:**
1. RSS Feed Read node (scheduled polling)
2. HTML/Text extraction from article
3. OpenAI/GPT for summarization and copywriting
4. Image generation (Replicate/DALL-E/Cloudinary)
5. Human approval (optional) via Telegram/Slack
6. Publishing to social platforms

### 6.3 Notable Open Source Content Automation Projects

| Project | Description | Stars | Language | Link |
|---------|-------------|-------|----------|------|
| **Postiz** | All-in-one self-hosted social media scheduler, 25+ platforms | High | TypeScript | https://github.com/gitroomhq/postiz-app |
| **SocialMediaContentCreationAndPostingAutomationPlatform** | Full pipeline: scrape, curate, summarize, generate, publish | - | - | https://github.com/ArmanShirzad/SocialMediaContentCreationAndPostingAutomationPlatform |
| **TikTok-Forge** | Automated video generation with Remotion + OpenAI + n8n | - | TypeScript | https://github.com/ezedinff/TikTok-Forge |
| **YouTube AI Agents** | Fully automated YouTube channel with AI agents (Gemini/OpenAI) | - | Python | https://github.com/topics/social-media-automation |
| **AutoGPT** | Autonomous AI agent framework (178.8k+ stars) | 178K+ | Python | https://github.com/Significant-Gravitas/AutoGPT |
| **MakeMoneyWithAI** | Curated list of open-source AI tools for monetization | - | - | https://github.com/garylab/MakeMoneyWithAI |

### 6.4 Knowledge Base Building Tools (Open Source)

| Tool | Description | Notion Alternative | Link |
|------|-------------|-------------------|------|
| **Docmost** | Open-source collaborative knowledge management | Yes (explicitly) | https://github.com/docmost/docmost |
| **Documize** | Community edition, self-hosted KB | Yes | https://github.com/documize/documize |
| **MediaWiki** | Wikipedia's engine, mature and extensible | No | https://www.mediawiki.org |
| **Outline** | Open-source team wiki | Yes | https://github.com/outline/outline |
| **BookStack** | Document-oriented wiki | Partially | https://github.com/BookStackApp/BookStack |

---

## 7. Monetization on Chinese Social Media Platforms

### 7.1 Xiaohongshu (小红书 / RedNote)

**Platform Stats (2025-2026):**
- Monthly active users: 350 million+
- 2025 full-year revenue: ~42 billion RMB (up 40% YoY)
- Ad revenue: 32 billion RMB (76% of total, up from 65% two years ago)
- Fastest-growing social platform in China (QuestMobile Oct 2025)

**Monetization Methods:**

| Method | Follower Threshold | Description |
|--------|-------------------|-------------|
| **Brand Advertising (品牌商单)** | 1,000+ fans + join Pugongying (蒲公英) platform | Most traditional and stable income source; brands pay for sponsored posts |
| **Content Commerce (内容带货)** | 1,000+ fans + good item collaboration permission | Earn commission by recommending products with purchase links |
| **Personal Shop (个人店铺)** | 0 fans (anyone can open) | Open a shop directly on XHS; sell physical or digital products |
| **Knowledge Payment (知识付费)** | 10,000+ fans | Paid courses, consultations, premium content |
| **Live Streaming Commerce (直播带货)** | Varies | Real-time product sales via livestream |
| **Platform Incentives (平台激励)** | Any | Official creator incentive programs and content challenge rewards |
| **Private Domain Conversion (私域转化)** | Any | Drive traffic to WeChat groups for ongoing monetization |

**Key 2025-2026 Trends:**
- Platform is shifting from pure "seeding" (种草) to closed-loop e-commerce
- Algorithm favors vertical/niche content (more vertical = better recommendation)
- AI-generated content must be labeled (mandatory since 2025)
- Content seeding (种草) remains core value proposition for brands
- Average custom brand deal income for quality creators: 13,000 RMB per deal
- Low barrier entry: possible to earn 2,500+ RMB/month with focused niche content

**Content Formats That Work Best on XHS:**
- Image + text carousels (图文笔记) - highest engagement
- Short video tutorials
- Before/after transformations
- Product comparison reviews
- Listicles and "top 10" formats

### 7.2 WeChat Official Account (微信公众号)

**Monetization Methods:**

| Method | Description | Revenue Model |
|--------|-------------|---------------|
| **Traffic Ads (流量主)** | Display ads in articles; earn per impression/click | ~10-20 RMB per 10K reads; eCPM up 20%+ in 2026 |
| **Paid Articles (付费阅读)** | Charge readers for premium content | Reader pays per article |
| **Comment Section Ads (留言区广告)** | Ads in comment sections | Revenue boost of 60% for creators |
| **Video Account Integration (视频号联动)** | Link to WeChat Channels for live commerce | Live streaming + private domain traffic |
| **Mini Programs (小程序)** | Embed mini-programs in articles for services/products | Direct sales, bookings, services |
| **Private Domain (私域)** | Drive readers to WeChat groups for higher-LTV sales | Ongoing customer relationship |

**Key Trends (2025-2026):**
- Programmatic ad eCPM has risen over 20%
- Comment section ad placement boosts creator revenue by 60%
- Precise/segmented operations (精细化运营) more important than pure follower count
- Video Account (视频号) live streaming integration enables full-funnel: private domain traffic -> live conversion -> repeat purchases
- Multi-dimensional content: text + video + mini-program + live commerce

### 7.3 Douyin (抖音)

**Monetization Methods:**

| Method | Description |
|--------|-------------|
| **Ad Revenue Sharing** | Platform shares ad revenue with creators based on views |
| **Live Commerce (直播带货)** | The dominant monetization method; sell products via livestream |
| **Soft Ad Integration (软广植入)** | Seamlessly integrate brand ads into entertainment content ("剧情搞笑" category earns highest soft-ad revenue) |
| **Creator Incentive Programs** | Platform-funded incentives for quality content (replacing the now-retired "付费合集") |
| **Collection Upgrade Plan (合集升级计划)** | New incentive based on post count, quality, and view performance |
| **Douyin Knowledge Creator Plan (抖音知识创作砥砺计划)** | Dedicated support for educational/knowledge content creators |

**Key Trends (2025-2026):**
- "付费合集" (paid collections) feature was fully retired
- Replaced by "合集升级计划" with quality-based incentives
- Short video + livestream remains the dominant format
- Knowledge/educational content is a growing priority for the platform
- Revenue potential: top creators can earn 300,000+ RMB/month

### 7.4 Bilibili (B站)

**Monetization Methods:**

| Method | Description |
|--------|-------------|
| **Creator Incentive (创作激励)** | Platform pays creators based on view count, engagement, content quality |
| **Charging/Tipping (充电)** | Fans tip creators directly |
| **Brand Collaborations (商单)** | Sponsored content through Bilibili's brand collaboration platform (花火平台) |
| **Live Streaming Tips (直播打赏)** | Revenue from virtual gifts during livestreams |
| **"SUPER UP" Plan** | Dedicated support program for vertical/niche content creators |
| **Paid Courses** | Bilibili's paid course platform for educational content |
| **Membership Content** | Exclusive content for paying members |

**Key Trends (2025-2026):**
- "SUPER UP" plan specifically targets vertical/niche creators
- Bilibili's monetization model is converging with Tencent's approach
- Long-form video content (10-30 min) performs best
- ACG (Anime/Comic/Games), tech, and educational content are strong verticals
- Community engagement (弹幕/danmaku comments) drives algorithmic visibility

### 7.5 Cross-Platform Monetization Strategy

**Platform Selection by Content Type:**

| Content Type | Best Platform(s) | Revenue Model |
|-------------|-----------------|---------------|
| Product reviews / shopping | Xiaohongshu | Affiliate, brand deals, personal shop |
| In-depth articles / analysis | WeChat OA | Ads, paid content, private domain |
| Entertainment / viral short video | Douyin | Live commerce, soft ads |
| Long-form educational / tech | Bilibili | Creator incentive, tips, brand deals |
| Cross-platform distribution | All + Twitter/X | Repurpose content across platforms |

**Growth Strategies (2025-2026):**
1. **Vertical Niche Focus**: More vertical = better algorithmic recommendation. Examples: budget beauty, home organization, student fashion, baby product deals
2. **Plan Monetization from Day One**: Think about revenue from the first follower; don't wait until you have a large audience
3. **Content Repurposing**: Create once, distribute everywhere. Use AI tools to adapt format per platform
4. **Follow Platform Rule Changes**: All platforms underwent major rule changes in 2025-2026; stay current
5. **AI-Enhanced Production**: Use DeepSeek, Claude, GPT-4 for content ideation, writing, and image generation at scale
6. **Quality over Quantity**: The era of pure traffic arbitrage is over; content quality and audience engagement drive revenue

---

## 8. Technical Approaches for Building a Content Pipeline

### 8.1 Recommended Architecture

```
[Knowledge Source (Feishu Wiki)]
    --> [Content Fetcher (Feishu API + feishu-doc-export)]
    --> [Change Detector (hash/diff comparison)]
    --> [Content Analyzer (LLM - classify, summarize, prioritize)]
    --> [Content Generator (LLM - platform-specific content)]
    --> [Review Queue (human approval via Slack/Telegram)]
    --> [Publisher (platform-specific APIs)]
         --> Xiaohongshu (MCP/browser automation)
         --> WeChat OA (WeRoBot / official API)
         --> Twitter/X (API or OpenTweet)
         --> Blog/Newsletter
```

### 8.2 Change Detection in Knowledge Bases

**Approaches:**
1. **Hash-based detection**: Store content hashes (SHA-256) from last fetch. On each run, compare new hashes to detect new/modified/deleted content.
2. **Node-level tracking**: Use Feishu Wiki node timestamps (`edited_at`, `created_at`) from the Get Node Info API to detect changes since last sync.
3. **Snapshot diffing**: Periodically export the full wiki structure and diff against previous snapshot.
4. **Event-driven (webhooks)**: Feishu supports event subscriptions for wiki changes, but requires the app to have webhook receiver capability.

**Recommended approach**: Use the `edited_at` timestamp from Feishu Wiki node metadata. Fetch all nodes, compare timestamps with your last sync time, and only process changed nodes.

**Resources:**
- Reddit discussion on auto-updating RAG KB: https://www.reddit.com/r/LLMDevs/comments/1qwmgfw/how_to_autoupdate_rag_knowledge_base_from_website/
- Google NotebookLM auto-sync approach: https://medium.com/google-cloud/building-an-auto-syncing-knowledge-base-with-google-notebooklm-b4f465e90420
- Thoughtworks on AI-ready KB: https://www.thoughtworks.com/insights/blog/generative-ai/how-to-build-an-AI-ready-knowledge-base

### 8.3 Daily Content Pipeline Design

**Recommended stack for a daily content pipeline:**

| Component | Recommended Tool | Why |
|-----------|-----------------|-----|
| **Orchestration** | n8n (self-hosted) | Visual workflow builder, 400+ integrations, 538+ pre-built content templates |
| **Content Source** | Feishu Wiki API + RSSHub | Feishu for KB content, RSSHub for external news monitoring |
| **Change Detection** | Custom script (Python) | Hash/timestamp comparison of wiki nodes |
| **AI Processing** | Claude API / OpenAI API / DeepSeek | Summarization, classification, content generation; DeepSeek for Chinese content |
| **Human Review** | Slack or Telegram bot | Approval queue before publishing |
| **Publishing - XHS** | xiaohongshu-mcp or browser automation | Only available option; use with caution |
| **Publishing - WeChat** | WeRoBot + Official Account API | Official API exists; WeRoBot wraps it in Python |
| **Publishing - Twitter** | X API (free tier for reads, paid for writes) or OpenTweet | Consider cost vs. browser automation |
| **Publishing - Multi-platform** | Postiz (self-hosted) | 25+ platforms from one dashboard |
| **Scheduling** | n8n cron triggers or system cron | Daily/hourly pipeline runs |
| **Storage/Cache** | SQLite or PostgreSQL | Track processed content, hashes, publication status |

### 8.4 Key Reference Implementations

1. **Melanie Li's AI Content Pipeline**: Auto-monitors AI ecosystem and publishes to LinkedIn - https://www.linkedin.com/posts/peiyaoli_agenticai-aiagents-automation-activity-7435674369735098368-X830
2. **CopilotKit + Next.js Tutorial**: Build AI-powered social media scheduler - https://dev.to/copilotkit/build-an-ai-powered-social-media-post-scheduler-twitter-api-nextjs-copilotkit-1k3m
3. **n8n Content Factory Template**: RSS to multi-platform with Slack approval - https://n8n.io/workflows/11298-ai-powered-content-factory-rss-to-blog-instagram-and-tiktok-with-slack-approval/
4. **n8n + Postiz Integration**: Airtable + Postiz for 25-channel publishing - https://n8n.io/workflows/7814-automate-content-publishing-across-25-social-media-channels-with-airtable-and-postiz/

### 8.5 Practical Implementation Notes

**For WaytoAGI specifically:**
- The knowledge base lives at `https://waytoagi.feishu.cn/wiki`
- You would need a Feishu Custom App with wiki read permissions
- Use `feishu-doc-export` for initial bulk export, then use API for incremental change detection
- The wiki has a hierarchical structure (6 major parts, many sub-categories)
- Content updates frequently (daily AI news on the homepage)

**Risk considerations:**
- Xiaohongshu automation relies on unofficial APIs (risk of account ban)
- Twitter/X posting API is very expensive ($5,000/month for official access)
- WeChat Official Account API is the most "official" and stable of the Chinese platforms
- Always include human review/approval step before automated publishing
- AI-generated content must be labeled on Chinese platforms (2025 regulation)
