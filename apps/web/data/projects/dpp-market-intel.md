# AGENTS

## Project Goal

`dpp-market-intel` 是一个静态站优先的 DPP / CBAM 市场情报项目。

当前主目标：

- 以 `frontend/out` 作为默认发布产物
- 以前端静态 JSON 契约作为页面和未来 API 的统一数据格式
- 后端保留 FastAPI + provider 架构，作为数据聚合、导出和未来动态接口能力

## Working Rules

1. 前端默认不能依赖运行时后端接口。
2. 新增前端数据字段时，必须先更新 `docs/json-structure.md` 和 `docs/api-spec.md`。
3. 静态 JSON 是正式契约，不是临时文件。
4. 后端新增数据来源时，优先通过 provider 扩展，而不是直接改 service 或 route。
5. 不要破坏 `pnpm build` 生成纯静态 `out/` 的能力。

## Build Flow

标准流程：

1. 后端 provider 聚合数据
2. `backend/scripts/export_static_data.py` 导出 `frontend/public/data/*.json`
3. 前端 `pnpm build` 读取静态 JSON
4. 产出 `frontend/out`

## Provider Rules

### Dashboard

- 当前 provider: `csv`
- 当前已实现：`csv`、`sqlite`
- 未来可扩展：`database`、`remote_api`

### News

- 当前 provider: `json_seed`
- 当前已实现：`json_seed`、`rss`
- 未来可扩展：`crawler`、`cms`

新增 provider 时：

- 在 `backend/app/providers/` 下实现
- 在 `backend/app/providers/factory.py` 注册
- 保持输出 schema 不变

## Deployment Rules

- GitHub Pages 使用 `.github/workflows/deploy-pages.yml`
- GitCode Pages 直接发布 `frontend/out`
- 如果部署在仓库子路径下，使用 `BASE_PATH`

## Key Files

- 项目说明：[README.md](/Users/patrick/workspace/cew-biz/dpp-market-intel/README.md)
- 文档入口：[docs/README.md](/Users/patrick/workspace/cew-biz/dpp-market-intel/docs/README.md)
- API 定义：[docs/api-spec.md](/Users/patrick/workspace/cew-biz/dpp-market-intel/docs/api-spec.md)
- JSON 契约：[docs/json-structure.md](/Users/patrick/workspace/cew-biz/dpp-market-intel/docs/json-structure.md)
