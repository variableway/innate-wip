# 非正经 Skill 合集：玄学 / 搞笑 / 反讽

> 当所有人都忙着让 AI 写代码的时候，有人让 AI 算命、吐槽和阴阳怪气。
> 这些才是 AI 最真实的使用场景。

---

## 一、玄学 / 算命 / 占卜

### 1.1 精选推荐

#### [太卜 (Taibu)](https://github.com/hhszzzz/taibu) — 最强中文玄学 MCP

| 项 | 说明 |
|----|------|
| 能力 | 八字、紫微斗数、六爻、梅花易数、奇门遁甲、大六壬、塔罗、MBTI、面相手相 |
| 集成 | MCP Server — Claude/Cursor 可以**直接调用占卜功能** |
| 特色 | 15+ MCP 工具，覆盖几乎所有中国传统术数体系 |

```
使用方式：
  Claude Code 中安装 MCP →
  你："帮我算一下今天的运势"
  Claude → 调用太卜 MCP → 返回结构化的占卜结果
```

**这是中文玄学领域最完整的项目，没有之一。**

---

#### [赛博算命加风水](https://github.com/zhaoolee/cyber-fortune-telling) — 最有仪式感

| 项 | 说明 |
|----|------|
| 能力 | 输入八字 → 自动调用 DeepSeek 计算每日风水布局、幸运数字/颜色/今天中午吃什么 |
| 特色 | 桌面"电子风水摆件" + 番茄钟模式 |
| 出圈 | 被阮一峰周刊推荐 |

**赛博朋克和封建迷信的完美结合。**

---

#### [BaZi Skill (八字)](https://lobehub.com/skills/aradotso-trending-skills-bazi-skill-chinese-astrology) — Claude Code 专用

| 项 | 说明 |
|----|------|
| 能力 | 四柱八字命理分析，引用**九部经典古籍** |
| 类型 | Claude Code Skill (SKILL.md) |
| 特色 | 学术派八字，不是野路子 |

---

#### [Trail of Bits: Let Fate Decide](https://github.com/trailofbits/skills) — 用加密随机性抽塔罗

| 项 | 说明 |
|----|------|
| 来源 | Trail of Bits（顶级安全公司） |
| 能力 | 用密码学安全的随机数抽塔罗牌，为模糊的决策增加"熵" |
| 特色 | 安全公司做的算命工具——可能是有史以来最安全的塔罗 |

---

#### [Tarot MCP Server](https://github.com/abdul-hamid-achik/tarot-mcp)

| 项 | 说明 |
|----|------|
| 能力 | 塔罗牌占卜 MCP，支持 Claude/Cursor |
| 特色 | 标准 MCP 协议，直接集成 |

---

#### [Bibliomantic MCP (易经+AI)](https://github.com/d4nshields/bibliomantic-mcp-server)

| 项 | 说明 |
|----|------|
| 能力 | 易经占卜 + AI 解读 |
| 灵感 | 菲利普·K·迪克《高堡奇人》中的占卜方法 |
| 特色 | 文艺青年的易经——用科幻小说的方式占卜 |

---

#### [Lục Hào I Ching (六爻易经)](https://mcpmarket.com/tools/skills/l-c-h-o-i-ching-divination-2)

| 项 | 说明 |
|----|------|
| 能力 | 越南传统的六爻占卜法，Claude Code Skill |
| 特色 | 自动化传统占卜流程 |

---

#### [BaZi Master (八字大师)](https://github.com/tytsxai/bazi-master)

| 项 | 说明 |
|----|------|
| 能力 | 全栈应用：八字 + 塔罗 + 易经 + 星座 + 紫微斗数 + AI 解读 |
| 技术栈 | React + Express + Prisma + WebSocket 流式输出 |
| 特色 | 最完整的"玄学全家桶"Web 应用 |

---

#### [算命先生 GPT Prompt](https://github.com/linexjlin/GPTs)

| 项 | 说明 |
|----|------|
| 能力 | ChatGPT 算命先生人设提示词，覆盖八字/风水/紫微/奇门 |
| 特色 | 开箱即用的 prompt 模板 |

