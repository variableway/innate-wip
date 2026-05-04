# Balanced View AI 工具：Top 15 仓库与 Skill 推荐

> 用于多视角生成、辩论分析、魔鬼代言人、辩证推理和反谄媚检测的核心开源资源

---

## 一、多智能体辩论与视角生成（Multi-Agent Debate）

### 1. LLM4ArgGen / Debate-to-Write
- **GitHub**: https://github.com/Derekkk/LLM4ArgGen
- **核心能力**：基于人格（persona）的多智能体辩论框架，用于生成多样化论点
- **为什么适合 Balanced View**：它先为每个 agent 分配代表不同视角的人格，然后通过辩论形成逻辑一致但观点多元的论证计划。这本质上就是一个"自动生成平衡视角"的引擎。
- **适用场景**：争议性话题的议论文生成、亲密关系冲突的双边翻译、政策分析的多立场汇总

### 2. Multi-LLM-Debate-CLI
- **GitHub**: https://github.com/Capataina/Multi-LLM-Debate-CLI
- **核心能力**：支持 OpenAI/Anthropic/Google/Ollama 的异步多模型辩论 CLI 工具
- **为什么适合 Balanced View**：可以让 GPT-4、Claude、Gemini 分别代表不同立场进行辩论，并通过"滚动总结"（Rolling Summarization）保留核心论点。天然适合构建"AI 观点光谱"。
- **适用场景**：跨模型观点对齐分析、投资决策的多模型共识引擎、新闻事件的左右光谱还原

### 3. StockSense-AI
- **GitHub**: https://github.com/Spkap/StockSense-AI
- **核心能力**：股票分析中的 Bull vs Bear 多智能体辩论系统
- **为什么适合 Balanced View**：这是目前最接近生产环境的"多空辩论"实践。它内置了 Bull（看多）、Bear（看空）、Skeptic（怀疑论者）三个 agent，通过证据评分和概率加权输出结论。
- **适用场景**：可以直接 fork 过来改造成"亲密关系冲突辩论机"或"社会议题多空分析器"

---

## 二、魔鬼代言人与对抗性推理（Devil's Advocate & Red Teaming）

### 4. Wingtail/devils-advocate
- **GitHub**: https://github.com/Wingtail/devils-advocate
- **核心能力**：两个 LLM 角色（Persuader 说服者 vs Questioner 质疑者）互相博弈，直到达成一致
- **为什么适合 Balanced View**：这是最简单但最有效的"对抗性精炼"框架。质疑者必须找出逻辑漏洞，说服者必须回应。最终输出经过多轮挑战后的稳健结论。
- **适用场景**：任何需要"先自我否定再输出"的 Balanced View 生成流程

### 5. richiethomas/claude-devils-advocate
- **GitHub**: https://github.com/richiethomas/claude-devils-advocate
- **核心能力**：Claude Code 的 slash command，模拟 Author 与 Reviewer 之间的多轮对抗性代码审查
- **为什么适合 Balanced View**：Reviewer 每轮必须提出实质性质疑，Author 必须反驳或让步。这种"强制不同意"（forced disagreement）机制可以完美迁移到文本审查和观点校准。
- **适用场景**：内容发布前的偏见审计、决策建议的对抗性检验

### 6. joelteply/llm-interrogation
- **GitHub**: https://github.com/joelteply/llm-interrogation
- **核心能力**：情报审讯技术适配的 LLM 提取框架，内含"Dialectic: Theory vs Devil's Advocate"模块
- **为什么适合 Balanced View**：Theory Writer 构建叙事，Devil's Advocate 独立搜索并提出质疑，双方多轮交锋后精炼理论。特点是要求质疑者"必须做独立研究后才能否定"。
- **适用场景**：深度事实核查、阴谋论/谣言的对抗性拆解

### 7. duh (Multi-model consensus engine)
- **GitHub**: https://github.com/msitarzewski/duh
- **核心能力**：多模型共识引擎，内置 Consensus 协议（挑战类型包含 flaw / alternative / risk / devil's advocate）
- **为什么适合 Balanced View**：最强模型提出观点，其他模型必须用四种框架之一进行挑战，提出者修订后形成带置信度和保留异议的决策。
- **适用场景**：需要量化"不确定性"和"保留意见"的平衡视角输出

---

## 三、辩证推理与结构化辩论（Dialectical & Structured Reasoning）

### 8. Hegelion
- **GitHub**: https://github.com/Hmbown/Hegelion
- **核心能力**：黑格尔式辩证推理架构（Thesis → Antithesis → Synthesis）
- **为什么适合 Balanced View**：强制模型在得出结论前先自我反对。这对于避免 AI 的"首因效应"和确认偏误极其有效。
- **适用场景**：哲学/伦理讨论、复杂决策分析、冲突调解中的"第三视角"生成

### 9. lyndonkl/claude (Skills 集合)
- **GitHub**: https://github.com/lyndonkl/claude
- **核心技能**：
  - **deliberation-debate-red-teaming**：结构化辩论格式（Oxford、fishbowl、devil's advocate）
  - **dialectical-mapping-steelmanning**：用最强形式呈现对立立场，通过 Toulmin 模型映射原则，合成第三方案
  - **chain-roleplay-debate-synthesis**：专家人格的多视角角色扮演、结构化辩论与观点合成
  - **role-switch**：从多个利益相关者视角系统分析决策， uncover blind spots
- **为什么适合 Balanced View**：这是目前最完整的"辩证推理+辩论合成"技能库，可以直接用于 Kimi/Claude 的 Skill 系统。
- **适用场景**：亲密关系调解、商业决策、政策分析

---

