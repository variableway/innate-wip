# Innate Factory：Index Repo 代码结构规划

> Status: 执行中（2026-09；Phase 1 已完成，sprint 执行文档移至 workspace 仓 `docs/innate-factory/`）
> Related: [plugin-dual-track.md](./plugin-dual-track.md)（双轨插件）、私有包讨论（GitHub Packages / Verdaccio）
> 落点仓库：`innate-workspace`（演进为 innate-factory，repo 可更名，GitHub 有重定向）
> 使命：**快速创建 APP**——模板 + 生成器 + 注册表 + 生命周期命令，四件套
> 执行层文档：`innate-workspace/docs/innate-factory/`（每 phase 一个 sprint，子任务单文件）

## 0. 现状资产（不重造）

| 已有 | 位置 | 在 factory 中的角色 |
|------|------|---------------------|
| 项目注册表 | `registry-innate.yaml` | 演进为 `registry/apps.yaml`，扩字段 |
| 扫描/克隆脚本 | `scripts/scan-innate-apps.py` / `clone-innate.py` | 保留"目录为源、registry 同步"哲学，后续被 innate-cli 收编 |
| 前端基座 | `base/innate-fe-base`（自带 apps/packages monorepo） | `@innate/ui` 之家，publish 到私有 npm |
| 后端基座 | `base/innate-backend`（Go + skills） | innate-cli（Go）落点 |
| 私有 npm 规划 | `tasks/innate-cli.md`（verdaccio + cli 控制启停/发布） | factory 的包分发层，M3 落地 |
| 工作流文档 | `tasks/`、innate-wip 的 `docs/solution/` | 决策记录迁入或链接 |

## 1. 目录结构

```
innate-workspace/                  # index repo → innate-factory
├── factory/                       # ★ 核心：造 app 的机器
│   ├── templates/                 # 应用模板（真实可构建项目，非文档）
│   │   ├── app-content/           # 内容型站：Next static + plugin registry + @innate/ui
│   │   │                          #   内置 AGENTS.md + .agents/skills/<app>-dev/ 起步 skill
│   │   ├── app-tool/              # 工具型独立站：轻量，卫星仓形态
│   │   ├── plugin-package/        # package-as-plugin：InnatePlugin 契约 + 一行式路由包装示例
│   │   ├── desktop-shell/         # Tauri 壳：frontendDist 指向已有 web 构建产物
│   │   └── skill/                 # Agent Skill 模板：SKILL.md 脚手架 + references/ 约定
│   ├── presets/                   # 模板组合预设（content-basic / content+making / tool+desktop）
│   ├── scaffold/                  # 生成器（M1 用 python/bash；M2 并入 innate-cli 子命令）
│   │   ├── new_app.py             # innate new app <name> --template app-content
│   │   └── new_plugin.py          # innate new plugin <id> --track package|iframe
│   └── hooks/                     # 生成后接线：注册登记 / CI 生成 / 部署配置
├── base/                          # 共享基座（已有，保持）
│   ├── innate-fe-base/            # @innate/ui → 私有 npm
│   ├── innate-backend/            # innate-cli（Go）
│   ├── innate-foundation/
│   └── innate-selfhost/           # verdaccio 等 self-host 配置与 compose
├── registry/                      # ★ 唯一事实源（scan 保持"目录为源"同步方向）
│   ├── apps.yaml                  # 演进自 registry-innate.yaml
│   ├── plugins.yaml               # 双轨插件清单（package 名 | iframe URL）
│   ├── skills.yaml                # skill 清单（级别 repo|user / 归属 app / 已链接 harness）
│   └── deploy.yaml                # app → 部署目标（pages 壳仓 / cloudflare 项目 / none）
├── scripts/                       # 现有 scan/clone 保留，逐步被 innate-cli 收编
├── tasks/                         # 工作流（已有）
├── docs/                          # 决策记录（docs/solution 系列迁入或链接）
└── .github/workflows/             # factory CI：模板冒烟构建 + registry 一致性检查
```

## 2. Registry Schema 扩展

