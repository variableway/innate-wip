# AGENTS.md

> **项目事实来源：** [`docs/project/index.md`](docs/project/index.md) — spec、issues、多 Agent 日志均在该目录。

## 入口

1. 读 [`docs/project/index.md`](docs/project/index.md)
2. 读当前 [`docs/project/issues/<id>.md`](docs/project/issues/)
3. 读 [`docs/project/tasks/issues/<id>.md`](docs/project/tasks/issues/) **最后一条**

## 事实来源

- 范围与验收：[`docs/project/spec/README.md`](docs/project/spec/README.md)
- 合约：[`docs/project/spec/contracts/workspace-io-v1.md`](docs/project/spec/contracts/workspace-io-v1.md)

## 当前实现（仅已落地）

- CLI 当前对外命令：
  - `config`, `doctor`, `idea`, `daily`, `completion`
- `config` 已是 domain：
  - `internal/config/model.go`
  - `internal/config/service.go`
  - `internal/config/viper_repo.go`
  - `internal/config/config_service.go`
- `workspace` / `idea` / `daily` 已按 domain 结构实现（model + service + repo/infra）
- `daily` 已改为按日期文件：
  - `daily/YYYY-MM-DD.md`
  - 支持 `--date` 与 `--reset`
- `today.md` 不再作为唯一数据源（可存在但不作为核心读取目标）
- workspace 目录语义已统一：
  - 规范键：`workspace.root`
  - `data_dir` / `app.data_dir` 作为兼容别名，会映射到 `workspace.root`

## 交付

- 分支 `feature/<issue>-<agent>`；合并后追加 task log

## 禁止

- 不要创建 `.agents/` 或第二套 spec
- 不要未经 issue 扩大范围
- E2E 前不要执行 `cap-docs-purge`

## 代码根

Go 项目：项目根目录（`go build .` 在根目录执行）

用户 CLI 手册：[`docs/usage/workspace.md`](docs/usage/workspace.md)
