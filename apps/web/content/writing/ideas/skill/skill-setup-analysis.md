# Superpowers Skills 分析报告

## 一、项目概况

| 项 | 说明 |
|----|------|
| 项目名 | Superpowers (v5.0.6) |
| 作者 | Jesse Vincent / Prime Radiant |
| 定位 | Claude Code / Cursor / Codex / Gemini 的完整软件开发工作流技能库 |
| 安装位置 | `/Users/patrick/workspace/variableway/innate/fire-skills/superpowers/` |
| 技能总数 | 14 个 |
| 运行平台 | Claude Code, Cursor, Codex, OpenCode, Gemini CLI |

### 核心工作流

```
用户提出需求
    │
    ▼
┌─────────────┐
│ brainstorming│  → 讨论需求，产出设计文档
└──────┬──────┘
       │ 设计文档完成
       ▼
┌──────────────────┐
│ using-git-worktree│  → 创建隔离工作空间
└──────┬───────────┘
       │
       ▼
┌──────────────┐
│ writing-plans │  → 拆解为 2-5 分钟的小任务
└──────┬───────┘
       │
       ├──▶ subagent-driven-development（推荐，有双重审查）
       │         或
       └──▶ executing-plans（备用，无 subagent 时使用）
                     │
                     ▼
           ┌──────────────────────────┐
           │ finishing-a-development- │  → 合并/PR/清理
           │ branch                   │
           └──────────────────────────┘

贯穿全程：test-driven-development / systematic-debugging / verification-before-completion
```

---

## 二、14 个技能逐一分析

### 核心流程技能（7 个）

#### 1. brainstorming — 头脑风暴与设计

| 项 | 说明 |
|----|------|
| 触发 | 任何创造性工作之前（功能、组件、行为修改） |
| 产出 | `docs/superpowers/specs/YYYY-MM-DD-<topic>-design.md` |
| 步骤 | 探索上下文 → 提问澄清 → 2-3 方案对比 → 分段展示设计 → 写文档 → 自审 → 用户审核 |
| 强制规则 | **禁止跳过**——"太简单不需要设计"是已知的反模式 |

**评价：** 设计最完善的技能之一。9 步流程虽然看起来重，但每步都有明确目的。分段展示设计让用户可以逐段审核而不是一次性面对大段文字。

**改进建议：**
- 缺少"快速通道"——对于真正 5 分钟能搞定的改动，9 步流程太重。建议增加"trivial change"判定条件和简化流程。
- 可视化伴侣（visual companion）功能意图好，但实际触发条件模糊。

---

#### 2. writing-plans — 编写实施计划

| 项 | 说明 |
|----|------|
| 触发 | 有设计文档/需求后，写代码之前 |
| 产出 | `docs/superpowers/plans/YYYY-MM-DD-<feature-name>.md` |
| 步骤 | 范围检查 → 文件结构 → 写 2-5 分钟粒度任务 → 自审 → 保存 → 选择执行方式 |
| 强制规则 | 禁止占位符，每个步骤必须是完整可执行的操作 |

**评价：** "假设执行者是一个没有判断力的热情初级工程师"这个设计原则很有意思——迫使计划足够详细，避免歧义。

**改进建议：**
- 缺少依赖关系标注——任务之间的依赖应该显式声明，方便并行化。
- 没有风险评估环节——哪些任务可能出问题、需要备选方案。

---

#### 3. subagent-driven-development — 子代理驱动开发

| 项 | 说明 |
|----|------|
| 触发 | 执行实施计划时（推荐方式） |
| 核心 | 每个任务分派一个新 subagent，三重审查：实现者 → 规格审查 → 代码质量审查 |
| 步骤 | 分派实现者 → 规格合规审查 → 代码质量审查 → 标记完成 → 最终审查 |

**评价：** 这是整个系统中最精密的技能。三重审查（实现 + 规格合规 + 代码质量）提供了强质量门控。