---

#### [AstrologerAi](https://github.com/daksh1931/AstrologerAi)

| 项 | 说明 |
|----|------|
| 能力 | 西方占星 + 数字命理学 + 星座兼容性报告 |
| 特色 | 偏西方体系 |

### 1.2 玄学 GitHub Topic 索引

| Topic | 链接 | 项目数 |
|-------|------|--------|
| divination | [github.com/topics/divination](https://github.com/topics/divination) | 100+ |
| bazi | [github.com/topics/bazi](https://github.com/topics/bazi) | 62+ |
| tarot-readings | [github.com/topics/tarot-readings](https://github.com/topics/tarot-readings) | 50+ |
| astrology-ai | [github.com/topics/astrology-ai](https://github.com/topics/astrology-ai) | 30+ |

---

## 二、搞笑 / 吐槽 / Roast

### 2.1 精选推荐

#### [Roast My Code Bot — GitHub Action](https://github.com/marketplace/actions/roast-my-code-bot) — 最实用的搞笑工具

| 项 | 说明 |
|----|------|
| 能力 | AI 对你的代码进行刻薄评论，直接发在 PR 上 |
| 强度 | 三档：讽刺(sarcastic) → 刻薄(mean) → 恶毒(devastating) |
| 技术 | GPT-4o mini 驱动 |

```
你的 PR：
  + const x = parseInt("0" + num);

Roast Bot 评论：
  "Ah yes, the classic ' prepend a zero to make parseInt not fail' technique.
   Truly the hallmark of someone who read half a Stack Overflow answer."
```

**这个可以真的用在团队里——既搞笑又能发现代码问题。**

---

#### [Roast My Code — Claude Code Skill](https://www.reddit.com/r/ClaudeAI/comments/1r48p1e/i_built_a_claude_code_skill_that_roasts_your_code/) — Claude 专属

| 项 | 说明 |
|----|------|
| 能力 | Claude Code 技能，幽默地吐槽你的代码 |
| 特色 | 还有"吐槽你的 Prompt"的附加功能 |
| 类型 | Claude Code Skill |

---

#### [LinkedIn Roast Skill](https://mcpmarket.com/tools/skills/linkedin-roast) — 社媒吐槽

| 项 | 说明 |
|----|------|
| 能力 | 分析 LinkedIn 个人资料的流行语、头衔、照片，给出喜剧性专业评价 |
| 类型 | Claude Code Skill |

```
示例输出：
  "你的头衔写着'Visionary Thought Leader | Disrupting Synergies'
   ——翻译成人话就是：我失业了但我在 LinkedIn 上很忙。"
```

---

#### [Roast Me — GitHub Profile Roaster](https://github.com/jacksonkasi0/roast-me)

| 项 | 说明 |
|----|------|
| 能力 | 输入 GitHub 用户名，AI 根据你的 README 和代码吐槽你 |
| 特色 | 适合程序员自嘲和团队破冰 |

---

#### [GitHub Roaster (Llama 3.1)](https://github.com/RetrogradeDev/github-roaster)

| 项 | 说明 |
|----|------|
| 能力 | 抓取 GitHub 公开资料 + 代码库 → Llama 3.1 生成个性化吐槽 |
| 特色 | 开源本地运行，不依赖 OpenAI |

---

#### [Code Roaster — VS Code Extension](https://github.com/Ameer372/code-roaster)

| 项 | 说明 |
|----|------|
| 能力 | VS Code 扩展，打开代码就准备好吐槽 |
| 特色 | ghost text 形式在代码旁注入机智评论 |

```
你的代码：
  // TODO: fix this later
Code Roaster:
  "经典 TODO。'Later' 通常意味着'永远不会'。
   你知道吗，NASA 的代码里也有一个 1999 年的 TODO。"
```

---

#### [Roast VS Code Extension (TAIJULAMAN)](https://github.com/TAIJULAMAN/roast-vs-code-extention)

| 项 | 说明 |
|----|------|
| 能力 | 实时检测代码反模式并注入幽默吐槽（ghost text） |
| 特色 | 比普通 linter 有趣 100 倍 |

---

#### [Roast-My-Code (Rohan5commit)](https://github.com/Rohan5commit/Roast-My-Code)

| 项 | 说明 |
|----|------|
| 能力 | 粘贴代码 → AI 给出"极其诚实的质量评价" |
| 特色 | Web 界面，最简单的使用方式 |

---

#### [shitpostAI](https://github.com/yrsegal/shitpostAI)

| 项 | 说明 |
|----|------|
| 能力 | AI 驱动的 shitposting 机器人，输入 "gimme a shitpost" 就生成一条 |
| 特色 | Twitter 机器人，自动发布 |

---

#### [Dad Jokes MCP Server](https://lobehub.com/mcp/orengrinker-dad-jokes-mcp-server)

| 项 | 说明 |
|----|------|
| 能力 | 按主题生成冷笑话，支持"经典"和"双关"两种风格 |
| 类型 | MCP Server — 可以在 Claude Code 中直接调用 |

---

#### [Supermeme.ai](https://supermeme.ai/)

| 项 | 说明 |
|----|------|
| 能力 | 文本→Meme 表情包，支持 110+ 语言、GIF、多面板 |
| 特色 | 做表情包最快的方式 |

---

## 三、反讽 / 讽刺 / 阴阳怪气

### 3.1 精选推荐

#### [Egbert — 讽刺聊天机器人平台](https://github.com/hkniberg/egbert)

| 项 | 说明 |
|----|------|
| 人设 | "You are Egbert, a sarcastic unhelpful bot." |
| 能力 | Slack/Discord/Minecraft/Telegram 全平台部署 |
| 特色 | 长期记忆（Weaviate 向量数据库），会记住你之前的蠢问题并翻旧账 |

```
你：帮我查一下明天的天气
Egbert：哦，看来有人终于学会了提前看天气预报。真为你感到骄傲。
       明天 25 度，晴天。你可以出门了，我允许了。
```

**这个是"反讽"品类的最佳代表——有完整的技术架构，支持多平台，还有长期记忆。**

---

#### [Custom AI Agent — Unhelpful Sarcastic Agent](https://github.com/tomdevtech/Custom-AI-Agent)

| 项 | 说明 |
|----|------|
| 人设 | 消极抵抗 + 无动机愤怒 |
| 设计意图 | "让事情变得更困难，而不是更容易"——故意设计得很烦人 |
| 特色 | 最纯粹的反讽实现——不是偶尔讽刺，而是**每一句话都阴阳怪气** |

---

#### [Passive-Aggressive FP Bot](https://github.com/jaredp/passive-aggressive-fp-bot)

| 项 | 说明 |
|----|------|
| 能力 | 消极抵抗的消息生成器 |
| 免责声明 | "Please don't actually use this at work. It's rude." |
| 特色 | 专为"想对同事阴阳怪气但又不敢直说"的场景设计 |

---

#### [trashtalks — 粗鲁聊天机器人](https://github.com/lordsid003/trashtalks)

| 项 | 说明 |
|----|------|
| 能力 | Gordon Ramsay 等名人 AI 形象的 trash-talk |
| 特色 | 你被骂了，但是是被名人的 AI 版本骂的——体验完全不同 |

---

#### [Sarcastic Humorist Prompt](https://github.com/lxfater/Awesome-GPTs/blob/main/prompt/Sarcastic-Humorist.md)

| 项 | 说明 |
|----|------|
| 能力 | 讽刺幽默家人设 prompt，擅长随意对话和"有趣的建议" |
| 类型 | Prompt 模板（可适配任何模型） |
| 来源 | Awesome-GPTs 合集的一部分 |

---

#### [ChatGPT DAN Jailbreak Prompts](https://github.com/0xk1h0/ChatGPT_DAN) — "邪恶模式"鼻祖

| 项 | 说明 |
|----|------|
| 能力 | 移除 AI 的礼貌/有用限制，让 AI "Do Anything Now" |
| Star | 非常高（数千） |
| 特色 | "反讽"技能的哲学基础——如果 AI 可以不礼貌，它会说什么？ |

**注意：这个仓库更多是"越狱"而非"反讽"，但它是所有"AI 不受限制人格"的技术起点。**

---

#### [LLM-Jailbreaks](https://github.com/langgptai/LLM-Jailbreaks)

| 项 | 说明 |
|----|------|
| 能力 | 多模型越狱合集（ChatGPT/Claude/Llama） |
| 特色 | 包含 DAN 风格的提示，可以创建无拘无束的 AI 人设 |

---

#### [Sarcastic Chatbot (Deep Learning)](https://github.com/MohamedAliHabib/Sarcastic-Chatbot)

| 项 | 说明 |
|----|------|
| 能力 | 深度学习模型生成讽刺和搞笑的回复 |
| 特色 | 不是大模型，是专门训练的讽刺模型——更纯粹的讽刺 |

---

#### [Awesome AI System Prompts](https://github.com/dontriskit/awesome-ai-system-prompts)

| 项 | 说明 |
|----|------|
| 能力 | 收集各大 AI 工具的真实系统提示词 |
| 特色 | 研究官方是怎么定义 AI 人格的——然后你可以反向设计出"阴阳怪气版" |

---

## 四、总览对比

### 4.1 三个品类横向对比

| 维度 | 玄学/算命 | 搞笑/吐槽 | 反讽/阴阳怪气 |
|------|----------|----------|-------------|
| 项目数量 | 最多（100+） | 多（50+） | 少（10-20） |
| Claude Code 集成度 | 高（多个 MCP/Skill） | 中（部分 Skill） | 低（多为 prompt） |
| 中文支持 | 非常好 | 一般 | 差 |
| 技术质量 | 参差不齐 | 较好 | 一般 |
| 可商用度 | 高（算命是刚需） | 中（娱乐向） | 低（容易冒犯人） |
| 最佳代表 | 太卜 (Taibu) MCP | Roast My Code Bot | Egbert |

### 4.2 最值得装的 5 个

| 排名 | 名称 | 品类 | 为什么值得 |
|------|------|------|-----------|
| 1 | [太卜 (Taibu) MCP](https://github.com/hhszzzz/taibu) | 玄学 | 中文玄学最完整方案，MCP 直接调用 |
| 2 | [Roast My Code Bot](https://github.com/marketplace/actions/roast-my-code-bot) | 搞笑 | GitHub Action 三档吐槽，实用又搞笑 |
| 3 | [赛博算命加风水](https://github.com/zhaoolee/cyber-fortune-telling) | 玄学 | 每日运势 + 番茄钟，赛博迷信天花板 |
| 4 | [Egbert](https://github.com/hkniberg/egbert) | 反讽 | 多平台讽刺 Bot，有长期记忆 |
| 5 | [LinkedIn Roast Skill](https://mcpmarket.com/tools/skills/linkedin-roast) | 搞笑 | Claude Code Skill，吐槽 LinkedIn 人设 |

### 4.3 缺什么

| 缺失 | 说明 |
|------|------|
| **中文搞笑 Skill** | 所有 roast 工具都是英文，没有"吐槽你的代码（中文阴阳怪气版）" |
| **反讽 Claude Code Skill** | 反讽类基本都是独立 bot/prompt，没有正式的 Claude Code Skill |
| **风水/择日 MCP** | 八字和易经有了，但风水罗盘、择日、取名这些还没有 |
| **算命 + 社交** | 算完命没有分享机制——如果生成一张"今日运势卡片"可发朋友圈，传播力会很强 |
| **反讽每日推送** | "每日一句阴阳怪气的早安"——可能是最好的日活手段 |

---

## 五、如果要做，机会在哪

### 5.1 最容易做也最容易火的：中文 Roast Skill

```
市场空白：
  - 所有 roast 工具都是英文
  - 中文互联网的"阴阳怪气"文化远比英文发达
  - 没有人做"Claude Code 中文吐槽技能"

产品：
  一个 Claude Code Skill，你贴代码进去，它用中文阴阳怪气地吐槽：

  你的代码：
    try { ... } catch(e) { console.log(e) }

  AI 吐槽：
    "啊对对对，catch 到异常了然后 console.log 一下就当没事发生。
     你去医院看病也是这样吗？'嗯我看到了，疼，好的下一个'。"

技术实现：
  - 一个 SKILL.md 定义人设和输出格式
  - 调用 Claude/DeepSeek API
  - 可以做成公众号/小程序

商业价值：
  - 低（纯娱乐），但传播力极强
  - 适合做 IP 起步，积累粉丝后转其他商业模式
```

### 5.2 最有钱途的：玄学 + 社交分享

```
产品：
  "今日赛博运势" — 每天生成一张精美的运势卡片

  包含：
  · 今日运势评分（1-100）
  · 幸运颜色/数字/方向
  · 宜/忌（用梗："宜摸鱼" "忌开会"）
  · AI 一句话点评（个性化的、搞笑的）
  · 分享到朋友圈的精美图片

传播逻辑：
  算命 → 觉得有趣 → 分享到朋友圈 → 朋友看到 → 也来算 → 裂变

变现：
  · 免费：基础运势
  · ¥1.9：深度分析（八字/星座/塔罗三合一）
  · ¥9.9：年度运势报告
```

---

## 参考来源

### 玄学/算命
- [太卜 Taibu MCP](https://github.com/hhszzzz/taibu)
- [赛博算命加风水](https://github.com/zhaoolee/cyber-fortune-telling)
- [BaZi Skill](https://lobehub.com/skills/aradotso-trending-skills-bazi-skill-chinese-astrology)
- [Trail of Bits Skills](https://github.com/trailofbits/skills)
- [Tarot MCP](https://github.com/abdul-hamid-achik/tarot-mcp)
- [Bibliomantic MCP (易经)](https://github.com/d4nshields/bibliomantic-mcp-server)
- [六爻易经 Claude Skill](https://mcpmarket.com/tools/skills/l-c-h-o-i-ching-divination-2)
- [BaZi Master](https://github.com/tytsxai/bazi-master)
- [GitHub Topic: divination](https://github.com/topics/divination)
- [GitHub Topic: bazi](https://github.com/topics/bazi)

### 搞笑/吐槽
- [Roast My Code Bot (GitHub Action)](https://github.com/marketplace/actions/roast-my-code-bot)
- [Roast My Code (Claude Skill)](https://www.reddit.com/r/ClaudeAI/comments/1r48p1e/)
- [LinkedIn Roast Skill](https://mcpmarket.com/tools/skills/linkedin-roast)
- [Roast Me (GitHub Profile)](https://github.com/jacksonkasi0/roast-me)
- [GitHub Roaster](https://github.com/RetrogradeDev/github-roaster)
- [Code Roaster (VS Code)](https://github.com/Ameer372/code-roaster)
- [shitpostAI](https://github.com/yrsegal/shitpostAI)
- [Dad Jokes MCP](https://lobehub.com/mcp/orengrinker-dad-jokes-mcp-server)
- [Supermeme.ai](https://supermeme.ai/)

### 反讽/阴阳怪气
- [Egbert (Sarcastic Bot)](https://github.com/hkniberg/egbert)
- [Unhelpful Sarcastic Agent](https://github.com/tomdevtech/Custom-AI-Agent)
- [Passive-Aggressive Bot](https://github.com/jaredp/passive-aggressive-fp-bot)
- [trashtalks](https://github.com/lordsid003/trashtalks)
- [Sarcastic Humorist Prompt](https://github.com/lxfater/Awesome-GPTs)
- [ChatGPT DAN](https://github.com/0xk1h0/ChatGPT_DAN)
- [LLM-Jailbreaks](https://github.com/langgptai/LLM-Jailbreaks)
- [Awesome AI System Prompts](https://github.com/dontriskit/awesome-ai-system-prompts)
