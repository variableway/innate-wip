# Fire-Skills 测试验证与改进分析报告

> 对 `../fire-skills` 目录下所有 Skill 的系统性分析、问题定位、改进建议与实施计划

---

## 一、Skill 全景概览

`fire-skills` 目录共包含 **8 个 Skill**，覆盖 AI 配置、GitHub 工作流、本地工作流、前端开发、桌面应用开发、秘密扫描和任务初始化等场景。

| 序号 | Skill 名称 | 类型 | 核心用途 | 当前状态 |
|------|-----------|------|----------|----------|
| 1 | `ai-config` | 配置类 | 一键配置 AI Provider 到各 Agent 工具 | ✅ 结构清晰，模板完整 |
| 2 | `github-cli-skill` | 工具类 | 简化版 GitHub CLI 使用指南 | ✅ 简单直观 |
| 3 | `github-task-workflow` | 工作流类 | 通过 GitHub Issues 管理任务全生命周期 | ⚠️ **存在代码级 bug** |
| 4 | `innate-frontend` | 开发规范类 | 基于 @innate/ui 的 Web 前端开发规范 | ✅ 文档详尽 |
| 5 | `local-workflow` | 工作流类 | 纯本地任务追踪，无需 GitHub | ✅ 功能完整 |
| 6 | `scanning-for-secrets` | 安全类 | 提交前扫描代码中的 secrets | ✅ 实用性强 |
| 7 | `spark-task-init-skill` | 初始化类 | 初始化 spark task 目录结构 | ✅ 轻量可用 |
| 8 | `tauri-desktop-app` | 开发规范类 | Tauri + Next.js 桌面应用开发规范 | ✅ 模板存在 |

---

## 二、逐 Skill 分析与测试结果

### 2.1 ai-config

**内容质量**：⭐⭐⭐⭐⭐

- **YAML frontmatter** 规范完整，包含 `name`、`description`、`type`、`supported_agents`
- 提供了 **方式 A（自动安装）** 和 **方式 B（模板复制）** 两种路径，考虑周到
- 模板文件覆盖了 Claude Code、Codex、OpenCode、Cline、OpenClaw 五种工具
- 包含了 API 端点、模型映射、注意事项等关键信息

**验证结果**：
```bash
$ ls ai-config/templates/
claude-code/  cline/  codex/  openclaw/  opencode/
```
所有模板目录均存在，文件完整。

**改进建议**：
1. 模板中部分文件（如 `glm.sh`）可能需要执行权限，建议在 SKILL.md 中补充 `chmod +x` 提示
2. 可增加对 Kimi CLI 的配置支持（虽然 Kimi 通常不需要复杂配置，但可提供 `.kimi/config.yaml` 模板）
3. 建议增加一个「验证配置是否成功」的脚本或命令（如测试 API 连通性）

---

### 2.2 github-cli-skill

**内容质量**：⭐⭐⭐⭐☆

- 结构简洁，命令覆盖创建仓库、Issue 管理、添加评论、关闭/重新打开 Issue
- 提供了 Python 脚本集成示例

**验证结果**：
- 纯文档型 skill，无可执行脚本
- 命令示例正确，参数使用符合 `gh` CLI 官方文档

**改进建议**：
1. **缺少前置检查**：建议增加一个脚本检测 `gh` 是否已安装和登录
2. **缺少错误处理示例**：如 `gh auth status` 检查登录状态
3. 可补充 `gh pr` 相关命令（创建 PR、查看 PR、合并 PR），因为任务工作流最终往往指向 PR

---

### 2.3 github-task-workflow ⚠️ 重点关注

**内容质量**：⭐⭐⭐☆☆

- SKILL.md 内容非常详尽，流程图、脚本说明、配置说明一应俱全
- 但实际代码层面**存在明显 bug**

**验证结果**：

#### Bug 1：循环导入/函数缺失（严重）
```python
# task_watcher.py 第 27 行
from create_issue import create_issue, get_git_remote
```

但 `create_issue.py` 中并没有 `create_issue` 函数，只有 `get_git_remote()` 和 `main()`。