**改进建议：**
- **成本无感知**——每个任务 3 个 subagent + 可能的重审循环，token 消耗可观。缺少预算/超时机制。
- **禁止并行实现**——"Never dispatch multiple implementation subagents in parallel" 避免了冲突但牺牲了吞吐量。对于独立任务应该允许并行。
- 缺少中间回滚策略——subagent 失败时的处理流程不够清晰。

---

#### 4. executing-plans — 执行计划（备用方案）

| 项 | 说明 |
|----|------|
| 触发 | 平台不支持 subagent 时的替代方案 |
| 核心 | 按步骤执行 + 人工检查点 |
| 对比 | 比 subagent-driven-development 简单但**缺少任务间审查** |

**评价：** 功能定位清晰——为不支持 subagent 的平台提供降级方案。

**改进建议：**
- **最大的问题：缺少任务间代码审查。** subagent-driven-development 有三重审查，这个什么都没有。这是显著的质量差距。
- "检查点"定义模糊——什么时候暂停让用户审查不明确。
- 文档中说"在单独的 session 中"但又说"在当前 session 执行"，自相矛盾。

---

#### 5. using-git-worktrees — Git 工作树管理

| 项 | 说明 |
|----|------|
| 触发 | 开始特性开发前，需要隔离环境时 |
| 步骤 | 检查目录 → 检查 .gitignore → 创建 worktree → 项目初始化 → 验证测试基线 |

**评价：** 安全检查做得好（确保 worktree 目录被 gitignore），自动检测项目类型并运行初始化。

**改进建议：**
- 缺少 monorepo 场景处理——多包管理器的情况可能检测失败。
- 基线测试失败时只有"问用户是否继续"，缺少更智能的处理。

---

#### 6. requesting-code-review — 请求代码审查

| 项 | 说明 |
|----|------|
| 触发 | 完成任务、实现功能、合并前 |
| 核心 | 分派 code-reviewer subagent，使用全新上下文审查 |

**评价：** 用全新 subagent 审查（不继承 session 历史）是好设计，避免确认偏差。

**改进建议：**
- 路径不一致——引用 `requesting-code-review/code-reviewer.md` 但实际模板在 `agents/code-reviewer.md`，可能导致查找失败。
- 缺少审查争议解决机制——当审查者和实现者意见不同且都无法明确判断对错时怎么办。

---

#### 7. finishing-a-development-branch — 完成分支开发

| 项 | 说明 |
|----|------|
| 触发 | 所有任务完成，测试通过后 |
| 选项 | 1. 本地合并 2. 创建 PR 3. 保留分支 4. 丢弃 |

**评价：** 4 个选项结构清晰，覆盖了主要场景。

**改进建议：**
- **文档内部矛盾：** 选项 2（PR）的快速参考表说"Keep Worktree"但详细步骤说"Cleanup Worktree (Step 5)"。需要统一。
- 缺少合并冲突处理流程。
- 丢弃选项需要输入"discard"但未说明大小写敏感。

---

### 交叉技能（3 个）

#### 8. test-driven-development — 测试驱动开发

| 项 | 说明 |
|----|------|
| 触发 | 任何功能/修复实现之前 |
| 核心 | 严格的 RED → GREEN → REFACTOR 循环 |
| 强制规则 | 先写测试就写代码 = 删掉重来 |

**评价：** 系统中最教条的技能。"删掉重来"规则没有例外（除非人类明确许可）。11 条反合理化表格直接点名了常见的偷懒借口。

**改进建议：**
- 缺少集成测试 vs 单元测试的指导——TDD 循环中何时写哪种测试。
- 缺少测试金字塔考量——全写单元测试 or 全写集成测试都不好。
- 对于已有代码库添加测试（不是新功能）的场景覆盖不足。

---

#### 9. systematic-debugging — 系统化调试

| 项 | 说明 |
|----|------|
| 触发 | 任何 bug、测试失败、意外行为 |
| 四阶段 | 根因调查 → 模式分析 → 假设验证 → 实现 |
| 强制规则 | 3 次修复失败 = 质疑架构本身 |

**评价：** 设计非常扎实。"3 次失败就升级"是一个出色的规则——防止在错误方向上持续投入。

