# innate-wip — Writing 静态站（@innate/wip）

独立 GitHub 仓（[variableway/innate-wip](https://github.com/variableway/innate-wip)），以 **git submodule** 嵌在 innate-fe-base（fe-templates）的 `apps/innate-wip`。Vite + React 19 + TanStack Router（hash 路由）的纯静态 SPA，既是写作内容的浏览工作台，也是 pages-kit 模板体系的第一个 domain 实例。

## 快速开始

在 **fe-templates 根**（workspace 能解析 `@innate/ui`）：

```bash
pnpm --filter @innate/wip dev
# → http://localhost:4016/#/   只看本仓 use-cases + content

VITE_WRITING_SOURCE=docs pnpm --filter @innate/wip dev
# 预览 fe-base Pages 形态：内联整棵父仓 docs/
```

或在本目录直接 `./dev.sh`（自动选择 workspace 根或本仓 node_modules 启动）。

## 内容源与构建矩阵

内容在**构建期**经 `import.meta.glob(?raw)` 内联进 bundle（运行时无 fs、无网络请求）。
`vite.config.ts` 用 `#writing-files` alias 按环境变量切换两个打包模块：

| 构建 | VITE_WRITING_SOURCE | 内联内容 |
| --- | --- | --- |
| 本仓 Pages（默认） | 未设置 | 本仓 `use-cases/` + `content/`（只打包本仓，不进父仓 docs） |
| fe-base Pages | `docs` | 父仓 `docs/` 整棵（context / idea / modules / specs / usage / use-cases …） |

- 当前演示内容在 `content/demo/`（6 篇 md/mdx，含 mermaid / MDX 交互示例）；`use-cases/` 为空占位（`.gitkeep`）。
- Markdown 渲染：react-markdown + remark-gfm + rehype-highlight + rehype-slug；mermaid 以 ESM min 产物别名接入（`MermaidBlock`，主题跟随站点）。

## 路由与 UI

- hash 路由（`createHashHistory`）：`/`、`/writing`（列表）、`/writing/$slug`（详情）、`/landing`。
- 写作工作台 UI：可折叠宽侧栏（folder-nav 目录树导航）、resizable 双栏、文章 TOC、分类/标签彩色 badge（生成 hue）、正文派生摘要、阅读宽度、writing 状态。

## 目录

```
├── src/
│   ├── router.tsx / main.tsx            # hash 路由 + 入口
│   ├── pages/writing/                   # 列表页 + [slug] 详情页
│   ├── components/                      # markdown 渲染、mermaid、TOC、writing UI
│   ├── lib/content/                     # 内容管线：#writing-files 两模式、parse-post、folder-tree、filter
│   └── test/                            # vitest（base-path / content / docs-vault / filter / folder-tree / label-color / mdx-source）
├── content/                             # 本仓内容源（demo/）
├── use-cases/                           # 本仓 use-case 内容源（当前空）
├── pages/                               # plugin.registry 声明的 pages（home.md 占位）
├── site/                                # scripts/write-content-index.mjs 的静态输出（content 副本 + index.json）
├── plugin.registry.yaml                 # innate.domain-pages.v1 清单（见下）
├── scripts/write-content-index.mjs      # content/ → site/content/ + index.json
└── dev.sh                               # 双路径启动器
```

## plugin.registry.yaml 与 pages-kit

`plugin.registry.yaml`（协议 `innate.domain-pages.v1`）把本站声明为一个 domain-pages 实例：

- `template`：模板来自 fe-templates 的 rolling release **`pages-kit`**（`writing-shell.zip`，由父仓 `publish-writing-shell.yml` 发布，内含 UI zip 与 innate-fe-cli 二进制），本仓构建时可下载该 release；
- `domains`：`writing` —— `content/` 挂载为 content，路径 `/writing`；
- `pages.outDir: site`：`scripts/write-content-index.mjs` 按 registry 输出静态页目录。

## 部署（两条线）

| 线 | 触发 | 构建模式 | 产物去向 |
| --- | --- | --- | --- |
| **本仓 Pages**：`.github/workflows/deploy-pages.yml` | 本仓 push（`use-cases/**`、`src/**`、`vite.config.ts` 等变更） | 默认模式；sparse 拉取 fe-templates 的 `@innate/ui`（临时 templates workspace，不 clone 整仓） | 本仓 GitHub Pages |
| **fe-base Pages**：父仓 `deploy-writing-pages.yml` | 父仓 push（`apps/innate-wip/**` submodule 指针、`docs/**`、`packages/ui/**` 变更） | `VITE_WRITING_SOURCE=docs`（整棵 docs/） | fe-base GitHub Pages |

两条线均为 `PUBLIC_PATH=./` 相对路径构建 + hash 路由，天然适配 Pages 子路径；build 还会复制 `index.html → 404.html` 兜底。

## 命令

```bash
pnpm --filter @innate/wip dev            # dev（4016）；docs 模式见上
pnpm --filter @innate/wip build          # vite build + 404 兜底 → dist/
pnpm --filter @innate/wip preview        # 预览 dist
pnpm --filter @innate/wip typecheck      # tsc --noEmit
pnpm --filter @innate/wip lint           # oxlint src
pnpm --filter @innate/wip test           # vitest run
node scripts/write-content-index.mjs     # 刷新 site/ 静态输出
```

## 与 fe-templates 的关系

- **submodule + workspace 双重身份**：git 上是父仓的 submodule；pnpm 上是父仓 workspace 成员（`apps/*`），依赖 `@innate/ui: workspace:*`——共享包不复制。
- 本仓独立 CI 不 clone 父仓：仅 sparse 检出 `packages/ui`（含 lockfile）组装最小 workspace 后构建。
- UI token / 主题跟随 `@innate/ui`（D0 唯一来源在父仓 `packages/ui/src/globals.css`）。
