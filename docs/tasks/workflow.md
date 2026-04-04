# 工作流相关的任务

## Task 1: 没有自动fetch issues的脚本

1. 请帮我实现自动fetch issues的脚本
2. 另外github action中的任务，是否可以调整到2个小时跑一次


## Task 2: 实现一个daemon进程，用于自动fetch issues

1. 请在这个mono repo中创建一个daemon进程，用于自动fetch issues
2. 这个daemon进程需要自己手动出发，同时如果触发了会在本地类似执行github action的工作，
   例如fetch issues，更新本地数据库，提交数据。
3. 这个实现在packages/ 这个目录中实现，可以采用cli模式，实现文档需要写入到docs/目录中，创建一个新目录中完成比如 task-watcher类似的名字


## Task 3: 实现一个补充提交github issue的工具

1. 读取task文件，按照markdown 内容提交到github issue
2. 按照内容解析，task 1内容就是一个issue，task2就是另外一个issue
3. 过程中是否可以调用AI让AI告诉他之前处理这个ISSUE做的事然后做一些补充呢？是否可以实现这个过程？
4. 需要给出一份整个功能的分析报告，是否可行？有个实现计划，然后在继续实现，先不写代码

实际场景可能是这样：
1. 先写了Task 让AI 执行代码，但是这个Task 内容是自己写的，AI执行时候补充的内容没有被更新
2. 并且这个Task 没有提交作为Github的Issue进行保存
3. 那么无如果需要补充提交这个Task 到Github的Issue中，但是有需要把一些当时AI产生的内容补充回来，这个过程可以实现吗？我问的问题主要是这个，不是从github issue拉下来在做补充

## Task 4: fetch project support ✅

**任务**: 完成 task-watcher daemon 的所有数据获取功能

**已完成内容**:

1. **fetch projects** ✅ 
   - 脚本: `apps/web/scripts/fetch-projects.js`
   - 功能: 从 GitHub organization 获取所有 repositories
   - 结果: 成功获取 11 个项目

2. **fetch agents** ✅
   - 脚本: `apps/web/scripts/fetch-agents.js`
   - 功能: 获取每个项目的 AGENTS.md 文件并解析
   - 结果: 成功获取 7/11 个项目的 AGENTS.md

3. **generate weekly report** ✅
   - 脚本: `apps/web/scripts/generate-weekly.js`
   - 功能: 分析本周完成的 issues，生成双语 AI 分析报告
   - 结果: 成功生成第 14 周周报（6 个 issues）

**验证方式**:
```bash
cd packages/task-watcher
export GITHUB_TOKEN="your_token"
node bin/cli.js sync
```

**运行结果**:
```
🚀 Task Watcher Daemon started
📡 Step 1/4: Fetching projects from GitHub... ✅
📡 Step 2/4: Fetching issues from GitHub... ✅
📡 Step 3/4: Fetching AGENTS.md files... ✅
📡 Step 4/4: Generating weekly summary... ✅
🔍 Checking for data changes...
📝 Changes detected, committing and pushing...
✅ Data committed and pushed successfully!
🎉 Task Watcher Daemon finished successfully.
```

## Task 5: Github Token 问题 ✅

**问题**: GitHub Token 认证失败，API 返回 401 Unauthorized

**原因**: 当前 shell session 中的 GITHUB_TOKEN 环境变量与 ~/.zshrc 中配置的新 token 不一致

**解决方案**: 
1. 确认 ~/.zshrc 中配置的 token 是最新的
2. 在运行脚本前显式导出正确的 GITHUB_TOKEN 环境变量

**修复后的使用方式**:
```bash
export GITHUB_TOKEN="*"
cd packages/task-watcher && node bin/cli.js sync
```

**验证结果**: ✅ Token 修复成功，所有 GitHub API 调用正常工作