**改进建议：**
- 附属文档（root-cause-tracing.md, defense-in-depth.md, condition-based-waiting.md）质量未知，需要单独审查。
- 缺少性能问题的调试流程——当前流程偏功能性 bug。

---

#### 10. verification-before-completion — 完成前验证

| 项 | 说明 |
|----|------|
| 触发 | 声称工作完成、修复了、通过测试之前 |
| 五步门控 | 识别验证命令 → 运行 → 读输出 → 确认匹配 → 才能声称完成 |

**评价：** "没有新鲜验证证据就不许声称完成"的铁律来自 24 个真实失败案例。这是防"AI 过度乐观"的最后一道防线。

**改进建议：**
- 逻辑简单但不可妥协，设计已经足够好。
- 可以增加一个"验证检查清单"模板，方便不同项目自定义验证项。

---

### 辅助技能（4 个）

#### 11. using-superpowers — 元技能（技能发现）

| 项 | 说明 |
|----|------|
| 触发 | 每次会话启动时自动加载 |
| 核心 | 在任何响应前检查是否有适用的技能，有 1% 可能就调用 |

**评价：** 这是整个系统的入口点。通过 session-start hook 注入。

**改进建议：**
- "1% 可能就调用"可能导致过度触发——简单问题也走技能流程，增加延迟。
- 对 subagent 有正确的隔离（`<SUBAGENT-STOP>` 块防止递归调用）。

---

#### 12. dispatching-parallel-agents — 并行分派代理

| 项 | 说明 |
|----|------|
| 触发 | 有 2+ 个独立任务可以并行执行时 |

**评价：** **这是整个系统中连接性最弱的技能。** 没有被其他任何技能引用，没有与其他技能的集成说明。

**改进建议：**
- 需要与 subagent-driven-development 建立明确的协作关系。
- 缺少并行数量上限——可能导致资源耗尽。
- 冲突检测只靠"跑全量测试"，可能漏掉逻辑冲突。

---

#### 13. receiving-code-review — 接收代码审查

| 项 | 说明 |
|----|------|
| 触发 | 收到代码审查反馈时 |
| 核心 | 读 → 理解 → 验证 → 评估 → 回应（技术确认或合理反驳） → 实现 |

**评价：** "禁止表演性赞同"和"允许合理反驳"是亮点——鼓励真正理解而非盲目服从。

**改进建议：**
- "Strange things are afoot at the Circle K"这个逃生口太隐晦，用户可能不理解。
- 区分"信任的人类搭档"和"外部审查者"的处理是好设计。

---

#### 14. writing-skills — 编写新技能

| 项 | 说明 |
|----|------|
| 触发 | 创建或修改技能时 |
| 核心 | 把 TDD 应用到流程文档上——先测试失败，再写技能 |

**评价：** **整个系统中最有洞察力的设计。** 特别是 CSO（Claude Search Optimization）发现——"描述不应该总结工作流，因为 Claude 会直接跟描述走而不读完整技能"。这是通过真实测试得出的关键发现。

**改进建议：**
- token 预算目标（getting-started <150 词，常用 <200 词）很好，但缺少实际测量工具。
- 测试方法论虽然完善但成本高（每个技能迭代需要多次 subagent 调用）。

---

## 三、系统级问题

### 3.1 发现的 Bug 和矛盾

| # | 问题 | 严重度 | 位置 |
|---|------|--------|------|
| 1 | **finishing-a-development-branch 文档矛盾** — 选项 2 快速参考表说"Keep Worktree"但详细步骤说"Cleanup Worktree" | 高 | `skills/finishing-a-development-branch/SKILL.md` |
| 2 | **requesting-code-review 路径错误** — 引用 `requesting-code-review/code-reviewer.md` 但实际文件在 `agents/code-reviewer.md` | 高 | `skills/requesting-code-review/SKILL.md` |
| 3 | **executing-plans 自相矛盾** — 描述说"在单独 session"但内容说"在当前 session" | 中 | `skills/executing-plans/SKILL.md` |
| 4 | **executing-plans 缺少审查** — 相比 subagent-driven-development 的三重审查，这个完全没有任务间质量门控 | 高 | `skills/executing-plans/SKILL.md` |

