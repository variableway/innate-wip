# innate-wip — Writing 静态站

独立 GitHub 仓（`variableway/innate-wip`），嵌在 fe-templates 的 `apps/innate-wip`。  
这就是 Writing：Vite 静态站，入口就是笔记工作区，直接打 GitHub Pages。不挂 webshell，也不走 pages-kit。

```
content/*.md          # 文章
src/                  # UI（@innate/ui）
.github/workflows/deploy-pages.yml
```

## 本机

在 **fe-templates 根**（workspace 能解析 `@innate/ui`）：

```bash
pnpm --filter @innate/wip dev
# → http://localhost:4016/#/
```

或在本目录：`./dev.sh`

## GitHub Pages

本仓 push `main` 即构建。CI 会 sparse checkout `innate-fe-templates` 里的 `@innate/ui`（不是整仓），然后 `pnpm build`，上传 `dist/`。

站点：`https://<owner>.github.io/<repo>/#/`
