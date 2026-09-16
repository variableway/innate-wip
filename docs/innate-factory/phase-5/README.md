# Phase 5（Sprint 5）：innate-cli 收编与深化（M2–M4）

> 上级：[../README.md](../README.md) · 设计依据：[总方案 §4 §7 §8 §9 §10](../../solution/innate-factory.md)

## 总体目标

把 Phase 3–4 验证过的 python 家族（scan / clone / new_app）收编进 **innate-cli（Go，落 `base/innate-backend`）**，并补齐 factory 的运营能力：verdaccio 生命周期（`innate npm`）、健康巡检（`innate doctor`）、skill 通道（`innate skill link`）、多 Agent 调度与看板（`innate task` / `innate dispatch`）。对应总方案里程碑 **M2–M4**。

这是最长的 Sprint，内部按**波次（waves）**推进——沿用 dispatch 协议的波次闸门与"文件互斥即依赖"原则（§7.3）：同文件双写的任务不同波，上一层全绿才开下一层。

## 前置条件

- **Phase 4 全 DoD**：python 流程被一次真实生成验证过（收编的对照基准）
- `base/innate-backend/innate-go`：Go 基座已有（cmd / internal / Taskfile），CLI 骨架长在它上面
- GitHub 侧：`gh` CLI 可用（看板与 dispatch 都靠它，§7.1 选型理由：零新设施、agent 友好）

## 波次与任务拆解

| 波次 | 里程碑 | 任务 | 互斥原因 / 闸门 |
|------|--------|------|-----------------|
| **W1 收编地基** | M2 | [T5.1](./T5.1-innate-cli-skeleton.md) → [T5.2](./T5.2-ingest-registry.md) → [T5.3](./T5.3-ingest-scaffold.md) | 三者都动 registry / scaffold 语义，串行；T5.3 依赖 T5.1 的命令树与 T5.2 的 registry 读写层 |
| **W2 npm 与健康** | M3 | [T5.4](./T5.4-npm-lifecycle.md) · [T5.5](./T5.5-doctor.md) | W1 后可并行；T5.5 的 ui 版本检查依赖 T5.4 的 registry 查询能力 |
| **W3 skill 通道** | M2 尾 | [T5.6](./T5.6-skill-link.md) | 独立，随时可插队 |
| **W4 调度与看板** | M4 | [T5.8](./T5.8-task-board.md) → [T5.7](./T5.7-dispatch.md) | dispatch 依赖 task import 建好的 issue 状态模型；先有板后有派发 |

| ID | 任务 | 产出 | 前置 | 规模 |
|----|------|------|------|------|
| T5.1 | innate-cli Go 骨架与命令树 | `cmd/innate`（binary `innate`） | Phase 4 | M |
| T5.2 | 收编 registry scan/clone | `innate registry scan/clone` + 对照测试 | T5.1 | M |
| T5.3 | 收编 scaffold：new app/plugin/skill | `innate new *` + plugin-package / skill 模板 | T5.1 · T5.2 | L |
| T5.4 | innate npm start/stop/publish | verdaccio 生命周期（tasks/innate-cli.md 原始需求） | Phase 2 | M |
| T5.5 | innate doctor | 健康巡检 + templateVersion 落差报告 | T5.2 · T5.4 | M |
| T5.6 | innate skill link | 用户级 skill 软链进各 harness | T5.1 | S |
| T5.7 | innate dispatch | worktree + prompt pack + headless 启动 | T5.8 | L |
| T5.8 | innate task import/board + making 看板 | 任务包 ↔ Issues 同步 + 列视图 | T5.1 | M |

## Sprint 验收（DoD）

- [ ] python 三件（scan / clone / new_app）有 Go 等价物，**对照测试通过**（同输入同输出），python 版标 deprecated 并保留一个过渡版本
- [ ] `innate npm start → publish → 下游 app install` 全链无手工 docker 命令
- [ ] `innate doctor` 在真实 workspace 出报告，且能抓出人工埋的一个不一致
- [ ] `innate skill link` 后至少两个 harness（zcode / claude）能发现用户级 skill
- [ ] **§7 闭环走通一次**：真实任务包 import 建号 → dispatch 派发 → agent 执行 → PR → merge → issue 自动 close → sync → 网站看板更新
- [ ] making 看板视图上线（列：Backlog / In-Progress / In-Review / Done，agent 身份可见）

## 风险

| 风险 | 缓解 |
|------|------|
| Go 重写引入行为漂移（python 已验证的语义走样） | 每个收编任务带对照测试（byte-level golden），漂移即测试红 |
| dispatch 对多 harness 的 headless 启动差异大 | 命令模板外置配置（harness.yaml），v1 只保证 1–2 个 harness 实测可用 |
| 大 Sprint 拖尾 | 波次闸门：每波独立验收独立收口，W1 完成即 python 家族已可退役，后续波次延期不伤既有能力 |
| 看板状态模型漂移（Projects 列 vs label 两套真源） | T5.8 定死单一真源（label 为准、Projects 为视图），写进任务卡并回填总方案 §7 |

## 本 Sprint 不做

- 不重写 app 自身（factory 造 app，不改造存量 app）
- 不评估 Linear / 自建看板（§7.1 已决策 GitHub Issues + Projects，重 agile 特性需求出现再议）
- `registry.yaml`（外部 skills 仓）迁移时机在 W3（T5.6）顺带评估，不单独开卡
- `innate dev link/unlink`（§9 开发回环的零发布联调）作为 T5.4 的可选扩展，低优先级，不进 DoD
- 不做 `innate task board` 的 Web 自建界面（making 看板视图即网站侧形态）