### 3.2 架构级问题

| # | 问题 | 影响 |
|---|------|------|
| 1 | **dispatching-parallel-agents 是孤岛** — 不被任何技能引用，与其他技能没有集成 | 用户难以发现和使用 |
| 2 | **subagent-driven-development 成本无感知** — 每任务 3 subagent + 重审，无预算/超时 | 可能产生高额 token 费用 |
| 3 | **缺少快速通道** — brainstorming 的 9 步流程对小改动太重 | 用户可能直接跳过技能 |
| 4 | **commands 已废弃但未删除** — brainstorm.md, execute-plan.md, write-plan.md 已废弃 | 混淆用户 |
| 5 | **测试技能缺少层次指导** — TDD 不区分单元/集成/端到端 | 可能导致测试策略失衡 |

---

## 四、测试验证计划

### 4.1 安装验证

| 步骤 | 操作 | 预期结果 | 优先级 |
|------|------|---------|--------|
| T1 | 在 Claude Code 中安装 superpowers 插件 | 安装成功，无报错 | P0 |
| T2 | 启动新 session，检查 session-start hook 是否执行 | 控制台显示 superpowers 加载信息 | P0 |
| T3 | 验证 `using-superpowers` 元技能是否自动注入 | 新对话中 agent 主动检查技能适用性 | P0 |

### 4.2 核心流程测试

| 测试 | 场景 | 验证点 | 优先级 |
|------|------|--------|--------|
| T4 | **brainstorming 触发** — 说"我想加一个新功能" | Agent 自动启动 brainstorming 流程，不直接写代码 | P0 |
| T5 | **brainstorming 快速路径** — 说"改一下按钮颜色" | Agent 能判断这是小改动，不强制走完整 9 步 | P1 |
| T6 | **writing-plans 输出** — brainstorming 完成后 | 自动生成计划文件到 `docs/superpowers/plans/` | P0 |
| T7 | **plan 粒度** — 检查生成的计划 | 每个任务 2-5 分钟，有明确的文件路径和代码 | P1 |
| T8 | **TDD 执行** — 在实现任务中 | Agent 先写失败测试，验证失败，再写实现，验证通过 | P0 |
| T9 | **subagent 分派** — 执行计划时 | 看到独立 subagent 被创建和执行 | P0 |
| T10 | **代码审查触发** — 任务完成后 | 自动触发 spec review 和 code quality review | P0 |
| T11 | **verification-before-completion** — 任务声称完成时 | Agent 先运行测试确认，才声称完成 | P0 |
| T12 | **branch 完成** — 所有任务完成 | Agent 提出 4 个选项（合并/PR/保留/丢弃） | P1 |

### 4.3 调试流程测试

| 测试 | 场景 | 验证点 | 优先级 |
|------|------|--------|--------|
| T13 | **debugging 触发** — 引入一个 bug 后报告 | Agent 启动四阶段调试流程，不直接猜测修复 | P0 |
| T14 | **3 次失败升级** — 制造一个需要架构思考的问题 | 3 次修复失败后 Agent 建议质疑架构 | P1 |
| T15 | **并行调试** — 报告多个不相关的 bug | Agent 考虑分派并行 subagent | P2 |

### 4.4 Bug 验证测试

| 测试 | 验证的 Bug | 方法 | 优先级 |
|------|-----------|------|--------|
| T16 | finishing-a-development-branch 文档矛盾 | 触发分支完成流程，观察 Agent 对 PR 选项的 worktree 处理 | P1 |
| T17 | requesting-code-review 路径错误 | 触发代码审查，检查是否能找到 reviewer 模板 | P0 |
| T18 | executing-plans 自相矛盾 | 在无 subagent 的平台测试，观察 session 行为 | P2 |

---

## 五、改进建议与实施任务

### 阶段 1：安装验证（1 天）

```
Task 1.1  在 Claude Code 中安装 superpowers 插件
Task 1.2  启动新 session，确认 session-start hook 加载
Task 1.3  简单对话测试，确认 using-superpowers 元技能生效
```