```yaml
# registry/apps.yaml（✅ 已落地，实际文件见 innate-workspace/registry/apps.yaml）
# kind 模型决策（2026-09）：core/satellite 已废弃 → app | base | external（缺省 external）
# 理由：core/satellite = 两套共享机制；收敛为一套 = base 唯一共源，所有 app 平等消费
apps:
  - name: innate-wip
    kind: app               # 不再有 core 特权——第一个 app 而已
    template: app-content
    templateVersion: v0     # 生成时所用模板版本，升级是显式动作
    path: innate-apps/content/innate-wip
    repo: https://github.com/variableway/innate-wip.git
    deploy: [pages, cloudflare]
    desc: Personal content site (flagship app, plugin dual-track host)
  - name: innate-fe-base
    kind: base
    path: base/innate-fe-base
    publishes: ["@innate/ui"]   # 产物走私有 npm；通用插件将跟进（@innate/plugin-*）
    desc: 前端基座，模板上游

# registry/plugins.yaml（对齐 innate-wip 的 SitePlugin manifest）
plugins:
  - id: making
    track: package              # package | iframe
    source: "@innate/plugin-making"
  - id: external-tool
    track: iframe
    src: https://tool.example.com
```

`deploy.yaml` 是"代码单元 ≠ 部署单元"的落地：一个 app 可同时登记多个部署目标。

## 3. 核心流程：new app

```
innate new app edu-quiz --template app-content --deploy cloudflare
  1. 复制 factory/templates/app-content + 占位符替换（{{app-name}} / {{basePath}} / {{scope}}）
  2. 归属决策：
     --in-core  → 生成到核心仓（innate-wip）apps/ 下，workspace:* 引 @innate/ui
     默认       → 生成到 innate-apps/<category>/<name> 独立仓，依赖走私有 npm
  3. git init + 首 commit + gh repo create（可选）
  4. registry/apps.yaml 自动登记（kind/template/deploy）
  5. 按 deploy 字段接线 CI（deploy-pages / deploy-cloudflare workflow 生成）
  6. 首次构建必须绿 —— factory 的验收标准即"生成即可用"
```

`new plugin` 同理：`--track package` 走 plugin-package 模板（InnatePlugin 契约 + 薄包装路由示例）；`--track iframe` 只登记 plugins.yaml，不生成代码。

## 4. innate-cli 子命令全景（接 tasks/innate-cli.md 的 Go 计划）

