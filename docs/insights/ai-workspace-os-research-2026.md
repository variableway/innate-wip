# AI Workspace 主题调研与个人 Work/Life OS 技术选型（2026-09）

> Scope: Planning/Task Management、AI Agent Runtime & Governance、Client Framework、Agent Framework
> Goal: 为「个人使用的、可组装/组合的 Work & Life OS」给出技术选择
> Method: 四路并行 Web 调研（2025-2026 资料）+ 对照 innate-workspace 现状

## 0. 一句话结论

个人 Work/Life OS 的最优解不是"选一个产品"，而是：**文件 + git 作为数据主权层，SQLite 作为索引/查询层，MCP 作为唯一集成协议，CLI Agent harness（ZCode/Claude Code 等）作为重执行运行时，一个轻量 agent-loop 守护进程做调度自动化，Web/桌面 UI 只做视图**。协议战争已经结束（MCP + A2A 同属 Agentic AI Foundation），个人场景应避开同步引擎与重型编排框架这两个常见过度设计。

---

## 1. Planning / Task Management

### 1.1 Landscape

| 类别 | 代表 | 状态 | 对个人自建的意义 |
|---|---|---|---|
| AI 自动排程 SaaS | Motion、Reclaim.ai（ Dropbox 收购）、SkedPal、Trevor AI | 闭源活跃 | 只借鉴机制，不存数据 |
| AI 化研发 PM | Linear（AI Agents/Loops/官方 MCP）、Todoist（官方 MCP） | 闭源，个人免费档可用 | 数据模型与 MCP 接口可抄 |
| 反面教材 | Height 2.0 | 2025-09 停服 | AI pivot 失败 + 数据托管风险 |
| 文件优先 | Obsidian（Tasks/Dataview/Full Calendar）、Org-mode、Logseq、AnyType | 活跃 | 个人任务库首选形态 |
| 开源自托管 | Huly（EPL-2.0，hosted 关停但 selfhost 存活）、Vikunja（AGPL）、Planka、AppFlowy、AFFiNE | 参差不齐 | Focalboard 已停维护，AFFiNE selfhost 不成熟，慎选 |

### 1.2 关键要点

- **数据模型**：PARA（Projects/Areas/Resources/Archives）管结构 + GTD 管流程是个人系统事实标准；Linear 的 Team→Project→Issue + workflow state（状态机而非 status 字段）值得自建时借鉴。
- **互操作没有统一标准**，事实路径三条：iCal/ICS（日历层）、各家 JSON/CSV 导入导出、**MCP（agent 读写任务系统的通用协议层）**——Linear、Todoist 已有官方 MCP server。
- **Agent 时代 Planning 模式**：Plan-then-Execute + Replanner 已成生产共识（比 ReAct 省 token 更可控）；agent 内置 todo 工具（TodoWrite）作为工作记忆；claude-task-master 代表「local-first 任务库 + MCP server」模式；2025 年一批实践（Obsidian as AI Agent OS、TaskForge、Telegram+Obsidian 日计划）的共同结论：**文件即数据库，agent 即调度器**。
- **自动排程的本质是约束求解**（deadline/优先级/时长/buffer/日历空闲），不是玄学 LLM。个人复刻用规则引擎 + LLM 意图解析可到 80% 效果。Reclaim 的弹性块（Habits/优先级/Smart 1:1）、SkedPal 的 Time Map（时间窗口定义上下文）是两个可直接借鉴的机制。

---

## 2. AI Agent Runtime & Governance

### 2.1 沙箱/运行时

| 项目 | 隔离技术 | 启动 | 备注 |
|---|---|---|---|
| Firecracker / E2B / Daytona | microVM | ~90-700ms | 云上 agent 代码执行事实选择；Daytona 可自托管 |
| gVisor | 用户态内核 | 最快 | 半信任负载，syscall 密集有 10-30% 开销 |
| wasmtime / Wassette | WASM+WASI | 毫秒级 | 工具级沙箱上升期 |
| Docker | namespace | 秒级 | 隔离最弱 |
| **macOS Seatbelt（sandbox-exec）** | TrustedBSD | 即时 | CLI 标记 deprecated 但引擎实际在用，是 macOS 上约束任意进程文件访问的唯一手段 |
| Apple Containerization | 轻量 Linux VM | 快 | 仅 Linux 负载，不是 macOS 进程沙箱 |

### 2.2 协议：大一统已发生

