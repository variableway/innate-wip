# GitHub Pages Deployment Guide

## 前置条件：INNATE_BASE_TOKEN secret

本仓库的 workspace 依赖（`@innate/ui`、`@innate/utils`、`@innate/tsconfig`）
**直接引用** innate-base monorepo 根目录的 `../../packages/*`，本仓库内没有副本。
GitHub Actions 会从私有仓库 `variableway/innate-fe-templates` 稀疏检出这三个包，
还原 monorepo 目录布局后再构建。

因此必须先在 **本仓库 Settings → Secrets and variables → Actions** 中配置：

- **`INNATE_BASE_TOKEN`**：对 `variableway/innate-fe-templates` 有 read 权限的
  PAT（Fine-grained PAT 勾选该仓库的 Contents: read 即可）。

配置命令（需先有 PAT）：

```bash
gh secret set INNATE_BASE_TOKEN --repo variableway/innate-wip
```

未配置时，workflow 会在 "Checkout innate-base shared packages" 步骤失败。

## 启用 GitHub Pages

如果部署失败并显示 404 错误，需要手动启用 GitHub Pages：

### 方法 1：通过 GitHub 网站启用（推荐）

1. 访问仓库设置页面：
   ```
   https://github.com/qdriven/innate-websites/settings/pages
   ```

2. 在 "Build and deployment" 部分：
   - **Source**: 选择 `GitHub Actions`

3. 点击 **Save**

4. 重新运行失败的 workflow：
   - 访问 Actions 页面
   - 找到失败的 workflow
   - 点击 "Re-run jobs"

### 方法 2：通过 GitHub CLI 启用

```bash
gh api \
  -X POST \
  -H "Accept: application/vnd.github.v3+json" \
  /repos/qdriven/innate-websites/pages \
  -f source[branch]=main \
  -f source[path]=/
```

### 方法 3：通过 API 启用

```bash
curl -X POST \
  -H "Authorization: token YOUR_GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/qdriven/innate-websites/pages \
  -d '{"source":{"branch":"main","path":"/"}}'
```

## 部署状态

启用后，部署将自动进行。检查状态：

```
https://github.com/qdriven/innate-websites/actions
```

部署成功后，网站地址：

```
https://qdriven.github.io/innate-websites/
```
