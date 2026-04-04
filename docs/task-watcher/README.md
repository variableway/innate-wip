# Task Watcher

`@innate/task-watcher` 是一个本地守护进程 CLI 工具，用于在本地手动触发类似 GitHub Actions 的数据同步工作流。

## 功能

运行一次完整的本地数据同步流程：

1. **Fetch Projects** - 从 GitHub 拉取组织下的所有仓库/项目列表
2. **Fetch Issues** - 从 GitHub 拉取所有仓库的 Issues
3. **Fetch AGENTS.md** - 从 GitHub 拉取所有项目的 AGENTS.md 文件
4. **Generate Weekly Summary** - 生成本周的进度摘要
5. **Commit & Push** - 如果数据有变更，自动提交并推送到 GitHub

## 安装

该包已作为 pnpm workspace 的一部分，无需额外安装。

## 使用

### 从仓库根目录运行

```bash
pnpm --filter @innate/task-watcher task-watcher sync
```

### 或直接运行 bin 文件

```bash
node packages/task-watcher/bin/cli.js sync
```

### 设置全局快捷命令（可选）

在根目录 `package.json` 的 `scripts` 中已可添加：

```json
{
  "scripts": {
    "sync": "pnpm --filter @innate/task-watcher task-watcher sync"
  }
}
```

然后直接运行：

```bash
pnpm sync
```

## 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `GITHUB_TOKEN` | GitHub Personal Access Token（访问私有仓库时需要） | - |
| `GITHUB_ORG` | GitHub 组织名称 | `variableway` |

## 工作流程

```
用户运行 task-watcher sync
    ↓
检查并初始化 data 目录
    ↓
Fetch Projects → 更新 apps/web/data/repos.json (仓库列表)
    ↓
Fetch Issues → 更新 apps/web/data/issues.json
    ↓
Fetch AGENTS.md → 更新 apps/web/data/projects.json (项目详情)
    ↓
Generate Weekly → 更新 apps/web/data/weekly.json
    ↓
git diff 检查是否有变更
    ↓
有变更 → git add → git commit → git push
无变更 → 跳过提交
```

## 与 GitHub Actions 的关系

| | GitHub Actions | Task Watcher |
|--|----------------|--------------|
| 触发方式 | 定时（每2小时） | 手动触发 |
| 运行环境 | GitHub 云端 | 本地机器 |
| 功能 | 自动同步 + 自动部署 | 本地同步 + 提交 |
| 适用场景 | 无人值守自动更新 | 开发前手动拉取最新数据 |

## 注意事项

- 运行前请确保本地 git 仓库已配置好 `user.name` 和 `user.email`
- 如果没有任何数据变更，不会创建空 commit
- 该工具会直接操作 `apps/web/data/` 目录并执行 `git push`，请确保在正确的分支上运行