- **MCP**：事实标准。2025-06 捐 Linux Foundation；2026-07-28 规范新增 Tasks（异步长任务 + durable handles）、Skills over MCP、MCP Apps、Elicitation；streamable HTTP 已取代 SSE；官方 registry 已上线。
- **A2A**：agent 间通信赢家（150+ 组织，主流云生产使用）；ACP（IBM/BeeAI）已并入 A2A；AGNTCY 并轨。
- **2026-08：MCP 与 A2A 一同并入新成立的 Agentic AI Foundation（AAIF）**——"协议战争终结"。个人项目只需对接这两个。

### 2.3 治理栈

- **身份/授权**：OIDF《Identity Management for Agentic AI》模式——agent 注册为 OAuth client + 用户委托身份，Token Exchange（RFC 8693）换 task-scoped 短时效 token，禁止长驻密钥。
- **权限模型**：Claude Code 的 permission modes 证明「权限决定是否询问、沙箱决定能访问什么」双层互补；deny 规则保护 `.claude`/`.mcp.json`/`.bashrc` 防自我提权。
- **可观测**：OpenTelemetry GenAI 语义约定成为行业标准（agent/tool/handoff spans 扩展中）；Langfuse（MIT 核心，自托管）与 Arize Phoenix 是开源自托管双雄。
- **护栏/策略**：NeMo Guardrails（对话/PII）、Guardrails AI（输出校验）、OPA/Cedar（动作级授权）。
- **持久化执行**：Temporal 企业级但个人过重；个人场景事件循环 + SQLite 级 checkpoint / MCP Tasks durable handles 已够。注意 LangGraph checkpoint ≠ durable execution。

### 2.4 个人单机启示

macOS 首选双层防线：Seatbelt 文件隔离（工作目录可写 + denyRead ~/.ssh、~/.aws）+ 本地代理域名白名单（Claude Code 同款架构）；不信任任务丢 Apple Containerization Linux VM。治理最小栈：per-task 短时效 token、三级权限（默认询问/白名单放行/关键操作永远 ask）、每日 token/费用硬上限、OTel GenAI 格式本地日志。

---

## 3. Client Framework

### 3.1 数据/同步层

- **CRDT**：Yjs（生态最深，进入稳定维护期）；Automerge 3.0（内存 10x 改善）；**Loro（Rust/WASM，2026 仍高频发版，Peritext 富文本/Tree/时间旅行/git-like 分支，性能领先，增速最快）**。
- **同步引擎**：ElectricSQL 已转向 read-path；Zero 1.0（2026-06）；PowerSync；Triplit 团队被 Supabase acqui-hire；Livestore（事件溯源 + 一人一 SQLite，单用户个人应用反而合适）。
- **SQLite-everywhere**：WASM + OPFS 已可用；cr-sqlite（CRDT 扩展）开发放缓慎用。
- **单用户结论**：不需要完整同步引擎。**SQLite 文件 + 文件同步（Syncthing/iCloud/git）覆盖 95% 需求**；需要协作字段再上 Loro/Yjs 文档。

### 3.2 应用外壳（2026 视角）

- **Tauri 2.x**：体积比 Electron 小 ~96%、内存低 ~75%，权限模型细粒度，**sidecar 打包任意二进制是接本地 agent/模型进程的首选方式**；移动端 stable 但插件生态弱于 Capacitor。
- **Electron**：确定性最高（Claude Desktop、Cursor、Obsidian 全是 Electron），代价是体积内存。
- **Web/PWA**：OPFS + WASM SQLite 可用，适合做"只读/轻写镜像端"。

### 3.3 编辑器/块模型

- ProseMirror（底座）/ TipTap（headless 框架）/ **BlockNote（Notion-like MVP 最快）** / Lexical（React-first）；AFFiNE BlockSuite 证明自研块模型可行但成本高。
- 画布：**tldraw SDK 4.0 改商业许可（默认水印、生产付费）→ 追求可控选 Excalidraw（MIT）**。
- **共识做法：长文本以 .md 为存储格式，块级元数据入 SQLite/CRDT 索引层**——Obsidian 赢在数据主权，Logseq 文件→DB 迁移阵痛是反面教训。
- 交互收敛：**cmdk 全局动作入口 + chat-first + 流式渲染**（Vercel AI SDK UI 流原语 + Streamdown）。

### 3.4 参考案例架构共识

AFFiNE（Electron + Yjs + Rust）、SiYuan（Electron + Go kernel）、AnyType（Go + P2P）、AppFlowy（Flutter + Rust core）共同点：**"Web 前端 + 本地核心进程"，数据/逻辑放 UI 之外的进程，UI 可替换**。AI agent、索引、同步天然属于本地核心进程层。

---

## 4. Agent Framework

### 4.1 Landscape（2026-09）