实际具有 `create_issue` 函数的是：
- `create_issue_fixed.py`（第 52 行）
- `github_backend.py`（第 29/87/230 行）

**影响**：`task_watcher.py` 直接运行时会导致 `ImportError`，无法使用。

#### Bug 2：文件命名混乱
脚本目录下同时存在：
- `create_issue.py`
- `create_issue_fixed.py`

这暗示 `create_issue.py` 存在已知问题，但修复版没有被正式替换。用户/Agent 在调用时可能引用到错误的文件。

#### Bug 3：SSL 兼容性问题（部分环境）
`create_issue_fixed.py` 和 `ssl_context.py` 的存在说明在某些网络环境（如中国大陆）下，GitHub API 的 SSL 证书验证存在问题。当前通过 `patch_urllib()` 进行 monkey patch，这是一种权宜之计。

**脚本可用性测试**：
| 脚本 | 测试结果 | 说明 |
|------|----------|------|
| `create_issue.py` | ✅ `--help` 正常 | 但缺少 `create_issue()` 函数 |
| `create_issue_fixed.py` | 未测试完整执行 | 有 `create_issue()` 函数 |
| `orchestrate.py` | ✅ `--help` 正常 | 命令结构清晰 |
| `config_loader.py` | 未测试 | 配置加载逻辑 |
| `tracing.py` | 未测试 | 追踪记录逻辑 |
| `update_issue.py` | ✅ `--help` 正常 | 可用 |
| `task_watcher.py` | ❌ **导入失败** | 依赖缺失的 `create_issue` |
| `github_backend.py` | ✅ 可导入 | 作为后端模块正常 |

**改进建议**：
1. **立即修复**：合并 `create_issue.py` 和 `create_issue_fixed.py`，删除重复的 fixed 版本，统一入口
2. **修复 task_watcher.py 导入**：改为从 `github_backend.py` 或修复后的 `create_issue.py` 导入
3. **增加单元测试**：为所有脚本增加 `--dry-run` 模式或 mock 测试，避免依赖真实 GitHub API
4. **统一后端抽象**：`github_backend.py` 已经提供了良好的 OO 封装，建议让 `create_issue.py` 和 `update_issue.py` 都调用它，而不是重复实现 HTTP 请求逻辑
5. **删除或归档旧脚本**：`create_issue_fixed.py` 如果是临时文件，应删除并在 git 中清理

---

### 2.4 innate-frontend

**内容质量**：⭐⭐⭐⭐⭐

- 非常完整的组件库文档，涵盖 57 个基础组件 + 7 个 Landing 区块 + 业务区块
- 包含技术栈、使用指南、组件编写规范、主题系统、项目结构
- references/ 目录下有 `component-catalog.md` 和 `theme-system.md`

**验证结果**：
```bash
$ ls innate-frontend/references/
component-catalog.md  theme-system.md
```
文件存在，与 README 中的仓库结构描述一致。

**改进建议**：
1. `TypeScript 6` 的表述可能有误（截至 2026 年 4 月，TypeScript 最新版本约为 5.8），应核实版本号
2. 可增加「常见错误排查」章节（如 pnpm workspace 配置错误、Tailwind v4 迁移问题）
3. 建议增加一个快速启动脚本或模板复制命令，降低首次使用门槛

---

### 2.5 local-workflow

**内容质量**：⭐⭐⭐⭐⭐

- 作为 `github-task-workflow` 的无 GitHub 替代方案，文档结构清晰
- 脚本功能完整：`tracing.py` 支持 `init/finish/status/show/list`，`orchestrate.py` 支持 `init/status/finish/abort`

**验证结果**：
```bash
$ python local-workflow/scripts/tracing.py --help        ✅ 正常
$ python local-workflow/scripts/orchestrate.py --help    ✅ 正常
```

**改进建议**：
1. SKILL.md 中引用的 `../docs/spec/ai-agent-protocol.md` 路径存在，但应验证文档内容是否与 local-workflow 的最新实现同步
2. 建议增加一个「与 github-task-workflow 切换使用」的说明（用户可能先从 local 开始，后迁移到 GitHub）
3. `tracing.py` 和 `orchestrate.py` 可与 `github-task-workflow` 的对应脚本共享更多通用逻辑（如 git 操作、状态文件管理），减少维护负担

