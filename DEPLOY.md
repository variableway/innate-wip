# GitHub Pages Deployment Guide

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