| 框架 | 语言 | 定位 | 推荐 |
|---|---|---|---|
| LangChain/LangGraph 1.0 | Py/TS | 高层 agent + 图编排 + checkpoint | 生态最大，个人偏重 |
| OpenAI Agents SDK | Py/TS | 轻量 agent loop + handoffs/guardrails | ★★★★★ |
| Claude Agent SDK | Py/TS | Claude Code 当 harness 子进程 | ★★★★ |
| PydanticAI | Py | 类型安全 + durable（Temporal/DBOS） | ★★★★★ |
| Mastra | TS | TS 全家桶（agents/workflows/RAG/MCP/evals） | TS 首选 ★★★★★ |
| Vercel AI SDK v7 | TS | agent 抽象 + tool approval + UI 流原语 | ★★★★★ |
| smolagents / Agno / CrewAI / MS Agent Framework / DSPy / ADK | Py(.NET) | 各有生态位 | 按需 |

**2026 共识：loop 为默认、workflow 做编排、multi-agent 谨慎用。**

### 4.2 其他子系统

- **记忆**：Letta（原 MemGPT，sleep-time compute）重；mem0 易集成但基准有争议；Zep/Graphiti 时间知识图谱依赖 Neo4j。**Letta 自己的基准显示"文件系统即记忆"仍然很强**——个人用 markdown 记忆文件 + sqlite-vec + 结构化偏好档案通常优于独立记忆服务。
- **工具**：MCP server 生态即工具生态；浏览器自动化 Playwright MCP（确定性首选）/ browser-use（LLM 驱动）。
- **评测/观测**：LangSmith 闭源贵；**Langfuse 自托管 + promptfoo + 黄金测试集**是个人合理重量。
- **模型层**：保持 OpenAI 兼容（LiteLLM/直连）；GLM/DeepSeek 均兼容，GLM 另有 Anthropic 兼容 API 可直供 Claude Agent SDK；注意 reasoning 字段/parallel tool calls/strict schema 差异。

---

## 5. 个人可组装 Work/Life OS：技术选型

### 5.1 架构分层（结合 innate-workspace 现状）

```
┌─ UI 层      innate-wip (Next.js Web) + iframe plugin registry(已有) + cmdk/chat 入口
│             桌面壳可选 Tauri 2（sidecar = agent daemon）
├─ Agent 层   重活: CLI harness (ZCode/Claude Code) × task/project 任务包 + 波次分派(已有)
│             轻活: 本地 agent 守护进程 (TS: Vercel AI SDK / Mastra) —— 晨间 review、周报、同步、调度
├─ 协议层     MCP 唯一集成协议: workspace-mcp (tasks/notes/projects/registry CRUD) + 现成 server(Playwright/GitHub/日历)
│             A2A 备而不用
├─ 数据层     Markdown + frontmatter + git = source of truth(已有雏形)
│             SQLite = 索引/查询层 (FTS5 + sqlite-vec)；ICS 投影接日历
├─ 运行时/治理 git worktree 隔离(已有) + Seatbelt profile + 本地 egress 代理(域名白名单)
│             三级权限 + 每日预算上限 + OTel GenAI 日志 → Langfuse 自托管
└─ 模型层     OpenAI 兼容端点统一 (aiswitcher 已是切入点) + 多 provider 预算计量
```

### 5.2 决策表

| 决策点 | 推荐 | 备选 | 明确放弃 + 原因 |
|---|---|---|---|
| 数据主权 | .md + frontmatter + git，SQLite 做索引 | — | 纯 SaaS（Height 死、Huly hosted 关停）；纯 DB（Logseq 教训） |
| 任务模型 | Linear 式 Project→Issue + workflow state，PARA 分域 | GTD inbox 流 | 自造新格式（无互操作收益） |
| 日历/调度 | 规则引擎 time-block + LLM 意图解析，投影 ICS | — | 复刻 Motion 全自动重排（维护成本高收益低） |
| 集成协议 | MCP（全部工具封装成 server） | A2A（多 agent 时再上） | 自定义 RPC/HTTP API（浪费生态） |
| Agent 框架 | 轻量 loop：TS 用 Vercel AI SDK/Mastra，Py 用 PydanticAI | LangGraph（复杂 workflow 时局部用） | CrewAI 式角色编排（个人流程短） |
| 重执行 | CLI harness（ZCode/Claude Code）+ 任务包协议（已有） | Claude Agent SDK 程序化驱动 | 自研 harness（没必要） |
| 沙箱 | Seatbelt profile + egress 代理；不信任任务进 Apple Containerization | Daytona 自托管 | E2B/云沙箱（数据出本地） |
| 同步 | 文件同步（Syncthing/git）+ 单 SQLite | Loro 做协作字段实验 | Zero/PowerSync/ElectricSQL（单用户过度设计） |
| 客户端 | Web-first（Next.js 已有）+ plugin iframe（已有） | Tauri 2 壳 + sidecar | Electron（个人项目不值得体积代价）；MFE 框架（已调研决定 build-time registry） |
| 编辑器 | markdown-first；Notion-like 视图用 BlockNote | TipTap 自建 | tldraw（商业许可） |
| 记忆 | markdown 记忆文件 + sqlite-vec + 偏好档案 | mem0 | Letta 全套运行时（过重） |
| 观测 | Langfuse 自托管 + promptfoo | Arize Phoenix | LangSmith（闭源贵） |
| 模型接入 | OpenAI 兼容统一 + aiswitcher 加预算计量 | LiteLLM | 锁定单一厂商 SDK |

