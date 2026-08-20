# Deployment

共享包 `@innate/ui` / `@innate/tsconfig` 不在本仓库。本地用软链，CI 用同一脚本
`scripts/link-shared-packages.sh` 链到 `variableway/innate-fe-templates`。

## 本地

```bash
pnpm link:packages    # 默认链到 innate-works/base/innate-fe-base
pnpm install
pnpm dev              # http://localhost:3000
```

覆盖路径：`INNATE_FE_BASE=/path/to/innate-fe-base pnpm link:packages`

## 必须配置的 secret：INNATE_BASE_TOKEN

GitHub Actions 和 Cloudflare Pages 都要能读私有仓库 `variableway/innate-fe-templates`。

在 **本仓库 Settings → Secrets and variables → Actions** 中配置：

- **`INNATE_BASE_TOKEN`**：对该私有仓库有 Contents: read 的 PAT

```bash
gh secret set INNATE_BASE_TOKEN --repo variableway/innate-wip
```

未配置时，workflow 会在 Checkout shared packages 步骤失败。

---

## GitHub Pages

仓库 Pages 已设为 **Source: GitHub Actions**，站点：

https://variableway.github.io/innate-wip/

构建：`Deploy to GitHub Pages`（push `main`）或 `Fetch Issues and Deploy to Pages`（定时）。

流程：checkout 本仓库 → 稀疏检出 `innate-fe-templates` → `link-shared-packages.sh` →
`pnpm install` → `pnpm --filter @innate/web build:static`（`GITHUB_PAGES=true`，带
`/innate-wip` basePath）→ `actions/deploy-pages`。

CI 里脚本会 **copy** 共享包（不是 symlink），避免 Next 沿着软链走到另一个仓库找依赖。

首次若 404，在仓库 Settings → Pages 把 Source 选成 GitHub Actions。

---

## Cloudflare Pages

GitHub Pages 用 `basePath=/innate-wip`；Cloudflare 默认挂在站点根路径，**不要**设
`GITHUB_PAGES`。两种接入方式：

### 方式 A：GitHub Actions 部署（推荐）

和 Pages 同一套构建，只是产物交给 wrangler。需要：

1. Cloudflare 里创建一个 Pages 项目，名字 `innate-wip`（可先空项目）
2. 本仓库 Secrets：
   - `CLOUDFLARE_API_TOKEN`（Account.Cloudflare Pages: Edit）
   - `CLOUDFLARE_ACCOUNT_ID`
3. 本仓库 Variables：`ENABLE_CLOUDFLARE=true`

```bash
gh secret set CLOUDFLARE_API_TOKEN --repo variableway/innate-wip
gh secret set CLOUDFLARE_ACCOUNT_ID --repo variableway/innate-wip
gh variable set ENABLE_CLOUDFLARE --body true --repo variableway/innate-wip
```

之后 `Deploy to Cloudflare Pages` 会在 push `main` 时跑。不设 variable 时 job 会被跳过。

### 方式 B：Cloudflare 直接连 GitHub 仓库

Dashboard → Pages → Connect git → `variableway/innate-wip`：

| 项 | 值 |
|---|---|
| Framework | None |
| Build command | 见下方 |
| Build output directory | `apps/web/dist` |
| Root directory | `/` |
| Environment variables | `INNATE_BASE_TOKEN`、`NODE_VERSION=20` |

Build command：

```bash
corepack enable && corepack prepare pnpm@11.20.0 --activate && bash scripts/link-shared-packages.sh && pnpm install --no-frozen-lockfile && pnpm --filter @innate/web build:static
```

CF 构建机没有本地 `innate-fe-base`，脚本会用 `INNATE_BASE_TOKEN` 稀疏克隆
`innate-fe-templates` 再做软链。不要设置 `GITHUB_PAGES`。
