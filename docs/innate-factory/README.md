# Innate Factory 执行文档（Sprint 化）

> 设计来源：[../solution/innate-factory.md](../solution/innate-factory.md)（总方案，§10 为执行计划）
> 本目录把执行计划按 **Sprint** 展开：**一个 Phase = 一个 Sprint，一个子任务 = 一个文件**。
> 状态：全部未开始（2026-09-09 建立）

## Sprint 总览

| Sprint | 主题 | 状态 | 文档 |
|--------|------|------|------|
| Phase 0 | 清障（.gitignore 审计 + commit） | 未开始 | 见总方案 §10（任务量小，暂不展开） |
| Phase 1 | registry 改造（纯重构，diff 为零验收） | 未开始 | 见总方案 §10 |
| Phase 2 | ui 收敛（verdaccio 首发 + wip 撤副本） | 未开始 | 见总方案 §10 |
| **Phase 3** | **factory/ 骨架 + app-content 模板 v1** | 未开始 | [phase-3/README.md](./phase-3/README.md) |
| **Phase 4** | **scaffold 首跑（factory 心跳）** | 未开始 | [phase-4/README.md](./phase-4/README.md) |
| **Phase 5** | **innate-cli 收编与深化（M2–M4）** | 未开始 | [phase-5/README.md](./phase-5/README.md) |

Phase 0–2 已在总方案 §10 有完整描述且任务量小，先不单独成卡；需要时按同样格式补录到 `phase-0/` ~ `phase-2/`。

## 依赖链

```
Phase 0 清障
   └─► Phase 1 registry 改造 ─┬─► Phase 3 模板 ◄── Phase 2 ui 收敛（模板依赖 verdaccio）
                              │        └─► Phase 4 scaffold 首跑
                              │                 └─► Phase 5 收编与深化（M2–M4）
```

- Phase 3 依赖 Phase 1（`registry/` 目录就位）与 Phase 2（`@innate/ui` 已可从 verdaccio 安装，模板里的 `.npmrc` 与依赖才是真实可用的）。
- Phase 4 依赖 Phase 3（先有模板才能生成）。
- Phase 5 依赖 Phase 4（收编的前提是 python 版先跑通并被一次真实验收验证）。

**现状提醒（2026-09-09 盘点）**：innate-workspace 根的 `scripts/scan.py` / `scan-innate-apps.py` / `clone-innate.py` 已带一批**未提交**的 Phase 1 味道改动（已指向 `registry/apps.yaml`，但 `registry-innate.yaml` 尚未 `git mv`，`registry/` 目录不存在）——Phase 0 清障时必须先处置这批工作区改动，Phase 1 才能从干净树开始。

## 文档规范

每个 Sprint 目录包含：

- `README.md`：Sprint **总体目标**、前置条件、**任务拆解表**、验收标准（DoD）、风险、不做清单。
- `T<phase>.<n>-<slug>.md`：**一个子任务一个文件**。任务卡固定结构：

  | 节 | 内容 |
  |----|------|
  | 元信息行 | Sprint / 状态 / 规模（S≤半天， M≈1–2 天， L≥3 天）/ 前置依赖 |
  | 目标 | 一两句话说清做完后世界多了什么 |
  | 背景与动机 | 为什么有这个任务，锚定总方案章节与仓库现状 |
  | 工作项 | 可执行步骤，落到真实路径 |
  | 产物 | 留在仓库里的东西 |
  | 验收标准 | 可勾选的 checklist，硬标准 |
  | 风险与注意 | 已知的坑与边界 |

任务导入看板（Phase 5 的 `innate task import`）时，以任务卡为最小单元建 Issue，body 链回文件。