| 命令 | 职责 | 阶段 |
|------|------|------|
| `innate new app / plugin / skill` | 脚手架（收编 scaffold/） | M2 |
| `innate skill link --agent <harness>` | 用户级 skill 软链进各 harness skill 目录 | M2 |
| `innate registry scan / clone` | 收编现有 python 脚本 | M2 |
| `innate task import / board` | 任务包 ↔ GitHub Issues 同步；看板视图 | M4 |
| `innate dispatch <T> --agent <harness> [--wave]` | 多 Agent 派发：worktree + prompt pack + headless 启动 | M4 |
| `innate npm start / stop / publish` | verdaccio 生命周期 + 发布 @innate/* | M3（即 innate-cli.md 的原始需求） |
| `innate doctor` | app 健康度：注册一致 / 构建绿 / 依赖过期 | M3 |

## 5. 防腐机制

1. **模板即项目**：每个 template 是真实可 `pnpm build` 的工程；factory CI 在模板变更时 + 每周冒烟构建全部模板——模板腐烂在这里被拦住，而不是在新 app 生成时。
2. **目录为源**：沿用 scan 的同步方向（registry 跟随磁盘现实），factory 只在"新建"时写 registry，之后 scan 维护。
3. **生成即可用**：new app 的最后一步是构建验证；构建不绿的模板不允许发布新版本。
4. **preset 组合而非模板膨胀**：变体用 preset（模板 + 补丁文件组合）表达，避免模板数量爆炸。

## 6. 里程碑

| 阶段 | 内容 | 依赖 |
|------|------|------|
| M1 | templates（app-content 优先）+ new_app.py + apps.yaml 扩展 | 无，现有栈 |
| M2 | innate-cli Go 骨架，收编 scaffold + scan/clone | innate-backend 基座 |
| M3 | verdaccio selfhost + @innate/ui publish + `innate npm *` | tasks/innate-cli.md |
| M4 | deploy 接线自动化 + `innate task / dispatch`（多 Agent 派发与看板）+ doctor + 模板冒烟 CI | M1–M3 |

## 7. 多 Agent 调度与看板

> 需求：多个 AI Agent 并行处理任务，同时有一块 Task/Agile 看板记录全程。
> 基础：`multi-agent-dispatch.md`（波次 + worktree + 单写者协议）、`task-watcher`（data→网站同步循环，已运行）、making 模块（issues 渲染，已存在）。

### 7.1 选型：看板后端 = GitHub Issues + Projects

唯一同时满足四个条件的选项：**零新设施**、**agent 友好**（任何 harness 都有 `gh` CLI，无需 API/MCP 体系）、**网站友好**（sync 脚本和 making 模块已存在）、**PR 联动**（`Closes #N` 自动流转）。Linear/自建看板（Vikunja/Plane selfhost）留到需要 sprint/epic 等重 agile 特性时再评估——它们给 agent 的接口成本更高。

角色分工：

| 层 | 载体 | 职责 |
|----|------|------|
| 状态（看板卡片） | GitHub Issue + Projects 列（Backlog / In-Progress / In-Review / Done） | 谁在做、什么状态、卡在哪 |
| 上下文（context pack） | `task/project/<pkg>/`（handoff/spec/context/tasks） | 卡片背后的简报，agent 的 prompt 素材 |
| 展示（看板视图） | GitHub Projects 原生 kanban；网站 making 模块升级为看板视图 | 人看的两处界面 |

### 7.2 闭环

```
task 包（context pack）
    │ innate task import（T01–T05 → 批量建 Issue，body 链回任务文件）
    ▼
innate dispatch T01 --agent claude      innate dispatch T02 --agent zcode …（同波并行）
    │ 自动化 dispatch 协议 Step 0+1：
    │ git worktree add + 分支 + prompt pack 组装（handoff+context+任务文件）
    │ + headless 启动 agent 会话 + gh issue edit → In-Progress，assignee=agent 标签
    ▼
各 Agent 在各自 worktree 执行 ──► PR（描述含 Closes #N，只写自己领地）
    │
    ▼
波次合并（单写者原则，README/verify/interaction 由合并者维护）
    │ merge → Issue 自动 close → Projects 列移动到 Done
    ▼
task-watcher 定时 sync → data/issues.json → 网站 making 看板视图更新
```

### 7.3 关键规则（沿用 dispatch 协议，factory 只做自动化）

1. **波次闸门**：`innate dispatch --wave` 按任务包内 `waves.md` 分层派发；上一层全部合并且集成验证绿才开下一层。
2. **文件互斥即依赖**：同文件双写的任务不同波（如 plugin-mode T01 与 refine T01 同改 registry.ts）。
3. **Agent 身份可见**：Issue assignee / label = harness 名（claude / zcode / deepseek…），看板上直接看到"谁"在做"什么"。
4. **状态汇报走 git**：worktree 隔离下没有实时黑板，agent 唯一的状态出口是 commit + PR + issue comment。

## 8. Skill 体系（Agent 知识的模板化）

> SKILL.md 已是跨 harness 事实标准（ZCode / Claude Code / OpenCode 均识别），知识随仓库版本化——生成的 app 同时对 agent "生成即可用"。

### 分层

| 层级 | 位置 | 内容 | 发现方式 |
|------|------|------|----------|
| 仓库级（app 专属） | 各 app 仓内 `AGENTS.md` + `.agents/skills/<app>-dev/` | 构建/验证/数据管道/plugin registry 约定 | agent 在该仓工作即自动发现，**零安装** |
| 用户级（跨项目） | `base/wip-skills/` → 软链 `~/.agents/skills/` | innate 工作流、dispatch 纪律等通用知识 | `innate skill link --agent <harness>` |
| 任务级 | task 包 handoff + context | 单次任务简报 | dispatch 组装 prompt pack |

关键设计：**仓库级 skill 是 app 的一部分**——随 app 模板生成、随 app 版本化。app-content 模板自带的 starter skill 内容至少包括：dev/build/verify 命令、static export 约束、数据管道（sync:* 脚本）、plugin registry 规则。新 app 落地，任何 harness（含 DeepSeek 系）进来就知道怎么干活。

### factory 动作

- `templates/skill/`：SKILL.md 脚手架（对齐 skill-creator 格式：frontmatter + 触发描述 + references/ 按需加载）
- app 模板内置 starter skill（上表仓库级）
- `innate new skill <name> [--app X]`：生成并登记 `registry/skills.yaml`
- `innate skill link --agent zcode|claude|opencode...`：用户级 skill 软链进各 harness 目录（arkcli-connect 同款模式）

```yaml
# registry/skills.yaml
skills:
  - name: innate-wip-dev
    level: repo                 # repo | user
    app: innate-wip
    path: innate-apps/content/innate-wip/.agents/skills/innate-wip-dev
  - name: innate-dispatch
    level: user
    path: base/wip-skills/innate-dispatch
    linked: [zcode, claude]
```

### 与 dispatch 的关系

prompt pack 因此变薄：仓库约定（原来每次粘贴的那部分）由仓库级 skill 承载，dispatch 组装时只保留任务简报 + 波次纪律。skill 管"这个仓怎么开发"，task 包管"这次做什么"。

## 9. Base 与模板的关系（自举问题）

> 问：innate-fe-base 这类基座项目要不要也放进 factory、变成"完全遵照模板生成的 app"？
> 答：**治理上完全遵照，出身上不能遵照**——它是模板的来源，由模板生成它就是循环依赖。

### 两层"遵照"

| 层 | 对 base 的要求 |
|----|----------------|
| **治理遵照**（要） | 注册进 `apps.yaml`（`kind: base`）、自带 AGENTS.md + 仓库级 skill、被 doctor 覆盖、产物 `@innate/ui` 走私有 npm、CI 绿 |
| **出身遵照**（不要） | 不由 app-content 模板生成、不搬进 `factory/` 目录、不追模板版本 |

### 内容流向（模板从哪来，防止漂移）

```
innate-fe-base / innate-wip（实验室：新模式先在这里验证成熟）
        │  固化（人工提炼 / innate template sync）
        ▼
factory/templates/app-content@vN（模板 = 基座成熟模式的快照，带版本）
        │  innate new app（量产）
        ▼
新 app（记录 templateVersion，生成即站在基座肩膀上）
        │  回流（app 里再验证的细节提升回 base）
        └────────────────────────────► 回到实验室
```

防腐机制由此多一条：**模板与基座的双向同步**——基座演进不自动改变模板（显式固化动作），模板升版不自动改造存量 app（显式升级动作，`templateVersion` 记录落差，doctor 可报告"落后 N 版"）。两个方向都显式，避免"完全遵照"演变成不可控的自动重写。

### 基座内部的增量可以工厂化

base 整体是上游，但 base **里面新增的零件**可以由 factory 生成：`innate new plugin --in-core base/innate-fe-base` 用 plugin-package 模板在基座里长新包。整体是源，增量是产物，两者不矛盾。

### ui package 的复用路径（收敛与回环）

> 现状（2026-09 排查）：`@innate/ui` 存在两份同名同版本（0.1.0）副本——`base/innate-fe-base/packages/ui` 与 `innate-wip/packages/ui`，当前 diff 为零（纯复制未分叉），但 wip 的 web 经 `workspace:*` 连的是本地副本。**任何一次单边改动后版本号即失效。**

复用 = 三件事：**源头唯一、消费分型、开发回环**。

1. **源头唯一 → fe-base**。基座有完整的包家族（ui / agent-ui / scene-* / skills-kit），且 innate-cli 原始任务即以 fe-base 为例发布 ui 到私有 npm。收敛动作：撤销 wip 副本，`apps/web` 改为依赖私有 npm 版本。
2. **消费分型**：

   | 消费者 | 方式 |
   |--------|------|
   | fe-base 内部 apps | `workspace:*` |
   | 核心仓（innate-wip）/ 卫星仓 / desktop 模板产物 | 私有 npm 安装 `@innate/ui@semver`（app 模板预置 `.npmrc` scope 路由，生成即连通） |

3. **开发回环（单人高频改 ui 的摩擦控制）**，两个工具按场景切换：
   - **verdaccio 本地秒发**：无 CI 延迟，`innate npm publish`（改 → 发 → 下游 `innate update @innate/ui`）
   - **dev link 开关**：`innate dev link @innate/ui` 把消费仓依赖临时改写为 `link:../../base/innate-fe-base/packages/ui` 零发布联调，`innate dev unlink` 还原为版本号——联调态显式可见，防忘记切回

4. **版本纪律**：changesets + semver 从第一天执行（本地 verdaccio 不豁免）；doctor 报告各 app 的 `@innate/ui` 版本离散度。

5. **过河白名单**：只有跨边界的公共包（`@innate/ui`、未来 `@innate/plugin-sdk`）走私有 npm；`plugin-*` 内容插件留在核心仓 `workspace:*`，不过河。

## 10. 从当前 innate-workspace 直接改造（执行计划）

> 问：不另起仓库，直接把 innate-workspace 改造成本方案，怎么做？
> 答：分五个阶段，每阶段独立可验收、git mv 保历史、scan/clone 脚本随迁。总原则：**改造是重构不是重写**——所有现有资产（base/、scripts/、registry、tasks/）原地保留或移动，不重建。

### Phase 0 — 清障（.gitignore 审计先行，然后才 commit）

> 教训：**先修 ignore 再 commit**。顺序反了，被旧规则压住的文件（锁文件、skill）不会被 commit，还得二次操作且 review 混乱。

**Step 1 — .gitignore 审计与修复**（2026-09 排查出的三处冲突）：

| 现行规则 | 与 factory 的冲突 | 修复 |
|----------|-------------------|------|
| `bun.lock` / `pnpm-lock.yaml` / `package-lock.json` / `yarn.lock`（大型 JSON 区） | fe-base 的 `bun.lock` 存在但未入库 → 发布 `@innate/ui` 不可复现 | 删除锁文件规则；fe-base 锁文件入库 |
| `.agents/`（192 行） | 仓库级 skill 载体 `.agents/skills/` 永远不入库——fe-base、wip-skills 的 skill 现已中招 | 收窄：`.agents/*` + `!.agents/skills/`（gitignore 语义要求父目录不整目录排除才能反向包含；agent 的缓存/会话垃圾继续被 `.agents/*` 覆盖） |
| 二进制通配 `*.png` / `*.woff` 等（二进制大文件区） | Phase 3 模板资产会被忽略 → 生成的 app 缺图标字体 | 预铺例外：`!factory/templates/**` |

**Step 2 — 解放文件入库**：规则修完后 `git add` 新被解放的文件（`base/innate-fe-base/bun.lock`、各 `.agents/skills/**`）。

**Step 3 — commit**：建议两个 commit 分离关注点——① `.gitignore` 修复 + 新入库文件；② `base/` 既有脏修改（innate-backend 的 M 文件）。

**Step 4 — 保持不变**：`innate-apps/`、`references/`、`data/`、`projects/` 等有意忽略项不动。

验收：`git status` 干净；`git ls-files` 能看到 `bun.lock` 与 `.agents/skills/` 内容；从纯 clone 能复现 fe-base 安装（`bun install` 走锁文件成功）。

### Phase 1 — registry 改造（✅ 2026-09-09 已完成，执行记录见 workspace 仓 docs/innate-factory/phase-1-registry/）

- 基线同步 + `git mv registry-innate.yaml registry/apps.yaml`（保历史；基线 scan 发现 17 增 2 删的存量漂移，先还债后搬家）
- 根 `registry.yaml`（references 管理，spark-cli 已实现）**完全未动**——scan.py 对其行为经 round-trip 对比验证零影响
- `scan.py` 补扩展字段 round-trip 保留（merge 过继 + write 输出 + `@` 开头标量引号），schema 扩展不再被 scan 剥掉
- schema 回填（kind: app/base/external）+ 新建 `registry/{plugins,skills,deploy}.yaml` + `registry/README.md`
- 验收全过：纯迁移 diff 零 / scan 后字段保留 / 四表 YAML 合法

### Phase 2 — ui 收敛（地基，模板依赖它）

- `base/innate-selfhost`：verdaccio compose + 配置（`.npmrc` scope 路由）
- fe-base 手动首发 `@innate/ui@0.1.1` 到 verdaccio（`pnpm publish`，innate-cli 未成之前不挡路）
- innate-wip：撤 `packages/ui` 副本，`apps/web` 依赖改 verdaccio 版本，构建验证绿
- 验收：wip 站构建绿 + 依赖来自 verdaccio 而非本地副本

### Phase 3 — factory/ 骨架 + 第一个模板

- `mkdir factory/{templates,presets,scaffold,hooks}`
- **app-content 模板从 innate-wip 固化**（趁 ui 收敛后）：复制仓骨架 − 个人数据 − plugins 硬编码 + 占位符（`{{app-name}}`/`{{basePath}}`）+ 内置 AGENTS.md、`.agents/skills/{{app-name}}-dev/`、`.npmrc`（@innate → verdaccio）、plugin registry 空壳、deploy workflow 桩
- 模板冒烟 CI：`.github/workflows/template-smoke.yml`（模板变更时 + 周构建全部模板）
- 验收：模板裸 build 绿

### Phase 4 — scaffold 首跑（factory 心跳）

- `factory/scaffold/new_app.py`：复制模板 → 占位符替换 → `git init` + 首 commit → `registry/apps.yaml` 登记 → 可选 `gh repo create` + clone 到 `innate-apps/<category>/`
- 验收（factory 的定义性时刻）：**用 factory 生成一个真实小 app，构建绿、registry 有记录、看板 issue 建好**

### Phase 5+ — 收编与深化（对齐 M2–M4）

- innate-cli（Go，落 `base/innate-backend`）逐步收编 scaffold / scan / clone / npm
- dispatch + 看板（§7）、skill link（§8）、doctor

### 不做的事（改造期间）

- **不改仓库名**：等 factory 身份被 Phase 4 验证后再考虑更名 innate-factory（GitHub 重定向虽可，先免折腾）
- **不吸收 innate-apps**：app 仓库保持独立 git repo，registry 索引即可
- **不提前重写 python 为 Go**：M2 的事
- **不迁移 innate-wip 的 docs/solution 系列**：factory `docs/` 先以链接引用，等有跨仓共性再迁

### 风险与顺序依赖

| 风险 | 缓解 |
|------|------|
| scan 脚本改路径后丢 desc 字段 | Phase 1 验收即"跑 scan 后 registry 内容 diff 为零" |
| verdaccio 未起就撤 wip 副本 → 站点构建断 | Phase 2 内部顺序固定：先起服务发版、后撤副本，两步间构建验证 |
| 模板从 wip 固化时夹带个人信息 | 固化清单显式列出"删除项"（data/、content/ 个人内容、密钥、git 历史） |
| base/ 脏树混入改造 commit | Phase 0 强制清障，改造 PR 不夹带旧债 |

## 11. 与既有结论的衔接

- 双轨插件：plugin-package / iframe 两种模板 = plugin-dual-track 的落地件
- 核心 + 卫星：new app 的 `--in-core` / 默认独立仓 = 两种归属的一生一次决策点
- 部署解耦：deploy.yaml + CI 接线 = "monorepo 生 N 个静态站"的登记处
- 私有包：verdaccio（本地起步）→ 需要时平移 GitHub Packages，`@innate` scope 现在就定死
- Skill 分层：仓库级（随 app 模板生成）/ 用户级（wip-skills）/ 任务级（task 包），见 §8
- ui 收敛：源头唯一 = fe-base，wip 撤副本走 verdaccio，见 §9
- 多 Agent 与看板：GitHub Issues + Projects 为板，innate dispatch 自动化波次协议，见 §7
