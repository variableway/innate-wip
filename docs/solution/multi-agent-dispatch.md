# Multi-Agent Dispatch Protocol（跨 CLI 并行分派）

> Status: design（手工协议，零工具依赖，可立即执行）  
> Companion: [task-docs-workflow.md](./task-docs-workflow.md)（文档阶段）、[multi-agent-context.md](./multi-agent-context.md)（上下文分层）  
> Question: ZCode / Kimi Code / Claude CLI 等异构 AI Agent **各领一个任务同时执行**，如何不冲突？

## 结论（先说答案）

可以做到，核心三件套：

1. **波次调度** —— 无依赖的任务并行，有依赖的放下一层（拓扑分层）
2. **文件所有权分区** —— `context/interaction.md` 的 Shared ownership 表（已有机制）
3. **工作区物理隔离** —— 每任务一个 git worktree + 独立分支

`task/project/` 任务包本身已经是跨 Agent 的"通信协议"（handoff = 简报、context pack = prompt 组装、verify = 验收）——不同 CLI 共享的唯一介质是文件系统。缺的只是隔离与分派纪律，见 §3 手工协议；规模化后的工具选型见 §4。

## 1. 三类冲突与解法

| 冲突类型 | 场景 | 解法 |
|---------|------|------|
| **工作区冲突** | 多个 CLI 在同一目录，互踩 working tree / index / node_modules / .next | git worktrees——每任务一个 worktree + 独立分支，物理隔离 |
| **文件冲突** | 两个 Agent 改同一文件 | 所有权分区：ownership 表 Owner 唯一；共享文件单写者（见 §3 Step 2） |
| **语义冲突** | 各自都绿但接口漂移 | Contracts（interaction.md）+ 波次闸门：每波合并后跑集成验证再开下一波 |

关键认知：**worktree 隔离之后"实时共享黑板"失效**——各 Agent 只见自己 worktree 的文件副本，`interaction.md` 的 In-progress 表互相不可见。因此协调不靠实时黑板，靠**合并时纪律**：Agent 只写自己领地，状态汇报走 git commit，共享文件（README / verify.md / interaction.md）唯一写者是合并者。

## 2. 波次调度（"无依赖才并行，有依赖放第二层"）

对任务 DAG 做拓扑分层（Kahn 算法人工版）：每层任务的依赖均在前序层完成，层内全并行；一层全部合并且集成验证通过后，才派发下一层。

规则：

1. **文件互斥也是边**。只看 `Depends` 字段会漏掉同文件双写：文件冲突的任务要么放不同波次，要么同波次且 ownership 不重叠（包内由 ownership 表保证，跨包人工核对——如 plugin-mode T01 与 refine T01 同改 `site-features.ts` + `registry.ts`）。
2. **软依赖不升级成硬依赖**。判断标准：去掉这个顺序，任务能否独立验收通过（例：refine T02"收尾建议在 T01 之后"是偏好——断言分级设计让脚本先后皆绿——故留 Wave 1）。
3. 分层结果固化在任务包内（如 `task/project/refine/waves.md`），分派时照单执行。

refine 包实例：

```
Wave 1（并行）: T01 修死flag ∥ T02 verify-plugins 脚本 ∥ T03 文档(docs-only)
Wave 2（串行）: T04 验收收尾（depends T01–T03；单任务，无需 worktree）
互斥提醒      : plugin-mode T01 与 refine T01 同文件，不可同波
```

## 3. 手工协议（今天就能跑）

### Step 0 — 为 Wave 内每个任务建 worktree（人工执行一次）

```bash
cd innate-wip
git worktree add ../innate-refine-t01 -b refine/t01-fix-dead-flags
git worktree add ../innate-refine-t02 -b refine/t02-verify-plugins
git worktree add ../innate-refine-t03 -b refine/t03-blog-docs

# 每个 worktree 独立初始化（本仓库特有：symlink 共享包；pnpm store 共享，成本可控）
cd ../innate-refine-t01 && pnpm link:packages && pnpm install   # 其余同理
```

### Step 1 — 给每个 CLI 粘贴同一份任务简报

仓库级规则交给各 CLI 的 bootstrap 文件（ZCode→`AGENTS.md`，Claude→`CLAUDE.md`），任务级分派用统一模板（即 `multi-agent-context.md` 的 Prompt Pack Assembly 直接消费 handoff + Context pack）：

```text
你负责执行仓库中 task/project/refine 包的 T01 任务，工作目录已经是为此任务
准备的独立 git worktree（分支 refine/t01）。

按顺序读（都在 task/project/refine/ 下）：
1. handoff.md（整体简报与禁止事项）
2. context/system.md、context/requirement.md
3. context/interaction.md（你的任务涉及共享文件，必读）
4. tasks/T01-fix-dead-feature-flags.md（你的任务定义）

规则：
- 只修改 interaction.md「Shared ownership」表中 Owner = T01 的路径
- 不改 README.md / verify.md / context/* —— 由合并者统一维护
- 完成后在任务文件中把 Status 改为 done、勾选任务内 Verify 项
- commit message 前缀 "refine T01:"，最后输出一段变更摘要
```

### Step 2 — 执行期规则（单写者原则）

- 一任务 = 一 Agent = 一分支 = 一 worktree
- Agent 只写 ownership 内文件 + 自己的任务文件（Status / Verify 勾选）
- README / verify.md / interaction.md 自始至终只有合并者写
- 不 push main；交付分支

### Step 3 — 合并与越界检查

```bash
git diff main...refine/t01-fix-dead-flags --name-only
# 逐行核对：所有文件都在 T01 ownership 内？README/verify/context 是否被误改？

git merge refine/t01-fix-dead-flags   # 分区不重叠 → 顺序任意，无冲突
```

