# Task 3 可行性分析报告：Markdown Task 自动提交 GitHub Issue 工具

> **更新说明**：基于 2026-04-04 的最新需求澄清重新评估。

---

## 1. 需求澄清

### 实际场景
1. 用户先写了 Task（markdown 文件），让 AI 执行代码。
2. **AI 执行时产生的大量补充内容没有被写回 task 文件**。
3. **这个 Task 也没有被提交为 GitHub Issue**。
4. 现在希望：把这个 Task 提交到 GitHub Issue，同时**把当时 AI 产生的补充内容也找回来**，一并写入 Issue。

### 关键问题
**"当时 AI 产生的内容" 要从哪里找回？**

这**不是**"从历史 Issue 拉取记录"（原理解有误），而是"AI 执行过程中的中间产物已经丢失了，如何找回"。

---

## 2. 核心结论

### 2.1 直接找回"当时 AI 产生的补充内容" —— ⚠️ 基本不可行

| 可能的数据源 | 可行性 | 说明 |
|-------------|--------|------|
| **当前 AI 会话上下文** | 仅部分可行 | 如果这个 Task 是在**当前会话**中刚刚执行的，且上下文没有被截断，AI 可能还记得。一旦会话结束或上下文过长被截断，内容就彻底丢失。 |
| **项目内日志/记录文件** | ❌ 不可行 | 检查了 `.trae/` 目录和项目结构，**没有发现任何自动保存的 AI 对话历史或执行日志**。 |
| **IDE/编辑器本地数据库** | ⚠️ 理论上可能，实践中不可行 | Trae/Cursor 等工具可能在本地保存了 chat history，但这些数据格式不公开、路径不统一、跨平台差异大，无法通过一个通用 CLI 工具稳定读取。 |
| **Git 历史记录** | ✅ 最可行，但有边界 | 可以通过 `git log` 找到 Task 执行期间的 commits，从 **commit messages + code diffs** 中**反推** AI 做了什么。但这本质上是"重构"而非"找回"原始内容。 |

**总结**：除非该 Task 是在当前会话中刚处理的，否则"当时 AI 产生的补充内容"在技术上**无法直接找回**。这不是工具设计问题，而是**数据从未被持久化**的问题。

---

### 2.2 可行的替代方案

#### 方案 A：基于 Git History 反推 + LLM 重构（最现实）

**原理**：
AI 执行代码时必然会留下 git commits。即使 commit message 很简略，代码 diff 本身包含了大量信息。我们可以把这些变更喂给 LLM，让它基于"原始 Task + 代码变更"反推并还原出 AI 的补充说明。

**流程**：
```
读取 Task 内容
    ↓
通过时间/文件关联定位相关 git commits
    ↓
提取 commit messages + file diffs
    ↓
Prompt LLM: "根据以下需求和代码变更，还原当时AI执行这个Task时做了哪些补充工作"
    ↓
生成增强版 Issue Body
    ↓
提交到 GitHub
```

**优点**：
- 不依赖外部系统，纯本地 git 数据即可
- 有一定准确性，尤其对代码改动大的 Task

**缺点**：
- 如果 Task 还没被执行过（无 git 记录），则无法补充
- 如果 commit message 写得很简略，LLM 只能"合理推测"，而非 100% 还原
- 对于纯文档/分析类 Task（没有代码变更），效果很差

#### 方案 B：当前会话直接补充（仅限当前会话）

**原理**：
如果这个 Task 是在**当前 AI 会话**中处理的，可以直接询问 AI（我）这个 Task 的执行细节，然后把 AI 的回答合并到 Issue body 中。

**优点**：
- 100% 准确，因为 AI 还记得

**缺点**：
- 仅适用于当前会话，会话结束后完全失效
- 无法自动化为通用工具

#### 方案 C：从根本上解决 —— 建立"Task 执行即记录"的工作流（推荐长期采用）

**原理**：
与其做一个"事后找回丢失内容"的工具，不如改造工作流，让 AI 在**执行 Task 的过程中**就把补充内容写回 markdown 文件，并**自动提交为 GitHub Issue**。

**具体做法**：
1. **执行后自动更新 task 文件**：在 AI 完成 Task 后，自动在 task 文件末尾追加一个 `### AI 执行补充` 区块，记录关键决策和补充内容。
2. **执行后自动提交 Issue**：在 AI 完成 Task 后，调用 GitHub API 自动创建对应的 Issue，body 包含原始 task + AI 补充内容。
3. **Daemon/CLI 工具统一收口**：在 `packages/task-watcher` 中提供一个命令，如 `innate task:complete <file>`，由 AI 调用或在本地手动触发。

