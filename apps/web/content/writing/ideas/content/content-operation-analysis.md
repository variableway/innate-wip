# 内容创建系统调研分析

> 分析日期: 2026-04-16
> 目标: 构建可持续的内容输入→分析→生成→输出系统

---

## 一、可行性分析

### 结论: 可行，且已有成熟的工具链支撑

核心判断依据:
- **输入层**: 飞书Wiki提供完整Open API，支持程序化获取全部内容；RSSHub可覆盖300+信息源
- **分析层**: LLM API（DeepSeek/Claude/GPT）可完成分类、摘要、趋势判断、新旧识别
- **生成层**: LLM可直接生成各平台适配内容（小红书图文、微信公众号长文、Twitter短文）
- **输出层**: 微信公众号有官方API；Postiz开源工具支持25+平台；小红书需谨慎使用非官方方案

**关键风险**:
- 小红书无官方发布API，自动化有封号风险
- Twitter/X官方发布API约$5,000/月，成本高
- AI生成内容在中国平台需标注（2025年新规）

---

## 二、系统架构

```
┌─────────────────────────────────────────────────────────────────┐
│                     内容运营系统架构                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐  │
│  │  输入层   │ →  │  分析层   │ →  │  生成层   │ →  │  输出层   │  │
│  │ Input    │    │ Analyze  │    │ Generate │    │ Publish  │  │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘  │
│       │               │               │               │         │
│  - 飞书Wiki       - 新旧判断      - 平台适配      - 微信公众号   │
│  - RSS订阅        - 分类打标      - 小红书图文     - 小红书       │
│  - 社交媒体       - 摘要总结      - 公众号长文     - Twitter/X   │
│  - Newsletter     - 趋势检测      - Twitter短文   - 博客/Newsletter│
│  - 搜索热点       - 优先级排序    - 知识卡片       - 视频号       │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  基础设施: n8n(编排) | SQLite/PG(存储) | LLM API(AI引擎)        │
│  人工审核: Slack/Telegram 审批队列                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 三、各节点工具分析

### 节点1: 输入层（信息获取）

| 来源 | 推荐工具 | 方式 | 特点 |
|------|---------|------|------|
| **飞书Wiki** | feishu-doc-export / 飞书Open API | API批量获取 | 支持6大板块全部内容，增量更新 |
| **AI新闻/博客** | RSSHub + FreshRSS | RSS聚合 | 覆盖300+源，自托管 |
| **社交媒体** | RSSHub (Twitter/微博/B站) | RSS转换 | 非官方API，需注意限制 |
| **Newsletter** | Readwise Reader / Meco | 邮件聚合 | 统一阅读入口 |
| **热点趋势** | Google Trends / 百度指数 | 定时抓取 | 发现突发热点 |
| **竞品监控** | Huginn (自托管) | 定时爬取 | 可定制监控规则 |

**推荐组合**: **飞书API + RSSHub + FreshRSS**（覆盖知识库+外部信息源）

### 节点2: 分析层（内容处理）

| 功能 | 实现方式 | 工具/技术 |
|------|---------|----------|
| **新旧判断** | 对比Wiki节点`edited_at`时间戳 + 内容SHA-256哈希 | Python脚本 |
| **内容分类** | LLM分类Prompt（预定义分类标签） | DeepSeek/Claude API |
| **摘要生成** | LLM摘要Prompt | DeepSeek/Claude API |
| **趋势检测** | 按分类统计内容频率，检测突增 | 自建统计模块 |
| **源头人追踪** | 从Wiki编辑记录/引用中提取贡献者 | 飞书Wiki API |
| **优先级排序** | 多维度评分（新颖性+热度+相关性） | 自建评分模型 |

**核心逻辑 - 新旧判断**:
```python
# 伪代码
last_sync_time = load_last_sync()  # 上次同步时间
nodes = feishu_api.list_wiki_nodes(space_id)

