# READING Plan for AI

好，资料已经找齐。按照实用程度和相关性整理如下。

---

## Top GitHub Repos（按用途分类）

### 🤖 AI Coding Agent — 直接用于自动化编程

**1. OpenHands**
`github.com/OpenHands/OpenHands` · 65k stars
目前最成熟的开源AI编程Agent，能解决50%以上真实GitHub Issue，提供SDK、CLI和Cloud三种接入方式。适合想构建自己工作流的核心工具。

**2. SWE-agent**
`github.com/princeton-nlp/SWE-agent` · Princeton/Stanford出品
核心创新是Agent-Computer Interface（ACI）——专门为LLM设计的抽象层，解决传统Linux shell对人类设计但对LLM不友好的问题。学术背景，架构干净。

**3. Aider**
`github.com/paul-gauthier/aider` · 40k stars
深度Git集成，自动commit，最成熟的pair-programming工作流，4.1M安装量。Terminal native，适合日常编码增强。

**4. Cline**
`github.com/cline/cline` · 57.9k stars
每个操作都需要用户明确确认——文件修改、命令执行、浏览器操作。速度慢但可审计，是GitHub 2025 Octoverse增长最快的AI开源项目。

**5. OpenCode**
`github.com/opencode-ai/opencode` · 100k stars
Go语言构建的Terminal原生TUI，支持75+个LLM提供商，本地模型优先，隐私保护，单月增长30k stars。

---

### 🧩 Multi-Agent框架 — 核心架构参考

**6. AutoGen (Microsoft)**
`github.com/microsoft/autogen` · 40k+ stars
多Agent对话框架，Orchestrator-Worker架构的标准参考实现，生产级可用。

**7. CrewAI**
`github.com/crewAIInc/crewAI`
专注多Agent协作框架，每个Agent有角色定义、工具集和目标，适合构建分工明确的Agent团队。

**8. MetaGPT**
`github.com/geekan/MetaGPT`
给一行需求，返回PRD、设计文档、任务拆分、代码仓库和CI配置。Multi-Agent meta编程框架，NeurIPS 2025接收。

**9. LangGraph**
`github.com/langchain-ai/langgraph`
工作流和图结构框架，适合构建有状态、有条件分支的复杂Agent流程。状态管理是强项。

**10. ChatDev**
`github.com/OpenBMB/ChatDev`
多Agent协作开发平台，支持自动化信息收集和内容发布，可构建包含CEO、CTO、工程师等角色的自主Agent团队。

---

### ⚡ 并行与自动化 — 直接提升Token消耗强度

**11. amux**
`github.com/amux`
开源Agent多路复用器，用Web Dashboard并行运行数十个Claude Code会话，带Kanban看板、Agent间REST API和移动端PWA。这个是并行跑多个Claude Code的直接工具。

**12. n8n**
`github.com/n8n-io/n8n` · 150k stars
AI-native工作流自动化平台，2025年突破150k stars，支持400+集成，是连接所有AI工具的管道骨架。

**13. Dify**
`github.com/langgenius/dify` · 136k stars
处理Agent逻辑的基础设施，支持多模型提供商、RAG管道管理和MCP集成，适合快速构建AI驱动的服务。

---

### 📚 学习资源Repo

**14. awesome-llm-apps**
`github.com/Shubhamsaboo/awesome-llm-apps`
涵盖RAG、AI Agent、Multi-agent团队、MCP、语音Agent的实用LLM应用集合，包含Anthropic、OpenAI、Google等多个模型的示例。

**15. awesome-llm-agents**
`github.com/kaushikb11/awesome-llm-agents`
持续更新的LLM Agent框架精选列表，按功能分类，是框架选型的最佳索引。

---

## Top Articles（必读，按重要性排序）

### 🏆 第一梯队：Anthropic官方Engineering文章（最直接）

**1. Building Effective Agents**
`anthropic.com/research/building-effective-agents`
Anthropic官方定义的6种可组合Agent模式：Prompt Chaining、Routing、Parallelization、Orchestrator-Workers、Evaluator-Optimizer。所有Agent架构的基础认知，必读。

**2. How We Built Our Multi-Agent Research System**
`anthropic.com/engineering/multi-agent-research-system`
关键数据：token用量本身解释了80%的性能方差；Multi-agent系统比单次对话消耗约15倍token。Lead Agent并行启动3-5个Subagent，将复杂查询的研究时间缩短了90%。这篇文章直接回答了你的问题。

**3. Effective Context Engineering for AI Agents**
`anthropic.com/engineering/effective-context-engineering-for-ai-agents`
从Prompt Engineering到Context Engineering的演进：如何在有限context window里放入最高信噪比的tokens。介绍了Compaction、Note-taking、Multi-agent三种context管理策略。

**4. Effective Harnesses for Long-Running Agents**
`anthropic.com/engineering/effective-harnesses-for-long-running-agents`
解决跨多个context window的长期运行问题：Initializer Agent负责环境初始化，Coding Agent负责增量推进，每个session结束时留下清晰的artifacts给下一个session。你要搭后台持续运行的Pipeline，这篇是直接参考。

**5. 2026 Agentic Coding Trends Report**
`resources.anthropic.com/2026-agentic-coding-trends-report`
Anthropic官方报告，8个趋势。核心判断：多Agent架构取代单Agent工作流，任务时间跨度从分钟扩展到天或周，工程师角色从写代码转向编排Agent。

---

### 🔥 第二梯队：深度技术分析

**6. Simon Willison对Multi-Agent Research System的分析**
`simonwillison.net/2025/Jun/14/multi-agent-research-system/`
对Anthropic多Agent系统的逆向分析。早期错误包括：对简单查询spawn了50个subagent、无休止搜索不存在的来源、subagent之间过度更新互相干扰。非常实用的失败案例。

**7. Open-Source AI Coding Agents 2026完整对比**
`wetheflywheel.com/en/guides/open-source-ai-coding-agents-2026/`
8个主流开源AI编码Agent的横向对比：OpenHands、OpenCode、Aider、Continue、Cline、Roo Code等，按企业级、隐私优先、IDE集成等维度评分。工具选型直接参考。

**8. Top AI GitHub Repositories in 2026**
`blog.bytebytego.com/p/top-ai-github-repositories-in-2026`
ByteByteGo出品，对当前最重要的AI Agent仓库的系统梳理，图文并茂。

**9. Top Agentic AI Frameworks in 2025 (Medium)**
`medium.com/data-science-collective/top-agentic-ai-frameworks-in-2025`
6大分类框架的选型矩阵：通用编排、工作流图结构、多Agent协作、企业级、领域专用、低代码。每类都有评分表。

**10. Building AI Agents with Anthropic's 6 Composable Patterns**
`aimultiple.com/building-ai-agents`
用n8n实验Anthropic 6种Agent模式的实践报告，3天实验总结，包含具体的workflow配置案例。

---

## 一句话行动建议

先读**第2篇**（Multi-Agent Research System），再看**amux**的文档——这两个加在一起，是目前最快让你的token消耗量从"手动驱动"跳到"系统自驱动"的最短路径。