---

### 2.6 scanning-for-secrets

**内容质量**：⭐⭐⭐⭐⭐

- 秘密扫描模式覆盖全面（GitHub OAuth/PAT、AWS Key、Google API Key、Slack Token、Private Key、Bearer Token）
- 提供了 Quick Scan 命令、Resolution Workflow、pre-commit hook 示例、常见错误表

**验证结果**：
- 纯文档型 skill，命令示例可直接运行
- `grep` 正则表达式基本正确，但 `Generic Hex Token` 的正则在某些 shell 中可能需要转义调整

**改进建议**：
1. **建议增加一个可执行脚本**：`scanning-for-secrets/scripts/scan.sh` 或 `scan.py`，将 SKILL.md 中的 grep 命令封装起来，避免用户/Agent 每次都要复制粘贴长命令
2. 可考虑集成 `gitleaks` 或 `trufflehog` 的检测逻辑，提升扫描准确性
3. pre-commit hook 建议同时提供 Husky 配置示例（前端项目常用）

---

### 2.7 spark-task-init-skill

**内容质量**：⭐⭐⭐⭐☆

- 轻量简洁，明确说明需要 `spark CLI` 和 `kimi CLI`
- 提供了从初始化到创建、列表、删除、实现的完整命令示例

**验证结果**：
- 纯文档型 skill，依赖外部 `spark` 命令
- 在当前环境中未安装 `spark`，无法测试实际执行效果

**改进建议**：
1. 建议增加 `spark CLI` 的安装链接或安装命令
2. 可增加一个「检查环境」脚本，验证 `spark` 和 `kimi` 是否已安装
3. 示例中的 `spark task impl` 需要 Kimi CLI，但 SKILL.md 的 `supported_agents` 列出了多个 Agent，可能存在使用限制，应明确说明哪些命令需要 Kimi

---

### 2.8 tauri-desktop-app

**内容质量**：⭐⭐⭐⭐⭐

- 模板文件存在且结构完整
- 涵盖 Tauri 2.x + Next.js 16 + React 19 + Tailwind CSS 4 + shadcn/ui
- 提供了项目结构、初始化步骤、UI 组件添加、开发启动、Tauri IPC 通信模式

**验证结果**：
```bash
$ ls tauri-desktop-app/templates/
apps/  package.json  packages/  pnpm-workspace.yaml
```
模板目录完整，包含 monorepo 基础结构。

**改进建议**：
1. 模板中缺少 `README.md`，建议增加一个模板级的 README，说明如何安装依赖和启动
2. `innate-frontend` 使用 `@innate/ui`，而 `tauri-desktop-app` 使用 `shadcn/ui`，两者品牌不统一。若目标是统一设计系统，建议提供 `@innate/ui` 的 Tauri 适配版本
3. 建议增加 macOS 签名/公证、Windows 代码签名、自动更新等生产部署相关的简要说明

---

## 三、横向问题分析

### 3.1 代码层面的共性问题

| 问题 | 影响范围 | 严重程度 |
|------|----------|----------|
| **函数导入错误** | `github-task-workflow/scripts/task_watcher.py` | 🔴 高 |
| **重复/临时脚本文件** | `create_issue.py` vs `create_issue_fixed.py` | 🟡 中 |
| **缺少可执行封装** | `scanning-for-secrets`（纯文档）、`github-cli-skill`（纯文档） | 🟡 中 |
| **版本号准确性** | `innate-frontend` 中 `TypeScript 6` | 🟢 低 |
| **前置依赖检查缺失** | `spark-task-init-skill`、`github-cli-skill` | 🟡 中 |

### 3.2 文档层面的共性问题