### Step 4 — 波次闸门

Wave 全部合并后跑集成验证（`pnpm --filter @innate/web build:static` + verify-plugins），通过后才派发下一波。语义级集成问题（文件不重叠也防不住的那种）在这里拦截。

### 进阶 — 原子锁认领（异步免调度）

不想人工指派时，用 POSIX `mkdir` 的原子性实现先到先得：

```bash
mkdir /absolute/path/to/innate-wip/task/locks/T01.zcode.lock   # 成功者获得任务
# 已存在则报错，Agent 换下一个无依赖任务
```

锁目录必须放所有 worktree 共享的绝对路径（主仓库），或改用 GitHub Issues assignee 做认领面。这是 Backlog.md `claimed-by` 机制的手工等价物。

## 4. 开源方案对照（2026-08 快照）

| 工具 | 形态 | 解决什么 | 与本仓库结构适配成本 |
|------|------|---------|---------------------|
| [claude-squad](https://github.com/smtg-ai/claude-squad) | Go TUI（tmux 风格） | 管理多个终端 Agent（Claude Code / Codex / OpenCode / Gemini / Aider / Amp），各自 worktree + feature branch 并行 | **最低**：只接管隔离与会话层，不碰任务语义；任务分派仍靠人读 `task/` 包 |
| [vibe-kanban](https://github.com/BloopAI/vibe-kanban) | 自托管 kanban（Rust + TS/React），[vibekanban.com](https://www.vibekanban.com) | 任务卡片 + worktree 隔离 + spawn/监管 agent 会话 + 浏览器预览；SaaS 已停售，转为纯开源维护 | 中：任务卡片是另一套格式，`task/project/` 内容需搬运；有[与 Backlog.md 集成的讨论](https://github.com/BloopAI/vibe-kanban/issues/319) |
| [Backlog.md](https://backlog.md) | markdown 任务 + kanban UI | `claimed-by` 认领、依赖、状态机，任何 CLI 都能读 markdown | 中：与 docs-driven 最同构，但任务格式与 `task/project/` 不同构；可只借鉴 `claimed-by` 字段 |
| [tasks.md](https://github.com/tasksmd/tasks.md) / [kanban-md](https://github.com/antopolskiy/kanban-md) / [karr](https://github.com/Getty/karr) | 轻量规范/CLI | markdown 任务规范（claimed-by-another-agent、blocked 等约定） | 低-中：可作 `task/` 包的字段扩展参考 |
| [GitHub Spec Kit](https://github.com/spec-kit) | spec/plan/tasks 脚手架 | 规范流程与并行任务选择 | 高：结构相近但不含隔离与编排，且是另一套流程 |
| 单 CLI 子代理（Claude Agent Teams 等） | 进程内并行 | 同一 CLI 内多任务 | ❌ 不满足"异构 CLI"前提 |
| Conductor / AgentFarm 等 Mac 应用 | GUI | 并行会话管理 | ❌ 闭源或平台限定，与"文档即事实源"冲突 |

### 选型建议（两步走）

1. **现在用手工协议**：全部成本 = 三条 shell 命令 + 一份可复用 prompt 模板 + 合并时越界检查；与 `task-docs-workflow.md` 完全同构，`task/` markdown 是唯一事实源，无中间层翻译。
2. **超过 3–4 个并行 Agent / 需要 GUI 时上工具**：首选 claude-squad（最轻、CLI 原生、只接管隔离层）；要可视化看板选 vibe-kanban；只想要认领机制时，把 `claimed-by` 字段加进任务文件（借鉴 Backlog.md）比重度引入更划算。

**共同代价警告**：任何工具的"任务"与 `task/` 包的"任务"是两套表示，双轨维护本身就是新的冲突源。手工协议没有这个问题。

## 5. 与本仓库工作流的关系

| 已有机制 | 在分派协议中的角色 |
|---------|------------------|
| `handoff.md` | Agent 简报（Read-first 顺序 = prompt 组装顺序） |
| `context/interaction.md` | 所有权契约 + 跨包互斥规则 + 冲突协议 |
| `verify.md` | 波次闸门的验收清单 |
| `waves.md`（任务包内新增） | 波次固化，分派照单执行 |
| `task/tracing/` | 执行记录留痕 |
| `packages/task-watcher` | ❌ 不适用——它是数据同步守护进程（fetch issues → JSON → push），不是任务分派工具 |

## Acceptance for This Doc

- [x] 三类冲突与解法明确
- [x] 波次调度规则（含文件互斥边、软依赖判断标准）
- [x] 手工协议可直接执行（worktree / 简报 / 单写者 / 越界检查 / 闸门）
- [x] 开源方案对照与两步走选型建议
- [ ] 首次实际分派 refine Wave 1 后回填经验（预定于 `task/project/refine/waves.md`）

## References

- [9 Open-Source Agent Orchestrators（Augment Code）](https://www.augmentcode.com/tools/open-source-agent-orchestrators)
- [awesome-agent-orchestrators](https://github.com/andyrewlee/awesome-agent-orchestrators)
- [The Code Agent Orchestra（Addy Osmani）](https://addyosmani.com/blog/code-agent-orchestra/)
- [Parallel AI Agents with Git Worktrees](https://medium.com/@mabd.dev/git-worktrees-the-secret-weapon-for-running-multiple-ai-coding-agents-in-parallel-e9046451eb96)
- [Vibe Kanban 的 worktree 架构分析](https://starlog.is/articles/developer-tools/bloopai-vibe-kanban/)