## 四、论点挖掘与立场检测（Argument Mining & Stance Detection）

### 10. argminer
- **GitHub**: https://github.com/namiyousef/argument-mining
- **核心能力**：端到端论点挖掘 PyTorch 包，支持 Argument Annotated Essays、PERSUADE 等数据集
- **为什么适合 Balanced View**：可以从长文本中自动提取 Claim、Premise、Counterclaim、Rebuttal 等论证结构，是构建"观点拆解器"的基础组件。
- **适用场景**：长文/辩论记录的结构化摘要、社交媒体争议的论点提取

### 11. Computational-Argumentation
- **GitHub**: https://github.com/shilida/Computational-Argumentation
- **核心能力**：计算论证学资源集合，涵盖文本挖掘到智能辩论的任务框架
- **为什么适合 Balanced View**：提供了从文本挖掘、立场检测到辩论生成的完整 pipeline 参考。
- **适用场景**：学术研究、辩论教学工具开发

### 12. OrChiD (Chinese Debate Corpus)
- **GitHub**: https://github.com/xiutian/OrChiD
- **核心能力**：中文辩论语料库，用于目标无关的立场检测和论证对话摘要
- **为什么适合 Balanced View**：如果你要做中文语境下的 Balanced View 工具，这是目前少有的高质量中文辩论数据集基础。
- **适用场景**：中文社交媒体争议分析、中文论辩生成模型训练

---

## 五、反谄媚与偏见审计（Anti-Sycophancy & Bias Audit）

### 13. sycophancy benchmark (lechmazur)
- **GitHub**: https://github.com/lechmazur/sycophancy
- **核心能力**： narrartor-bias 谄媚基准测试，测量 LLM 是否会因为叙事者视角而改变对同一纠纷的判决
- **为什么适合 Balanced View**：Balanced View 最大的敌人不是偏见，而是"AI 为了迎合用户而伪装出的中立"。这个仓库提供了检测这种伪中立的严格方法论。
- **适用场景**：评估你的 Balanced View AI 是否真正中立，还是只是在"读空气"

### 14. sycoverse
- **GitHub**: https://github.com/mattpagett/sycoverse
- **核心能力**：对抗性跨度标注（adversarial span annotation）实时检测 LLM 输出中的谄媚文本
- **为什么适合 Balanced View**：可以高亮出 AI 回复中"为了让你高兴而说"的操纵性短语，帮助用户识别伪中立。
- **适用场景**：AI 回复的实时质量监控、关系调解 AI 的可信度增强

### 15. bias-in-generative-ai
- **GitHub**: https://github.com/andrewmarconi/bias-in-generative-ai
- **核心能力**：生成式 AI 图像模型的偏见检测框架，但方法论可迁移到文本
- **为什么适合 Balanced View**：提供了一套完整的实验设计、统计分析和可视化流程，用于量化 AI 输出的偏见方向。
- **适用场景**：将图像偏见检测的方法论迁移到文本立场偏见检测

---

## 六、 bonus：AI 调解与审议（AI Mediation & Deliberation）

### 16. Habermas Machine
- **GitHub**: https://github.com/google-deepmind/habermas_machine
- **核心能力**：Google DeepMind 的 AI 调解器，用于民主审议和群体决策
- **为什么适合 Balanced View**：研究显示，AI 调解在帮助参与者找到共同点方面优于人类调解。它能公平地代表多数和少数观点，并生成被多方认可的群体声明。
- **适用场景**：群体讨论总结、社区治理、企业内部的争议调解

---

## 应用建议：如何组合这些资源构建你的 Balanced View AI

### 推荐的最小可行架构（MVP）

```
输入层：用户描述一个冲突/争议
    ↓
立场提取（argminer / OrChiD 思路）：识别 Claim A 和 Claim B
    ↓
多 Agent 辩论（LLM4ArgGen + Multi-LLM-Debate-CLI）：
    - Agent 1：代表立场 A（steelmanning）
    - Agent 2：代表立场 B（steelmanning）
    - Agent 3：Devil's Advocate（质疑双方弱点）
    - Agent 4：Synthesizer（寻找聚焦点和第三视角）
    ↓
对抗性审计（sycophancy benchmark + sycoverse 思路）：
    - 检查输出是否过度迎合用户的初始立场
    - 检查是否遗漏了某一方的核心论据
    ↓
输出层：结构化 Balanced View 报告
    - 双方最强论据
    - 共同承认的事实基线
    - 各自论证的薄弱点
    - 可操作的聚焦点建议
```

### 技术实现路径

**阶段 1（PoC）**：
- 用 **lyndonkl/claude 的 dialectical-mapping-steelmanning skill** 做 Prompt 模板
- 用 **Wingtail/devils-advocate** 的思路增加一轮对抗性质疑
- 输出格式参考 **Hegelion 的 Thesis → Antithesis → Synthesis**

**阶段 2（产品化）**：
- 引入 **Multi-LLM-Debate-CLI** 的架构，支持多模型并发辩论
- 加入 **sycophancy benchmark** 的评估逻辑，在每次输出后跑一个"伪中立检测"
- 用 **argminer** 的思路对输入文本做自动论点结构化

**阶段 3（规模化）**：
- 集成 **Habermas Machine** 的群体审议逻辑，支持多方（不只是两方）冲突
- 建立用户反馈闭环，不断优化"聚焦点发现"的准确率

---

*文档生成时间：2026-04-17*  
*筛选标准：开源可获取、与 Balanced View 生成直接相关、具备可迁移性、覆盖中英文语境*  
*适用对象：希望构建 AI 辅助冲突调解、观点平衡生成或多立场分析工具的开发者*