| 问题 | 影响范围 | 严重程度 |
|------|----------|----------|
| ** SKILL.md frontmatter 不统一** | `scanning-for-secrets` 缺少 `type` 和 `supported_agents` | 🟡 中 |
| **跨 skill 引用路径** | 部分引用使用相对路径 `../docs/...`，在单独安装 skill 时可能失效 | 🟡 中 |
| **缺少故障排查/FAQ** | 大多数 skill 缺少「常见问题」章节 | 🟢 低 |
| **缺少自动化测试说明** | 没有说明如何验证 skill 是否工作正常 | 🟡 中 |

### 3.3 工程层面的共性问题

| 问题 | 说明 |
|------|------|
| **没有统一的测试框架** | 各 skill 的脚本都是独立编写的，没有共享的测试/验证工具 |
| **安装脚本与 skill 内容不同步** | `install.sh` 能正确识别 skill，但 `agent-workflow.yaml` 中的路径硬编码为 `~/.config/agents/skills/`，如果用户没有使用默认安装路径会失效 |
| **缺少 CI/CD 验证** | 没有 GitHub Actions 来自动运行各 skill 的健康检查 |

---

## 四、改进建议汇总

### 4.1 立即执行（P0 - 本周内）

1. **修复 `github-task-workflow` 的导入 bug**
   - 将 `create_issue_fixed.py` 的内容合并到 `create_issue.py`
   - 删除 `create_issue_fixed.py`
   - 修复 `task_watcher.py` 的导入语句

2. **统一 SKILL.md frontmatter**
   - 为 `scanning-for-secrets` 补充 `type: skill` 和 `supported_agents`

3. **验证 `agent-workflow.yaml` 中的硬编码路径**
   - 确保 `python ~/.config/agents/skills/github-task-workflow/scripts/orchestrate.py` 在使用 `--project` 安装时不会失效

### 4.2 短期优化（P1 - 2 周内）

4. **为纯文档型 skill 增加可执行脚本**
   - `scanning-for-secrets/scripts/scan.sh`：封装 grep 扫描逻辑
   - `github-cli-skill/scripts/check-auth.sh`：检测 `gh` 安装和登录状态
   - `spark-task-init-skill/scripts/check-env.sh`：检测 `spark` 和 `kimi` 可用性

5. **增加 skill 健康检查脚本**
   - 在仓库根目录增加 `test-skills.sh`：
     - 检查所有 SKILL.md 是否存在
     - 检查 frontmatter 是否完整
     - 检查所有 Python 脚本是否能正常导入
     - 检查所有引用的外部文件/链接是否存在

6. **版本号核实与修正**
   - 核实 `innate-frontend` 中的 TypeScript 版本号
   - 核实 `tauri-desktop-app` 中的各依赖版本是否最新

### 4.3 中期建设（P2 - 1 个月内）

7. **建立共享的 Python 工具库**
   - 将 `github-task-workflow` 和 `local-workflow` 中重复的 git 操作、状态文件管理、日志记录逻辑抽取到公共模块
   - 减少两个 workflow 脚本的维护负担

8. **增加 GitHub Actions CI**
   - 每次提交自动运行 `test-skills.sh`
   - 自动检查 Python 脚本的语法错误和导入问题
   - 自动检查 SKILL.md 的格式规范

9. **完善跨 skill 的内容一致性**
   - 统一各 skill 中的「前置要求」「使用方式」「注意事项」的章节结构
   - 建立 skill 模板（`skill-template/`），新 skill 基于模板创建

---

## 五、实施计划与任务清单

### Phase 1：Bug 修复与紧急清理（3-5 天）

- [ ] **Day 1**：修复 `github-task-workflow/scripts/task_watcher.py` 导入错误
  - [ ] 合并 `create_issue.py` 与 `create_issue_fixed.py`
  - [ ] 删除 `create_issue_fixed.py`
  - [ ] 运行 `python task_watcher.py --help` 验证修复
- [ ] **Day 2**：统一 SKILL.md frontmatter
  - [ ] 为 `scanning-for-secrets/SKILL.md` 增加 `type` 和 `supported_agents`
  - [ ] 检查其他 skill 的 frontmatter 是否一致
- [ ] **Day 3**：验证安装脚本与 agent-workflow.yaml 的路径一致性
  - [ ] 分别使用 `--system`、`--project`、`--agent kimi` 安装
  - [ ] 确认 `orchestrate.py` 的调用路径在所有安装模式下均有效
