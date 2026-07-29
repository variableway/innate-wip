# Multi-Agent Shared Context Solution

> Status: design  
> Companion: [task-docs-workflow.md](./task-docs-workflow.md)

## Goal

一个需求拆成多个任务后，多个 AI Agent（或 Sub Agent）能共享同一套上下文，又不过度互读，避免：

- 每个 Agent 只靠聊天摘要，上下文漂移  
- 所有 Agent 塞进同一超长 prompt，互相干扰  
- 系统约定与需求细节混在一起，难以复用

## Three Context Layers

每个 `task/project/<slug>/context/` 下固定三层：

| Layer | File | Scope | Who reads | Changes often? |
|-------|------|-------|-----------|----------------|
| **System** | `system.md` | 仓库 / 产品级：技术栈、目录、约束、DO/DON'T | 所有 Agent | 很少 |
| **Requirement** | `requirement.md` | 本需求：目标、范围、关键 Spec 摘要、REQ 列表指针 | 本需求下所有任务 Agent | 需求生命周期内稳定 |
| **Interaction** | `interaction.md` | 与其它模块/任务的交界：接口、共享文件、冲突规则、依赖图 | 仅涉及交界的任务 | 随并行任务更新 |

```
┌─────────────────────────────────────────┐
│  system.md     (repo / product)         │  ← all agents
├─────────────────────────────────────────┤
│  requirement.md (this epic / feature)   │  ← all agents on this req
├─────────────────────────────────────────┤
│  interaction.md (cross-task surfaces)   │  ← agents that touch shared edges
└─────────────────────────────────────────┘
         ▲                ▲
         │                │
    Task T01.md      Task T02.md   ← per-task goal / steps only
```

## What Goes Where

### `system.md` (example sections)

- Project one-liner + Content-first product stance  
- Monorepo layout (`apps/web`, packages)  
- Build/static-export constraints  
- UI library rules (`@innate/ui`, no `asChild`)  
- Commit / secrets policy pointers  
- Link to AGENTS.md / CLAUDE.md（勿全文复制，只链关键节）

### `requirement.md`

- Mission + outcomes (from content.md, condensed)  
- In / out of scope  
- Pointers: `../spec.md`, `../requirements.md`  
- Non-negotiables for this feature  
- Definition of done (high level)

### `interaction.md`

- Dependency graph between tasks  
- Shared files (who may edit what)  
- Contract surfaces (types, nav registry, APIs)  
- Conflict protocol (e.g. “T02 waits for T01 to land `site-features.ts`”)  
- Sub-agent spawn hints

```markdown
## Task graph
T01 (nav hide) → T02 (home) → T03 (docs)
T03 can parallel T01/T02 if docs-only

## Shared ownership
| Path | Owner task | Others |
|------|------------|--------|
| lib/site-features.ts | T01 | read-only for others |
| docs/solution/* | T03 | append-only |

## Sub-agents
- explore: codebase discovery only, no writes
- shell: build/lint when verify.md requires
```

## Task File Binding

每个任务声明自己要加载的层：

```markdown
## Context pack
- system: yes
- requirement: yes
- interaction: yes   # or no if isolated
- extra: []          # optional paths
```

**规则：**

1. 默认：`system` + `requirement`  
2. 若 `Depends` 非空或改动 shared ownership 表中的路径 → 必须读 `interaction`  
3. Sub Agent 只继承父任务声明的 Context pack，不自动扩大范围

## Multi-Agent Execution Patterns

### Pattern A — Sequential main agent

One agent runs T01 → T02 → T03，全程同一 Context pack；每任务结束后更新 `interaction.md` 的「已落地」小节。

### Pattern B — Parallel peers

```
Main Agent
  ├─ SubAgent A: T01 (context: system+requirement+interaction)
  ├─ SubAgent B: T03 docs (context: system+requirement; interaction: no)
  └─ Join: verify.md + merge shared files
```

并行条件：`interaction.md` 中无写冲突，或文件分区明确（append-only docs vs code）。

### Pattern C — Parent + specialists

```
Main: owns handoff + verify
  Sub explore → returns file map into interaction.md
  Sub implementer → T01/T02
  Sub reviewer → verify checklist only
```

## Prompt Pack Assembly (for Agents)

执行前按序拼接（或 `@` 引用文件）：

1. `context/system.md`  
2. `context/requirement.md`  
3. `context/interaction.md`（若需要）  
4. 当前 `tasks/Txx-*.md`  
5. 相关 `requirements.md` 行（仅本任务 REQ）

禁止把其它任务全文塞进 prompt，除非 `interaction.md` 显式引用。

## Sync Protocol

| Event | Update |
|-------|--------|
| Task starts | Status → doing；在 interaction 登记 “in progress: Txx” |
| Shared file landed | interaction「已落地」+ 路径 |
| Task done | Status → done；勾选 verify；不删 context |
| Conflict | 停并行；interaction 写冲突说明；主 Agent 仲裁 |

## Relation to Plugin / Content Work

对本仓库 Task 1 类工作：

- **system**：Content-first、`site-features`、静态站点约束  
- **requirement**：隐藏非 Content、Plugin 方案、文档方案  
- **interaction**：nav/home 与 `docs/solution` 的文件分区，便于「改代码」与「写文档」并行

## Acceptance Criteria

- [x] 三层文件职责与读序固定  
- [x] 任务可声明 Context pack  
- [x] 支持 main / parallel / parent-sub 三种执行模式  
- [x] 共享文件所有权与冲突协议可写在 interaction  
- [x] 在 `_template/context/` 落地样例文件  

## Anti-Patterns

- 把整份 AGENTS.md 复制进每个 requirement  
- 每个任务维护自己的「完整系统说明」副本  
- 无 interaction 表就并行改同一文件  
- Sub Agent 擅自扩大 Context pack  