for node in nodes:
    if node.edited_at > last_sync_time:
        content = feishu_api.get_document(node.obj_token)
        content_hash = sha256(content)
        if content_hash != stored_hash[node.id]:
            # 这是新的或修改过的内容
            analyze_and_queue(content, node)
```

### 节点3: 生成层（内容创作）

| 目标平台 | 内容格式 | 生成策略 | AI工具 |
|---------|---------|---------|--------|
| **小红书** | 图文笔记（标题+正文+标签） | 精简、口语化、加emoji、加话题标签 | DeepSeek（中文最强性价比） |
| **微信公众号** | 长文（标题+摘要+正文+配图） | 正式、结构化、有深度 | Claude（长文逻辑性强） |
| **Twitter/X** | 短推文（280字符/条） | 简洁、有观点、适合英文 | GPT-4o |
| **知识卡片** | 图片+文字 | 一图一知识点，适合分享 | DALL-E/Midjourney + GPT |
| **Newsletter** | 邮件（周报/日报） | 精选+摘要+评论 | Claude |

**生成Prompt示例（小红书）**:
```
你是一位AI领域的小红书博主。请根据以下知识点，生成一篇小红书笔记：

要求：
- 标题：15字以内，吸引眼球，可用emoji
- 正文：300-500字，口语化，分点说明
- 标签：5-8个话题标签（#AI #xxx）
- 语气：亲切专业，像朋友分享
- 必须标注：[AI辅助生成]

知识点：{content}
```

### 节点4: 输出层（发布）

| 平台 | 发布方式 | 稳定性 | 成本 |
|------|---------|--------|------|
| **微信公众号** | 官方API + WeRoBot (Python) | 高（官方API） | 免费 |
| **小红书** | xiaohongshu-mcp / 浏览器自动化 | 低（非官方） | 免费（有封号风险） |
| **Twitter/X** | X API ($5,000/月) 或 Postiz | 中 | 高（官方）/免费（非官方） |
| **多平台** | Postiz (开源，25+平台) | 中 | 自托管免费 |
| **博客** | Hugo/Hexo + GitHub Pages | 高 | 免费 |

**推荐发布策略**: 优先微信公众号（官方API稳定）→ 小红书（手动+半自动）→ 多平台用Postiz

---

## 四、实际例子: WaytoAGI 知识库内容系统

### 4.1 WaytoAGI 简介

- 中国最大的AI开源知识库社区，700万+用户
- 托管在飞书Wiki: `https://waytoagi.feishu.cn/wiki`
- 6大板块: AI认知、AI短片、AI音乐、AI辅助、AI商业变现、AI Agent
- 每日更新AI新闻和工具

### 4.2 实现架构

```
[WaytoAGI飞书Wiki]
       │
       ▼
[飞书Open API] ←── Step 1: 获取全部内容
       │
       ▼
[Markdown文件存储] ←── Step 2: 保存为本地知识库
       │
       ▼
[增量检测引擎] ←── Step 3: 每日检测新增/修改内容
       │
       ▼
[LLM分析引擎] ←── Step 4: 分类、摘要、判断内容价值
       │
       ▼
[内容生成引擎] ←── Step 5: 生成各平台内容
       │
       ▼
[审核队列(Slack)] ←── Step 6: 人工审核
       │
       ▼
[自动发布] ←── Step 7: 发布到社交媒体
```

### 4.3 详细步骤

#### Step 1: 获取飞书Wiki全部内容