- [ ] **Day 4-5**：运行所有 Python 脚本的 `--help` 验证，记录异常

### Phase 2：可执行脚本封装与健康检查（1 周）

- [ ] **Day 1-2**：编写 `scanning-for-secrets/scripts/scan.sh`
  - [ ] 支持扫描 staged files 和工作区文件
  - [ ] 支持输出 JSON/Markdown 格式
  - [ ] 更新 SKILL.md 使用说明
- [ ] **Day 3**：编写 `github-cli-skill/scripts/check-auth.sh`
  - [ ] 检测 `gh` 是否安装
  - [ ] 检测 `gh auth status`
  - [ ] 输出友好的配置建议
- [ ] **Day 4**：编写 `spark-task-init-skill/scripts/check-env.sh`
  - [ ] 检测 `spark` 命令
  - [ ] 检测 `kimi` 命令
  - [ ] 输出安装指南链接
- [ ] **Day 5-7**：编写仓库级 `test-skills.sh`
  - [ ] 检查所有 SKILL.md 的存在性和 frontmatter
  - [ ] 检查所有 Python 脚本的可导入性
  - [ ] 检查所有相对路径引用的有效性

### Phase 3：工程化与 CI 建设（1-2 周）

- [ ] **Week 1**：
  - [ ] 抽取 `common/` 或 `lib/` 共享模块（git 操作、状态管理、日志）
  - [ ] 重构 `github-task-workflow` 和 `local-workflow` 使用共享模块
  - [ ] 编写 `.github/workflows/skill-health-check.yml`
- [ ] **Week 2**：
  - [ ] 建立 `skill-template/` 标准模板
  - [ ] 更新 README 中的「添加新 Skill」指南
  - [ ] 运行全量回归测试，确保所有改动没有破坏现有功能

---

## 六、可直接执行的修复命令参考

### 修复 `github-task-workflow` 的 create_issue 问题

```bash
cd /Users/patrick/workspace/variableway/innate/fire-skills/github-task-workflow/scripts

# 备份旧文件
mv create_issue.py create_issue_old.py

# 使用 fixed 版本作为正式版本
mv create_issue_fixed.py create_issue.py

# 检查 task_watcher.py 的导入是否需要调整
sed -i '' 's/from create_issue import create_issue, get_git_remote/from create_issue import create_issue, get_git_remote  # verify after fix/' task_watcher.py

# 测试导入
python3 -c "from task_watcher import TaskWatcher; print('OK')"

# 删除旧备份（确认无误后）
rm create_issue_old.py
```

### 快速健康检查命令

```bash
cd /Users/patrick/workspace/variableway/innate/fire-skills

# 1. 检查所有 skill 是否有 SKILL.md
for dir in */; do
  [ -f "$dir/SKILL.md" ] && echo "✅ $dir" || echo "❌ $dir missing SKILL.md"
done

# 2. 检查所有 Python 脚本是否能导入
find . -name "*.py" -not -path "*/__pycache__/*" | while read f; do
  python3 -c "import sys; sys.path.insert(0, '$(dirname "$f")'); import $(basename "$f" .py)" 2>/dev/null && echo "✅ $f" || echo "❌ $f import failed"
done

# 3. 检查 Markdown 中的死链接（简单版）
grep -rnoP '\[.*?\]\(\K[^)]+' . --include="*.md" | grep "\.md" | while read line; do
  file=$(echo "$line" | cut -d: -f1)
  link=$(echo "$line" | cut -d: -f3-)
  # 相对路径解析逻辑（简化版）...
done
```

---

## 七、总结

### 整体评价

`fire-skills` 是一个**设计思路清晰、覆盖场景全面**的 Skill 仓库。大部分 Skill 的文档质量高，安装脚本也较为完善。

**主要优点**：
1. 统一使用 `SKILL.md` 作为入口，兼容 Claude Code、Kimi、Codex、OpenCode 等多种 Agent
2. `github-task-workflow` 和 `local-workflow` 形成了很好的互补，覆盖有/无 GitHub 的两种场景
3. `innate-frontend` 和 `tauri-desktop-app` 的文档详尽，可作为团队开发规范直接使用
4. `install.sh` 和 `install.ps1` 提供了跨平台的系统级和项目级安装能力

