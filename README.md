# innate-wip — Writing 静态站

独立 GitHub 仓，嵌在 fe-templates 的 `apps/innate-wip`。Vite 静态站，入口就是笔记工作区。

内容源由 `VITE_WRITING_SOURCE` 决定：

| 构建 | 扫描 |
| --- | --- |
| 默认 / 本仓 Pages | `use-cases/`（本仓）以及父仓 `docs/use-cases/` |
| `VITE_WRITING_SOURCE=docs`（fe-base Pages） | 仓库根 `docs/` |

## 本机

在 **fe-templates 根**（workspace 能解析 `@innate/ui`）：

```bash
pnpm --filter @innate/wip dev
# → http://localhost:4016/#/   只看 use-cases

VITE_WRITING_SOURCE=docs pnpm --filter @innate/wip dev
# 预览 fe-base Pages：整棵 docs/
```

或在本目录：`./dev.sh`

## GitHub Pages

- **innate-fe-base**：根 workflow `deploy-writing-pages.yml` 以 `VITE_WRITING_SOURCE=docs` 构建本 app
- **本仓单独 push**：只打包 `use-cases/`
