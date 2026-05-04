# 五大领域 Skill 集合推荐

> 基于 2025-2026 年 Claude Code / Cursor 技能生态的实际调研，不是泛泛推荐，而是每个领域给出"最佳入门 + 进阶选择 + 索引库"。

---

## 通用索引库（所有领域的基础）

在看具体领域之前，先收藏这几个"索引的索引"：

| 索引库 | Star | 说明 |
|--------|------|------|
| [travisvn/awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills) | 22K+ | **最全的 Claude Skills 索引**，社区公认的第一站 |
| [subinium/awesome-claude-code](https://github.com/subinium/awesome-claude-code) | — | 覆盖 Claude Code + Codex + Gemini CLI + Cursor |
| [VoltAgent/awesome-openclaw-skills](https://github.com/VoltAgent/awesome-openclaw-skills) | — | OpenClaw 生态的技能索引，跨平台通用 |
| [claudeskills.info](https://claudeskills.info/skills/) | — | 网页版市场，140+ 免费技能可浏览 |
| [claudemarketplaces.com](https://claudemarketplaces.com/) | — | 社区投票的质量过滤市场 |

---

## 一、Coding（编程开发）

### 已有的：Superpowers

你已经有 [obra/superpowers](https://github.com/obra/superpowers)（v5.0.6, 45K+ Star），这是 coding 领域最成熟的技能集。上一份报告已做过详细分析。

### 补充推荐

| 技能/项目 | Star | 用途 | 推荐度 |
|-----------|------|------|--------|
| [daymade/claude-code-skills](https://github.com/daymade/claude-code-skills) | — | 48 个生产就绪的开发技能，覆盖面广 | ★★★★ |
| [alirezarezvani/claude-skills](https://github.com/alirezarezvani/claude-skills) | — | 232+ 技能合集，按领域分类（含 coding/finance/marketing） | ★★★★ |
| [VoltAgent/awesome-claude-code-subagents](https://github.com/VoltAgent/awesome-claude-code-subagents) | — | 专业 subagent 集合，覆盖 quant/法务/内容等 | ★★★★ |

### 建议

**Superpowers 已经是 coding 领域的最佳选择。** 补充 daymade/claude-code-skills 作为"扩展插件库"即可，不需要再装其他 coding 技能集。

---

## 二、Finance（金融/量化）

### 最佳入门

| 技能/项目 | 说明 | 推荐度 |
|-----------|------|--------|
| [alirezarezvani/claude-skills: financial-analyst](https://github.com/alirezarezvani/claude-skills/blob/main/finance/financial-analyst/SKILL.md) | 财务分析工具包：比率分析、DCF 估值、预算差异分析、滚动预测 | ★★★★ |
| [tradermonty/claude-trading-skills](https://github.com/tradermonty/claude-trading-skills) | 分析财务指标、估值比率、增长轨迹，生成牛/熊情景投资备忘录 | ★★★★ |

### 进阶

| 技能/项目 | 说明 | 推荐度 |
|-----------|------|--------|
| [Trade-With-Claude/cbt-framework](https://github.com/Trade-With-Claude/cbt-framework) | AI 回测框架：从想法到实盘一条龙，21 个命令、4 个交易所集成、宏观数据 MCP | ★★★★★ |
| [quant-sentiment-ai/claude-equity-research](https://github.com/quant-sentiment-ai/claude-equity-research) | 机构级股票研究，高盛风格格式输出 | ★★★★ |
| [VoltAgent/quant-analyst subagent](https://github.com/VoltAgent/awesome-claude-code-subagents/blob/main/categories/07-specialized-domains/quant-analyst.md) | 量化交易策略开发、金融模型构建、风险分析 | ★★★★ |

### 参考文章

- [Snyk: Top 8 Claude Skills for Finance and Quantitative Developers](https://snyk.io/articles/top-claude-skills-finance-quantitative-developers/)

### 建议

**如果你做投资分析**：`financial-analyst` + `claude-trading-skills` 就够了。
**如果你做量化交易**：`cbt-framework` 是最完整的端到端方案。
**如果你做股票研究**：`claude-equity-research` 的格式最专业。

---

## 三、Marketing（营销/SEO/内容）

### 最佳入门

| 技能/项目 | 说明 | 推荐度 |
|-----------|------|--------|
| [OpenClaudia/openclaudia-skills](https://github.com/OpenClaudia/openclaudia-skills) | **34 个营销技能**，按类别组织：SEO、内容写作、邮件营销、社媒、广告、分析、策略 | ★★★★★ |
| [alirezarezvani/claude-skills: content-creator](https://github.com/alirezarezvani/claude-skills/blob/main/marketing-skill/content-creator/SKILL.md) | 内容创作技能（已拆分为专家子技能：SEO、社媒、品牌调性等） | ★★★★ |

### 进阶

| 技能/项目 | 说明 | 推荐度 |
|-----------|------|--------|
| [AgriciDaniel/claude-seo](https://github.com/AgriciDaniel/claude-seo) | SEO 全方位分析：技术 SEO + 页面分析 + 内容质量(E-E-A-T) + Schema，19+ 检查项 | ★★★★★ |
| [ayrshare/marketingskills](https://github.com/ayrshare/marketingskills) | 面向技术营销人和创始人：转化优化、文案、SEO | ★★★★ |
| [13 个社媒技能（Reddit 分享）](https://www.reddit.com/r/ClaudeAI/comments/1s2ds95/i_open_sourced_13_claude_code_skills_that_help/) | 教 Claude 学习你的声音、受众、语境后再生成内容 | ★★★★ |

### 建议

**OpenClaudia 是营销领域的"一站式商店"。** 34 个技能覆盖了从 SEO 到广告到分析的完整链路。如果你只选一个营销技能集，选它。

`claude-seo` 是 SEO 分析的专业工具，适合有网站需要优化的场景。

---

## 四、Music（音乐创作）

### 现状

音乐领域的 AI 技能生态还在**早期阶段**——不像 coding/finance 有成熟的技能集合，更多是**单个工具 + 生成模型**的组合。

### 推荐

| 工具/技能 | 类型 | 说明 | 推荐度 |
|-----------|------|------|--------|
| [ACE-Step 1.5](https://github.com/ace-step/ACE-Step-1.5) | 本地模型 | **最强开源音乐生成模型**，消费级 GPU（<4GB VRAM）可跑，亚秒级生成 | ★★★★★ |
| [MCP Market: Music Generation Skill](https://mcpmarket.com/tools/skills/music-generation) | Claude Code Skill | 集成 Google Lyria + Suno + Udio，从 Claude Code 直接生成音乐 | ★★★★ |
| [Shyft: Suno MusicGen Skill](https://shyft.ai/skills/claude-code-suno-musicgen-skill) | Claude Code Skill | 专为 Suno 设计，解决 Suno 脚本限制 | ★★★★ |
| [Suno](https://suno.com) | 在线服务 | 最成熟的商业 AI 音乐生成，直觉式提示词 | ★★★★ |
| [Udio](https://udio.com) | 在线服务 | Suno 的主要竞争对手，音质好 | ★★★★ |

### 工作流建议

```
音乐创作的 AI 工作流（当前可行）：

1. 用 Claude/ChatGPT 写歌词和音乐风格描述
2. 用 ACE-Step 1.5（本地）或 Suno（在线）生成音乐
3. 用 AI 修音/混音工具后处理
4. 迭代：调整提示词 → 重新生成 → 对比选择

未来（技能成熟后）：
1. 在 Claude Code 中说"帮我写一首关于XX的民谣"
2. Skill 自动：写词 → 生成旋律 → 编曲 → 混音 → 输出文件
```

### 建议

**音乐领域目前没有像 Superpowers 那样的完整技能集。** 最实际的路径是 ACE-Step 1.5（本地生成）+ Claude（歌词/创意）+ 手动工作流串联。如果你想要 Claude Code 集成，MCP Market 的 Music Generation Skill 是起点。

---

## 五、Photography（摄影/图像）

### 现状

和音乐类似，摄影领域的 AI 技能集中在**图像生成和编辑**而非完整的摄影工作流。

### 推荐

| 工具/技能 | 类型 | 说明 | 推荐度 |
|-----------|------|------|--------|
| [danielrosehill/image-editing-plugin](https://github.com/danielrosehill/image-editing-plugin) | Claude Code Plugin | 图像处理、照片编辑、批量图像操作 | ★★★★ |
| [fal-ai-community/skills: fal-image-edit](https://github.com/fal-ai-community/skills/blob/main/skills/claude.ai/fal-image-edit/SKILL.md) | Claude Code Skill | fal.ai 驱动的图像编辑：风格迁移、物体移除、背景替换 | ★★★★★ |
| [jshchnz/claude-code-image](https://github.com/jshchnz/claude-code-image) | Claude Code Plugin | 图像生成（选择合适的服务、生成、保存） | ★★★★ |
| [ypfaff/google-image-gen-plugin](https://github.com/ypfaff/google-image-gen-plugin) | Claude Code Plugin | 用 Google Gemini API 生成图像 | ★★★★ |
| [K-Dense-AI/claude-scientific-writer: generate-image](https://github.com/K-Dense-AI/claude-scientific-writer/blob/main/skills/generate-image/SKILL.md) | Claude Code Skill | FLUX/Gemini 驱动的通用图像生成 | ★★★ |

### 摄影工作流的 AI 应用场景

```
不是替代摄影师，而是增强工作流：

拍摄前：
  → AI 辅助场景规划、光线模拟、构图建议
  → 当前工具：ChatGPT/Claude 视觉分析

拍摄后（后期处理）：
  → AI 批量调色、降噪、风格迁移
  → 当前工具：Lightroom AI + fal-image-edit skill

内容创作：
  → AI 生成社交媒体配图、产品图
  → 当前工具：claude-code-image + FLUX/Stable Diffusion

管理：
  → AI 自动标签、分类、选片
  → 当前工具：自定义 skill（需要开发）
```

### 建议

**fal-image-edit 是当前最实用的摄影/图像编辑技能。** 它支持真实编辑操作（风格迁移、去物、换背景），不是单纯的"生成图片"。

如果你做的是"AI 图像生成"而非"真实摄影后期"，jshchnz/claude-code-image 更适合。

---

## 六、总结对比

| 领域 | 生态成熟度 | 最佳入门 | 最佳进阶 | 缺什么 |
|------|-----------|---------|---------|--------|
| **Coding** | ★★★★★ | Superpowers | daymade/claude-code-skills | 已足够 |
| **Finance** | ★★★★ | financial-analyst | cbt-framework | 中文 A 股适配的技能 |
| **Marketing** | ★★★★★ | OpenClaudia (34 skills) | claude-seo (SEO 深度) | 小红书/微信等中国平台适配 |
| **Music** | ★★☆ | ACE-Step 1.5 + MCP Music Skill | — | 完整的 DAW 集成工作流 |
| **Photography** | ★★★ | fal-image-edit | image-editing-plugin | 完整的摄影工作流（拍摄→选片→后期→发布） |

### 关键发现

1. **Coding 和 Marketing 生态最成熟** — 有完整的技能集可以直接使用
2. **Finance 有专业化工具** — 但偏美股/加密，A 股适配需要自己开发
3. **Music 和 Photography 还在早期** — 更多是单个工具，缺少完整工作流
4. **最大的缺口：中国本土化** — 几乎所有技能都是英文生态，小红书、微信、A 股等场景需要自己造轮子

### 下一步建议

1. **先装已验证的**：Superpowers（已有）+ OpenClaudia（营销）+ financial-analyst（金融）
2. **再按需装工具**：ACE-Step 1.5（音乐）+ fal-image-edit（图像）
3. **长期：自己写技能** — 用 Superpowers 的 `writing-skills` 方法论，为中国本土场景创建技能

---

## 参考来源

### 索引库
- [travisvn/awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills) (22K+ Star)
- [subinium/awesome-claude-code](https://github.com/subinium/awesome-claude-code)
- [claudeskills.info](https://claudeskills.info/skills/)
- [claudemarketplaces.com](https://claudemarketplaces.com/)

### Coding
- [obra/superpowers](https://github.com/obra/superpowers)
- [daymade/claude-code-skills](https://github.com/daymade/claude-code-skills)

### Finance
- [Snyk: Top 8 Claude Skills for Finance](https://snyk.io/articles/top-claude-skills-finance-quantitative-developers/)
- [Trade-With-Claude/cbt-framework](https://github.com/Trade-With-Claude/cbt-framework)
- [quant-sentiment-ai/claude-equity-research](https://github.com/quant-sentiment-ai/claude-equity-research)
- [tradermonty/claude-trading-skills](https://github.com/tradermonty/claude-trading-skills)

### Marketing
- [OpenClaudia/openclaudia-skills](https://github.com/OpenClaudia/openclaudia-skills)
- [AgriciDaniel/claude-seo](https://github.com/AgriciDaniel/claude-seo)
- [ayrshare/marketingskills](https://github.com/ayrshare/marketingskills)
- [Reddit: 13 Social Media Skills](https://www.reddit.com/r/ClaudeAI/comments/1s2ds95/i_open_sourced_13_claude_code_skills_that_help/)

### Music
- [ACE-Step 1.5](https://github.com/ace-step/ACE-Step-1.5)
- [MCP Market: Music Generation](https://mcpmarket.com/tools/skills/music-generation)
- [Shyft: Suno MusicGen](https://shyft.ai/skills/claude-code-suno-musicgen-skill)

### Photography
- [danielrosehill/image-editing-plugin](https://github.com/danielrosehill/image-editing-plugin)
- [fal-ai-community/skills](https://github.com/fal-ai-community/skills)
- [jshchnz/claude-code-image](https://github.com/jshchnz/claude-code-image)