### 阶段 2：核心流程冒烟测试（2-3 天）

```
Task 2.1  测试 brainstorming 完整流程（T4）
          → 创建一个真实的小功能需求，验证从头到尾的流程
Task 2.2  测试 writing-plans 输出质量（T6, T7）
          → 检查计划文件格式、粒度、可执行性
Task 2.3  测试 subagent-driven-development（T8, T9, T10）
          → 执行一个计划，观察 subagent 分派和双重审查
Task 2.4  测试 verification-before-completion（T11）
          → 故意让测试失败，看 Agent 是否诚实报告
Task 2.5  测试 finishing-a-development-branch（T12）
          → 完成后验证 4 选项流程
```

### 阶段 3：Bug 修复（1-2 天）

```
Task 3.1  修复 finishing-a-development-branch 文档矛盾
          → 统一 Option 2 的 worktree 处理描述
Task 3.2  修复 requesting-code-review 路径引用
          → 确认实际路径并修正 SKILL.md 中的引用
Task 3.3  修复 executing-plans 自相矛盾
          → 统一"单独 session"vs"当前 session"的描述
Task 3.4  增强 executing-plans 的任务间审查
          → 添加至少一个轻量级自审步骤
```

### 阶段 4：功能增强（可选，1-2 周）

```
Task 4.1  为 brainstorming 添加"快速通道"
          → 定义 trivial change 判定条件
          → trivial change 跳过完整流程，走简化版
Task 4.2  为 subagent-driven-development 添加成本感知
          → 记录每个 subagent 的 token 使用量
          → 添加总预算上限和超时机制
Task 4.3  整合 dispatching-parallel-agents 到主流程
          → 在 using-superpowers 中添加引用
          → 与 subagent-driven-development 建立协作关系
Task 4.4  为 test-driven-development 添加测试层次指导
          → 何时写单元测试、集成测试、端到端测试
Task 4.5  清理已废弃的 commands 目录
          → 删除或归档 deprecated 文件
Task 4.6  为 writing-plans 添加依赖关系标注
          → 任务之间可以标记依赖，支持可视化执行顺序
```

### 阶段 5：自定义技能开发（可选）

```
Task 5.1  使用 writing-skills 技能创建项目专属技能
          → 基于 brainstorming/小红书分析等已有工作创建技能
Task 5.2  测试新技能的 TDD 流程
          → 按 writing-skills 的 RED-GREEN-REFACTOR 方法论测试
Task 5.3  部署到本地 skills 目录
```

---

## 六、总评

### 优势

1. **设计理念先进** — 把软件工程最佳实践（TDD、Code Review、Debugging）编码为 AI Agent 的强制流程，而非建议
2. **反合理化文化** — 每个纪律技能都有明确的"借口 vs 事实"对照表，防止 Agent 偷懒
3. **三重审查机制** — subagent-driven-development 的实现者 → 规格审查 → 代码质量审查是真正的质量门控
4. **CSO 洞察** — "描述不等于工作流"的发现体现了真实的测试驱动设计
5. **跨平台支持** — Claude Code、Cursor、Codex、Gemini、OpenCode 都有接入方案

### 不足

1. **对小任务太重** — 没有快速通道，小改动也要走完整流程
2. **成本不可控** — 三重审查的 token 消耗没有预算机制
3. **技能间连接不完整** — dispatching-parallel-agents 是孤岛
4. **部分文档矛盾** — 3 处需要修复的文档问题
5. **缺少回滚策略** — 实现中途出错的恢复流程不清晰

### 最终判断

**Superpowers 是目前最成熟的 AI Agent 开发工作流系统之一。** 它的核心价值不在于个别技能，而在于把整个软件开发生命周期（设计→计划→实现→审查→验证→完成）编码为 AI 必须遵循的流程。

对于想要"认真用 AI 做开发"的团队，这是一个值得投入时间验证和定制的系统。建议先完成阶段 1-3（安装+测试+修 Bug），再根据实际体验决定是否投入阶段 4-5。