### 5.3 与现有体系的映射（你已有什么）

| 现有资产 | 在架构中的位置 | 下一步 |
|---|---|---|
| `registry.yaml` + innate-apps 目录学 | 数据层的组合元数据 | 给 registry 加 MCP 暴露（agent 可查/装组件） |
| `task/project` + `task/issues` 文档协议 | 任务模型层（人读版） | 双写 SQLite 索引；加 ICS 投影 |
| multi-agent-dispatch（波次 + worktree + 单写者） | 运行时编排 | 固化成 spark-cli 子命令 |
| plugin mode（iframe registry） | UI 组装层 | 加 cmdk + chat 入口 |
| innate-wip (Next.js) | 视图层 | 从读 JSON 改为读 SQLite/查询 API |
| spark-cli / innate-aiswitcher | 模型层 + 自动化层 | aiswitcher 加 token 计量与预算闸 |

### 5.4 路线图

1. **Phase 1 — workspace-mcp**：把 tasks/projects/notes/registry 封装成一个本地 MCP server（任何 CLI agent 即刻可读写任务库）。这是杠杆最大的一步，直接复用现有文件协议。
2. **Phase 2 — 索引与视图**：SQLite（FTS5 + sqlite-vec）索引层 + innate-wip 改读索引；任务/项目多视图。
3. **Phase 3 — 调度器**：time-block 规则引擎 + 晨间 review 守护进程（AI SDK/Mastra）+ ICS 日历互通。
4. **Phase 4 — 治理**：Seatbelt profile + egress 代理 + 预算上限 + Langfuse 自托管观测。
5. **Phase 5 — Life 域扩展**：按 registry 模式加 finance/health/learning 等 app，各自 MCP 化，经 plugin registry 组装进 UI。

---

## 6. 参考链接（节选）

- 协议: MCP spec 2026-07-28 <https://modelcontextprotocol.io/specification> · A2A joins AAIF <https://aaif.io/blog/a2a-joins-aaif> · MCP Registry <https://registry.modelcontextprotocol.io>
- 沙箱: Claude Code sandboxing <https://code.claude.com/docs/en/sandboxing> · apple/container <https://github.com/apple/container> · sandbox-exec 争议 <https://github.com/apple/containerization/issues/737>
- 治理: OIDF Identity for Agentic AI <https://openid.net/wp-content/uploads/2025/10/Identity-Management-for-Agentic-AI.pdf> · OTel GenAI <https://opentelemetry.io/blog/2026/genai-observability/>
- 框架: LangChain/LangGraph 1.0 <https://www.langchain.com/blog/langchain-langgraph-1dot0> · Mastra <https://mastra.ai/> · AI SDK Agents <https://ai-sdk.dev/docs/agents/overview> · PydanticAI <https://github.com/pydantic/pydantic-ai>
- Client: Loro <https://github.com/loro-dev/loro/releases> · Zero 1.0 <https://zero.rocicorp.dev/docs/release-notes/1.0> · Tauri 2.0 <https://v2.tauri.app/blog/tauri-20/> · tldraw SDK 4.0 许可 <https://tldraw.dev/blog/tldraw-sdk-4-0>
- Planning: Huly selfhost <https://github.com/hcengineering/platform> · claude-task-master <https://github.com/eyaltoledano/claude-task-master> · Linear MCP/AI <https://linear.app/ai> · PARA <https://fortelabs.com/blog/para/> · LangChain planning agents <https://www.langchain.com/blog/planning-agents>
- 实践: Obsidian as AI Agent OS <https://www.evchapman.com/blog/i-turned-obsidian-into-my-ai-personal-agent-os/> · Letta 文件系统记忆基准 <https://www.letta.com/blog/benchmarking-ai-agent-memory/>