**前置准备**:
1. 在 [open.feishu.cn](https://open.feishu.cn/) 创建企业自建应用
2. 获取 App ID 和 App Secret
3. 添加权限: `wiki:wiki:readonly`, `docx:document:readonly`
4. 将应用添加为目标Wiki空间的协作者（需管理员操作）

**方式A: 使用 feishu-doc-export（推荐，一键导出）**

```bash
# 安装
pip install feishu-doc-export

# 配置
export FEISHU_APP_ID="your_app_id"
export FEISHU_APP_SECRET="your_app_secret"

# 导出全部Wiki为Markdown
feishu-doc-export --wiki --space-id "RpWvw3R8BiVVD6kfcSwcQcGznSb" --format markdown --output ./waytoagi-wiki/
```

feishu-doc-export 特点:
- 保留飞书Wiki目录结构
- 支持Markdown/DOCX/PDF输出
- 自动下载文档中的图片
- GitHub: https://github.com/eternalfree/feishu-doc-export

**方式B: 使用飞书Open API自行编写（更灵活）**

```python
"""
飞书Wiki内容获取脚本
依赖: pip install lark-oapi
"""
import lark_oapi as lark
from lark_oapi.api.wiki.v2 import *
from lark_oapi.api.docx.v1 import *
import os, json, hashlib

class FeishuWikiFetcher:
    def __init__(self, app_id, app_secret):
        self.client = lark.Client.builder() \
            .app_id(app_id) \
            .app_secret(app_secret) \
            .build()
        self.base_url = "https://open.feishu.cn"

    def get_spaces(self):
        """列出所有Wiki空间"""
        request = ListSpaceRequest.builder() \
            .page_size(50) \
            .build()
        response = self.client.wiki.v2.space.list(request)
        if response.success():
            return response.data.items
        return []

    def get_space_nodes(self, space_id):
        """递归获取空间下所有节点"""
        nodes = []
        page_token = None
        while True:
            builder = ListNodeRequest.builder() \
                .space_id(space_id) \
                .page_size(50)
            if page_token:
                builder.page_token(page_token)
            response = self.client.wiki.v2.space_node.list(builder.build())
            if response.success():
                nodes.extend(response.data.items)
                if response.data.has_more:
                    page_token = response.data.page_token
                else:
                    break
            else:
                break
        return nodes

    def get_node_info(self, token):
        """获取节点详情（含obj_token用于获取文档内容）"""
        request = GetNodeRequest.builder() \
            .token(token) \
            .build()
        response = self.client.wiki.v2.space_node.get(request)
        if response.success():
            return response.data.node
        return None

    def get_document_content(self, document_id):
        """获取文档Markdown内容"""
        # 方式1: 获取raw text
        request = ListDocumentBlockRequest.builder() \
            .document_id(document_id) \
            .page_size(500) \
            .build()
        response = self.client.docx.v1.document_block.list(request)
        if response.success():
            return self._blocks_to_markdown(response.data.items)
        return ""

    def _blocks_to_markdown(self, blocks):
        """将文档Block转换为Markdown"""
        md_lines = []
        for block in blocks:
            block_type = block.block_type
            if block_type == 1:  # Page
                continue
            elif block_type == 2:  # Text
                md_lines.append(self._extract_text(block.text))
            elif block_type == 3:  # Heading1
                md_lines.append(f"# {self._extract_text(block.heading1)}")
            elif block_type == 4:  # Heading2
                md_lines.append(f"## {self._extract_text(block.heading2)}")
            elif block_type == 5:  # Heading3
                md_lines.append(f"### {self._extract_text(block.heading3)}")
            elif block_type == 10:  # UnorderedList
                md_lines.append(f"- {self._extract_text(block.unordered_list)}")
            elif block_type == 11:  # OrderedList
                md_lines.append(f"1. {self._extract_text(block.ordered_list)}")
            elif block_type == 13:  # Code
                md_lines.append(f"```\n{self._extract_text(block.code)}\n```")
            elif block_type == 22:  # Table
                md_lines.append(self._table_to_markdown(block.table))
            md_lines.append("")
        return "\n".join(md_lines)

    def _extract_text(self, text_element):
        """从TextBlock中提取纯文本"""
        if not text_element or not text_element.elements:
            return ""
        return "".join([el.text_run.content for el in text_element.elements if el.text_run])

    def export_all_to_markdown(self, space_id, output_dir):
        """导出整个Wiki空间为Markdown文件"""
        os.makedirs(output_dir, exist_ok=True)
        manifest = []

        nodes = self.get_space_nodes(space_id)
        for node in nodes:
            node_info = self.get_node_info(node.node_token)
            if not node_info:
                continue

            content = self.get_document_content(node_info.obj_token)
            title = node_info.title or node_info.node_token

            # 保存为Markdown文件
            safe_title = "".join(c for c in title if c.isalnum() or c in " _-")[:50]
            filepath = os.path.join(output_dir, f"{safe_title}.md")
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(f"# {title}\n\n")
                f.write(f"> 来源: WaytoAGI Wiki\n")
                f.write(f"> 节点: {node_info.node_token}\n")
                f.write(f"> 更新: {node_info.patched_at}\n\n")
                f.write(content)

            manifest.append({
                "title": title,
                "node_token": node_info.node_token,
                "obj_token": node_info.obj_token,
                "filepath": filepath,
                "hash": hashlib.sha256(content.encode()).hexdigest(),
                "updated_at": node_info.patched_at
            })

        # 保存清单
        with open(os.path.join(output_dir, "_manifest.json"), "w") as f:
            json.dump(manifest, f, ensure_ascii=False, indent=2)

        return manifest

# 使用示例
if __name__ == "__main__":
    fetcher = FeishuWikiFetcher(
        app_id=os.environ["FEISHU_APP_ID"],
        app_secret=os.environ["FEISHU_APP_SECRET"]
    )
    manifest = fetcher.export_all_to_markdown(
        space_id="RpWvw3R8BiVVD6kfcSwcQcGznSb",
        output_dir="./waytoagi-knowledge-base"
    )
    print(f"导出完成: {len(manifest)} 篇文档")
```

#### Step 2: 构建知识库 & 新旧判断

```python
"""
增量检测 & 内容分析引擎
"""
import json, hashlib
from datetime import datetime

class KnowledgeBase:
    def __init__(self, db_path="./kb-state.json"):
        self.db_path = db_path
        self.state = self._load_state()

    def _load_state(self):
        try:
            with open(self.db_path) as f:
                return json.load(f)
        except FileNotFoundError:
            return {"last_sync": None, "nodes": {}}

    def detect_changes(self, current_manifest):
        """检测新增、修改、未变化的内容"""
        new_items = []
        modified_items = []
        unchanged_items = []

        for item in current_manifest:
            token = item["node_token"]
            prev = self.state["nodes"].get(token)

            if not prev:
                new_items.append(item)  # 全新内容
            elif prev["hash"] != item["hash"]:
                modified_items.append(item)  # 内容有变化
            else:
                unchanged_items.append(item)  # 无变化

        return {
            "new": new_items,
            "modified": modified_items,
            "unchanged": unchanged_items
        }

    def save_state(self, manifest):
        """保存当前状态"""
        self.state["last_sync"] = datetime.now().isoformat()
        for item in manifest:
            self.state["nodes"][item["node_token"]] = {
                "hash": item["hash"],
                "updated_at": item["updated_at"],
                "title": item["title"]
            }
        with open(self.db_path, "w") as f:
            json.dump(self.state, f, ensure_ascii=False, indent=2)
```

#### Step 3: 分类与内容生成

```python
"""
LLM驱动的内容分析与生成
依赖: pip install openai  (兼容DeepSeek API)
"""
from openai import OpenAI

class ContentEngine:
    def __init__(self, api_key, base_url="https://api.deepseek.com"):
        self.client = OpenAI(api_key=api_key, base_url=base_url)

    def classify(self, title, content):
        """分类内容"""
        resp = self.client.chat.completions.create(
            model="deepseek-chat",
            messages=[{
                "role": "user",
                "text": f"""请将以下AI相关内容分类到最匹配的类别：
类别: AI认知, AI工具, AI商业变现, AI Agent, AI教程, AI新闻, AI音乐, 其他

标题: {title}
内容摘要: {content[:500]}

只输出类别名称。"""
            }]
        )
        return resp.choices[0].message.content.strip()

    def generate_xiaohongshu(self, title, content):
        """生成小红书笔记"""
        resp = self.client.chat.completions.create(
            model="deepseek-chat",
            messages=[{
                "role": "user",
                "text": f"""你是一位AI领域的小红书博主，粉丝5万+。

请根据以下知识点生成一篇小红书笔记：

要求：
- 标题: 15字以内，吸引眼球
- 正文: 300-500字，口语化，用emoji，分点说明
- 标签: 5-8个#话题标签
- 必须在文末标注: [AI辅助生成]

知识点标题: {title}
知识点内容: {content[:2000]}

输出格式:
## 标题
正文内容...
#标签1 #标签2 ..."""
            }]
        )
        return resp.choices[0].message.content

    def generate_wechat(self, title, content):
        """生成微信公众号长文"""
        resp = self.client.chat.completions.create(
            model="deepseek-chat",
            messages=[{
                "role": "user",
                "text": f"""你是一位AI领域的微信公众号作者。

请根据以下知识点撰写一篇公众号文章：

要求：
- 标题: 严肃但不枯燥，20字以内
- 摘要: 50字以内概述
- 正文: 1500-3000字，结构化（有小标题），专业但易懂
- 结尾: 引导关注和讨论

知识点标题: {title}
知识点内容: {content[:3000]}"""
            }]
        )
        return resp.choices[0].message.content

    def generate_twitter(self, title, content):
        """生成Twitter推文"""
        resp = self.client.chat.completions.create(
            model="deepseek-chat",
            messages=[{
                "role": "user",
                "text": f"""Generate an engaging tweet about this AI topic.
Max 280 characters. Include relevant hashtags.

Topic: {title}
Content: {content[:500]}"""
            }]
        )
        return resp.choices[0].message.content
```

#### Step 4: 每日调度（n8n工作流 或 定时脚本）

```python
"""
每日内容调度器
"""
import schedule, time

def daily_pipeline():
    # 1. 获取最新Wiki内容
    fetcher = FeishuWikiFetcher(APP_ID, APP_SECRET)
    manifest = fetcher.export_all_to_markdown(SPACE_ID, OUTPUT_DIR)

    # 2. 检测变化
    kb = KnowledgeBase()
    changes = kb.detect_changes(manifest)

    # 3. 分析和生成
    engine = ContentEngine(API_KEY)
    for item in changes["new"] + changes["modified"]:
        content = open(item["filepath"]).read()
        category = engine.classify(item["title"], content)

        # 4. 生成多平台内容
        xhs_post = engine.generate_xiaohongshu(item["title"], content)
        wechat_post = engine.generate_wechat(item["title"], content)
        twitter_post = engine.generate_twitter(item["title"], content)

        # 5. 推入审核队列
        push_to_review_queue({
            "source": item["title"],
            "category": category,
            "xiaohongshu": xhs_post,
            "wechat": wechat_post,
            "twitter": twitter_post
        })

    kb.save_state(manifest)

# 每天早上8点执行
schedule.every().day.at("08:00").do(daily_pipeline)
```

---

## 五、变现路径分析

### 推荐平台组合（按优先级）

| 优先级 | 平台 | 粉丝门槛 | 变现方式 | 预期收入 |
|-------|------|---------|---------|---------|
| 1 | **小红书** | 1千粉即可接单 | 品牌商单、带货、个人店铺 | 2,500-13,000元/月 |
| 2 | **微信公众号** | 5千阅读即可 | 流量主广告（10-20元/万阅读） | 稳定增长 |
| 3 | **B站** | 需积累 | 创作激励、充电、商单 | 视频制作成本高 |
| 4 | **Twitter/X** | 英文受众 | 品牌合作、引流 | 辅助渠道 |

### AI内容赛道变现策略

1. **垂直定位**: 聚焦"AI工具评测"或"AI效率提升"细分领域
2. **内容矩阵**: 同一知识点 → 小红书图文 + 公众号长文 + Twitter短文
3. **引流转化**: 公域内容引流 → 私域（微信群）→ 知识付费/咨询
4. **批量生产**: 日产3-5条内容，覆盖不同平台

---

## 六、实现计划

### Phase 1: 基础搭建（1-2周）

| 任务 | 描述 | 工具 |
|------|------|------|
| T1.1 | 创建飞书自建应用，配置权限 | 飞书开放平台 |
| T1.2 | 编写Wiki内容获取脚本 | Python + lark-oapi |
| T1.3 | 首次导出WaytoAGI知识库为Markdown | feishu-doc-export |
| T1.4 | 搭建本地知识库目录结构 | 文件系统 |

### Phase 2: 分析引擎（1-2周）

| 任务 | 描述 | 工具 |
|------|------|------|
| T2.1 | 实现增量检测逻辑 | Python |
| T2.2 | 实现LLM分类和摘要 | DeepSeek API |
| T2.3 | 实现内容分类体系 | 自定义分类标签 |
| T2.4 | 构建源头人追踪功能 | 飞书Wiki元数据 |

### Phase 3: 内容生成（1周）

| 任务 | 描述 | 工具 |
|------|------|------|
| T3.1 | 编写各平台Prompt模板 | - |
| T3.2 | 实现小红书内容生成 | DeepSeek API |
| T3.3 | 实现公众号内容生成 | DeepSeek API |
| T3.4 | 实现Twitter内容生成 | DeepSeek API |

### Phase 4: 发布系统（1-2周）

| 任务 | 描述 | 工具 |
|------|------|------|
| T4.1 | 搭建n8n工作流引擎 | n8n (Docker) |
| T4.2 | 对接微信公众号API | WeRoBot |
| T4.3 | 对接审核队列 | Slack/Telegram Bot |
| T4.4 | 部署Postiz多平台发布 | Postiz (Docker) |

### Phase 5: 优化迭代（持续）

| 任务 | 描述 |
|------|------|
| T5.1 | 根据数据反馈优化Prompt |
| T5.2 | 增加RSS外部信息源 |
| T5.3 | 添加热点检测功能 |
| T5.4 | 构建数据分析看板 |

---

## 七、工具清单汇总

### 必需工具

| 工具 | 用途 | 费用 |
|------|------|------|
| Python 3.10+ | 开发语言 | 免费 |
| lark-oapi | 飞书API SDK | 免费 |
| feishu-doc-export | 飞书Wiki批量导出 | 免费 |
| DeepSeek API | 中文内容生成（性价比最高） | ~¥1/百万token |
| n8n | 工作流编排 | 免费（自托管） |

### 可选工具

| 工具 | 用途 | 费用 |
|------|------|------|
| Postiz | 多平台发布 | 免费（自托管） |
| WeRoBot | 微信公众号API | 免费 |
| RSSHub | RSS源聚合 | 免费（自托管） |
| FreshRSS | RSS阅读器 | 免费（自托管） |
| SQLite | 本地数据存储 | 免费 |

### 关键参考

| 资源 | URL |
|------|-----|
| 飞书Wiki API | https://open.feishu.cn/document/ukTMukTMukTM/uUDN04SN0QjL1QDN/wiki-overview |
| feishu-doc-export | https://github.com/eternalfree/feishu-doc-export |
| n8n内容工厂模板 | https://n8n.io/workflows/11298 |
| DeepSeek API | https://platform.deepseek.com/ |
| Postiz | https://github.com/gitroomhq/postiz-app |
| WeRoBot | https://github.com/offu/WeRoBot |
| RSSHub | https://github.com/DIYgod/RSSHub |
| lark-oapi SDK | https://pypi.org/project/lark-oapi/ |

---

*本分析基于2026年4月公开信息。WaytoAGI Wiki内容需获得相应访问权限后方可获取。*