**优点**：
- 从根本上消灭"内容丢失"问题
- 与 Task 2（daemon 进程）可以共用一套基础设施

**缺点**：
- 需要改变现有工作习惯
- 对已经丢失内容的旧 Task 无法补救

---

## 3. 修正后的技术方案

### 3.1 推荐实现路径

考虑到"找回已丢失的 AI 内容"技术不可行，建议分两层实现：

1. **短期工具（补救已有 Task）**：
   实现一个 CLI 工具，提供两种模式：
   - **模式 1 - Git 反推**：通过 `git log --grep="Task N"` 或分析相关文件变更，调用 LLM 重构补充内容。
   - **模式 2 - 当前会话补充**：直接让当前 AI 总结这个 Task 的执行过程（如果当前会话处理过）。

2. **长期工作流（防止未来丢失）**：
   在执行每个 Task 后，强制要求 AI 把执行摘要写回 task 文件，并调用 CLI 提交 Issue。

### 3.2 CLI 工具设计

```bash
# 基础用法：直接提交 markdown 中的 Task 为 GitHub Issue
node scripts/submit-tasks-to-issues.js docs/tasks/workflow.md

# 增强模式 1：基于 git history 反推补充内容
GITHUB_TOKEN=xxx OPENAI_API_KEY=xxx node scripts/submit-tasks-to-issues.js docs/tasks/workflow.md --enhance-from-git

# 增强模式 2：当前 AI 会话直接补充（交互式）
node scripts/submit-tasks-to-issues.js docs/tasks/workflow.md --enhance-from-session
```

### 3.3 Git 反推的 Prompt 设计

```
你是一位项目文档工程师。以下是一个 Task 的原始需求，以及该 Task 被执行后产生的 git 变更记录。

【原始 Task 内容】
{taskBody}

【相关 Git Commits 及代码变更】
{gitHistory}

请基于原始需求和代码变更，尽可能还原当时执行这个 Task 的 AI 做了哪些主要工作、遇到了什么问题、做了哪些补充决策。输出一份执行摘要，用于作为 GitHub Issue 的补充说明。

输出格式：
### 原始需求
...
### 执行摘要
...
### 关键变更
- ...
```

---

## 4. 修正后的实现计划

### Phase 1: 基础 CLI 工具（可直接实现）
1. 创建 `apps/web/scripts/submit-tasks-to-issues.js`
2. 实现 Markdown Task 解析器（正则拆分 `## Task N`）
3. 实现 GitHub Issue 创建 API 调用
4. 支持 `--dry-run` 模式本地验证

### Phase 2: Git 反推增强（有边界但可用）
1. 实现 git history 关联模块：
   - 通过 `--since` / `--until` 时间范围定位 commits
   - 或通过文件变更关联（分析哪些文件在 Task 执行期间被修改）
2. 集成 LLM API（OpenAI/Anthropic）
3. 设计并调优反推 Prompt
4. 添加交互确认流程

### Phase 3: 工作流改造（长期方案，推荐）
1. 定义"Task 执行后记录规范"：AI 必须在 task 文件末尾追加 `### AI Execution Summary`
2. 将 `submit-tasks-to-issues.js` 封装为 `packages/task-watcher` 的 CLI 命令
3. 在 AI Agent 的 system prompt 或 AGENTS.md 中增加要求："Task 完成后，调用 CLI 提交 Issue"
4. （可选）GitHub Action 监听 task 文件变更，自动触发提交

---

## 5. 最终结论

### 对核心问题的回答

**Q: 能否把当时 AI 产生的内容补充回来，然后一起提交到 GitHub Issue？**

**A: 不能直接找回，但可以通过间接手段近似还原。**

- **如果 Task 是在当前 AI 会话中执行的**：✅ 可以直接补充，100% 准确。
- **如果 Task 已经执行完且会话已结束**：
  - 项目中**没有自动保存的 AI 对话日志**，所以无法直接找回。
  - ✅ 可以基于 **git history（commits + diffs）** 调用 LLM 进行**反推和重构**，效果取决于代码变更的丰富程度和 commit message 的质量。
  - 对于没有代码变更的纯分析/文档类 Task，❌ 基本无法补救。

### 建议

1. **对于旧 Task**：使用 Phase 2 的 Git 反推工具进行**尽力补救**，接受其不完美。
2. **对于新 Task**：立即采用 Phase 3 的工作流改造，要求 AI **执行完即记录、记录完即提交 Issue**，从根本上避免内容再次丢失。
3. **工具本身完全可行**：基础的"解析 markdown 并提交 GitHub Issue"功能可以在 1-2 小时内完成；Git 反推增强功能可以再花 2-3 小时实现。

---

*报告生成时间：2026-04-04*