**核心问题**：
1. **`github-task-workflow` 存在代码级 bug**，`task_watcher.py` 因导入缺失函数而无法运行
2. **缺少统一的测试/验证机制**，问题只有在运行时才会暴露
3. **部分纯文档型 skill 缺少可执行脚本**，降低了 Agent 自动化调用的便利性
4. **工程化程度不足**，没有 CI/CD 来自动保障 skill 质量

### 建议优先级

**最高优先级**：修复 `github-task-workflow` 的 bug，这是当前唯一会导致功能完全失效的问题。  
**次高优先级**：建立 `test-skills.sh` 健康检查脚本，避免类似问题再次发生。  
**中长期**：完善 CI/CD、抽取共享模块、统一 skill 模板，将仓库从「可用」提升到「工程化」。

---

*报告生成时间：2026-04-17*  
*分析范围：`../fire-skills` 目录下全部 8 个 Skill*  
*测试方法：文档审查、脚本 `--help` 验证、Python 导入测试、文件存在性检查*

---

## 八、如何构建自己的工作流程

基于对 `fire-skills`（8 个 Skill）和 `superpowers`（14 个技能）的完整分析，结合 `working-os.md` 中定义的 Personal Workspace OS 理念，以下是构建个人工作流的具体建议。

### 8.1 核心原则：三层工作流架构

```
┌─────────────────────────────────────────────────────────────────┐
│                    Layer 3: 质量保障层                           │
│    Superpowers 的纪律技能：TDD / Code Review / Verification     │
│    → 只在"正式开发"时启用，日常实验不强制                        │
├─────────────────────────────────────────────────────────────────┤
│                    Layer 2: 流程编排层                           │
│    fire-skills 的工作流：local-workflow / github-task-workflow  │
│    → 任务的创建、追踪、完成全生命周期                             │
├─────────────────────────────────────────────────────────────────┤
│                    Layer 1: 执行层                               │
│    场景化 Skill：innate-frontend / tauri-desktop-app / ...      │
│    → 具体领域的开发规范和工具集                                  │
└─────────────────────────────────────────────────────────────────┘
```

**关键洞察**：不要试图一次性启用所有 Skill。按场景分层，按需激活。

### 8.2 三种工作模式与推荐 Skill 组合

#### 模式 A：快速实验（ideas / 调研 / 分析）

**场景**：写分析文档、调研技术方案、探索新想法（如 `chat-plugin.md` 这类工作）

**推荐组合**：
```
local-workflow（任务追踪）
  + ai-config（AI Provider 配置）
  + scanning-for-secrets（提交前安全检查）
```

**不需要**：Superpowers 的 brainstorming / writing-plans / TDD。实验阶段不需要重流程。

**工作流**：
1. 用 `local-workflow` 的 `tracing.py init` 创建任务
2. 直接在 `ideas/` 目录下写分析文档
3. 完成后 `tracing.py finish` 关闭任务
4. 如果有代码，提交前跑 `scanning-for-secrets`

#### 模式 B：功能开发（apps / products）

**场景**：基于 `@innate/ui` 开发前端功能、开发 Tauri 桌面应用

**推荐组合**：
```
Superpowers（brainstorming → writing-plans → subagent-driven-development → verification）
  + innate-frontend 或 tauri-desktop-app（领域规范）
  + github-task-workflow 或 local-workflow（任务追踪）
  + scanning-for-secrets（安全检查）
```

**工作流**：
1. Superpowers brainstorming → 产出设计文档
2. writing-plans → 产出实施计划
3. subagent-driven-development → 逐任务实现（三重审查）
4. verification-before-completion → 最终验证
5. finishing-a-development-branch → 合并/PR

#### 模式 C：工具维护（fire-skills 自身的迭代）

**场景**：修复 Skill bug、添加新 Skill、优化现有 Skill

**推荐组合**：
```
local-workflow（轻量追踪）
  + Superpowers 的 writing-skills（新 Skill 创建方法论）
  + scanning-for-secrets（安全检查）
```

**工作流**：
1. 从 `skill-setup-analysis.md` 的改进建议中选任务
2. 用 `local-workflow` 追踪
3. 修复/开发
4. 用 `test-skills.sh`（待建）验证

### 8.3 "不要过度工程化"原则

Superpowers 的 14 个技能中，**不是每个都需要在每次开发中使用**。以下是精简指南：

| Superpowers 技能 | 何时启用 | 何时跳过 |
|------------------|----------|----------|
| brainstorming | 新功能、架构决策 | 改 bug、小改动、实验 |
| writing-plans | 超过 3 步的任务 | 1-2 步的简单修改 |
| subagent-driven-development | 正式功能开发 | 快速原型、实验 |
| executing-plans | 不支持 subagent 的平台 | 有 subagent 时优先用上面的 |
| using-git-worktrees | 长期特性分支 | 短期修复、实验 |
| test-driven-development | 核心业务逻辑 | 实验性代码、一次性脚本 |
| systematic-debugging | 复杂 bug | 简单 typo / 配置错误 |
| verification-before-completion | **始终启用** | — |
| requesting-code-review | 团队项目、重要功能 | 个人实验 |
| writing-skills | 创建新 Skill 时 | — |

### 8.4 从零开始构建工作流的路径

如果你还没有建立自己的工作流，建议按以下顺序逐步引入：

```
Week 1：基础层
  ├── 安装 ai-config，配置好 AI Provider
  ├── 安装 local-workflow，用它追踪日常任务
  └── 习惯"每个任务都有 init → finish"的节奏

Week 2：安全层
  ├── 安装 scanning-for-secrets
  ├── 配置 pre-commit hook（或手动在提交前扫描）
  └── 养成"提交前检查"的习惯

Week 3-4：开发流程层
  ├── 安装 Superpowers
  ├── 先只用 verification-before-completion（最简单、最值）
  ├── 再尝试 brainstorming + writing-plans（对中大型任务）
  └── 最后尝试 subagent-driven-development（对正式开发）

Week 5+：领域扩展层
  ├── 按需安装 innate-frontend / tauri-desktop-app
  ├── 按需安装 github-task-workflow（需要 GitHub 协作时）
  └── 用 writing-skills 创建自己的专属 Skill
```

---

## 九、如何简化 Superpowers 的流程

Superpowers 的核心问题是**对小任务太重**——brainstorming 的 9 步流程、subagent-driven-development 的三重审查、TDD 的严格 RED-GREEN-REFACTOR。这些在大型项目中很有价值，但在日常快速开发中会显著降低效率。

### 9.1 简化策略：分级流程

把任务分为 3 个等级，每个等级走不同深度的流程：

```
┌──────────────────────────────────────────────────────────────────┐
│  Level 3: 正式开发（需要 Superpowers 完整流程）                   │
│  触发条件：新功能 / 架构变更 / 涉及核心业务逻辑                   │
│  流程：brainstorming → plans → subagent → review → verify        │
│  质量门控：TDD + 三重审查 + verification                          │
├──────────────────────────────────────────────────────────────────┤
│  Level 2: 常规开发（精简 Superpowers 流程）                      │
│  触发条件：Bug 修复 / 小功能 / 重构 / 文档更新                    │
│  流程：简述意图 → 直接写计划 → executing-plans → verify           │
│  质量门控：写测试 + 自审 + verification                           │
├──────────────────────────────────────────────────────────────────┤
│  Level 1: 快速操作（不启用 Superpowers）                          │
│  触发条件：改配置 / 修 typo / 实验性代码 / 临时脚本               │
│  流程：直接做 → 跑一下看看 → 提交                                 │
│  质量门控：verification-before-completion（仅此一个）              │
└──────────────────────────────────────────────────────────────────┘
```

### 9.2 具体简化方案

#### 简化一：brainstorming 的"快速通道"

Superpowers 当前**禁止跳过 brainstorming**，但对小改动这是过度流程。

**建议修改**：在 `using-superpowers` 元技能中增加判定逻辑：

```
判定条件（满足任一即走快速通道）：
  - 改动涉及文件 ≤ 3 个
  - 预估改动行数 ≤ 50 行
  - 不涉及架构/接口变更
  - 用户明确说"小改动"/"快速修复"

快速通道流程：
  1. 一句话描述意图（替代 9 步 brainstorming）
  2. 直接进入 writing-plans 或 executing-plans
  3. verification-before-completion
```

#### 简化二：合并 subagent-driven-development 和 executing-plans

当前两个执行技能完全独立，体验差距巨大。建议：

```
统一为 "executing-tasks" 技能：

if subagent 可用:
    分派 subagent 实现
    自动自审（替代三重审查中的规格审查——代码质量审查保留）
else:
    当前 session 直接执行
    每个任务完成后自审一次

无论哪种模式，都保留：
  - verification-before-completion（不可跳过）
  - 完成后可选的 requesting-code-review
```

**效果**：三重审查简化为"实现 + 自审 + 可选外部审查"，token 消耗降低约 50%。

#### 简化三：TDD 的分级应用

```
核心逻辑层（必须 TDD）：
  - 业务逻辑 / 数据处理 / 算法
  - 先写失败测试 → 实现 → 通过

UI 层（建议但不强求）：
  - 组件渲染 / 样式 / 交互
  - 实现后补关键测试即可

配置/脚本层（不需要 TDD）：
  - 配置文件 / 部署脚本 / 一次性脚本
  - 跑通即可
```

#### 简化四：减少文档生成量

Superpowers 要求生成大量设计文档和计划文件。对于小项目：

```
文档生成规则：
  Level 3 任务 → 完整文档（design.md + plan.md + review notes）
  Level 2 任务 → 只生成 plan.md（直接在 plan 中包含设计意图）
  Level 1 任务 → 不生成文档，只在 git commit message 中描述
```

### 9.3 Superpowers 精简配置建议

可以在安装 Superpowers 时创建一个"精简模式"配置文件：

```yaml
# .superpowers-lite.yaml
# 覆盖默认行为，适用于个人/小团队快速开发

defaults:
  brainstorming:
    skip_for_trivial: true          # 小改动跳过
    max_steps: 5                     # 从 9 步缩减到 5 步
  subagent_driven_development:
    enable_parallel: true            # 允许并行 subagent
    review_levels: 1                 # 从三重审查减为单次自审
    max_retries: 1                   # 审查失败最多重试 1 次
  tdd:
    required_for: ["core_logic"]     # 只在核心逻辑强制 TDD
  verification:
    always_enabled: true             # 唯一不可关闭的技能
  documentation:
    level_3: full                    # 完整文档
    level_2: plan_only               # 只写计划
    level_1: commit_message_only     # 只写 commit message
```

### 9.4 与 fire-skills 的整合方案

Superpowers（通用开发流程）和 fire-skills（特定领域工具）可以互补：

```
Superpowers 负责：
  - 怎么做开发（流程、质量、审查）
  - 跨领域的通用方法论

fire-skills 负责：
  - 做什么开发（领域知识、规范、工具）
  - 特定场景的最佳实践

整合示例（开发一个 Tauri 桌面应用）：
  Superpowers brainstorming → 确定"要做什么"
  tauri-desktop-app SKILL.md → 确定"怎么写 Tauri 代码"
  Superpowers writing-plans → 拆解任务
  Superpowers executing → 逐任务实现
  innate-frontend SKILL.md → 确定"UI 组件怎么用"
  Superpowers verification → 验证完成
```

### 9.5 一句话总结

**Superpowers 的价值在于"纪律"而非"仪式"。** 简化的核心思路是：保留纪律（verification 永不关闭），减少仪式（小任务不需要 9 步 brainstorming）。分级流程让 Agent 自动判断任务等级，匹配对应深度的流程——这才是真正可日常使用的工作流系统。

---

*补充分析时间：2026-04-15*
*参考文档：`skill-setup-analysis.md`、`skill-recommendations-by-domain.md`、`working-os.md`*
