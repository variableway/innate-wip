---
name: "write-agent"
description: "AI Agent self-documentation skill. Automatically update AGENTS.md, task files, and project documentation when implementing features or making changes. Ensures documentation stays in sync with code."
---

# WriteAgent - AI Agent Self-Documentation Skill

自动维护和更新项目文档，确保 AGENTS.md、任务文档和项目文档与代码实现保持同步。

## 何时使用此 Skill

在以下情况下，**必须**使用 WriteAgent 更新文档：

1. **修改了 AGENTS.md 中提到的文件/结构/配置**
   - 添加了新的目录结构
   - 修改了配置文件
   - 更改了代码模式或约定

2. **完成了任务或里程碑**
   - Task 状态变更（进行中 → 完成）
   - 添加了新的功能模块
   - 修复了问题或 bug

3. **创建了新的组件/模块/功能**
   - 新的 UI 组件
   - 新的 API 端点
   - 新的工具函数

4. **修改了架构或设计决策**
   - 技术栈变更
   - 架构模式调整
   - 依赖关系变化

5. **发现了文档中的过时信息**
   - 代码与文档描述不符
   - 链接失效
   - 示例代码过时

## 文档更新原则

### 1. 及时更新
- 在完成功能修改后立即更新文档
- 不要延迟到"后面再补"
- 将文档更新视为任务的一部分

### 2. 精确描述
- 准确描述实现的内容
- 更新具体的文件路径和代码示例
- 保持技术细节的一致性

### 3. 保持结构
- 遵循现有文档的格式和风格
- 使用一致的标题层级
- 维护目录结构和链接

### 4. 版本追踪
- 记录重要的变更历史
- 标记已完成的任务
- 更新进度状态

## 更新类型与模板

### 类型 1: 任务完成更新

```markdown
## Task X: 任务标题 ✅

**状态**: 已完成

**完成内容**:
1. [x] 功能点 A
2. [x] 功能点 B
3. [x] 功能点 C

**实现细节**:
- 关键文件: `path/to/file.ts`
- 主要变更: 描述具体修改
- 技术方案: 简要说明实现方式

**验证方式**:
```bash
# 测试命令或验证步骤
```

**相关提交**: commit-hash (可选)
```

### 类型 2: AGENTS.md 架构更新

```markdown
## Architecture

### 新增模块: ModuleName

```
project/
├── new-module/
│   ├── components/     # 新增组件
│   ├── hooks/         # 新增 hooks
│   └── utils/         # 工具函数
```

**功能**: 简要描述模块用途
**依赖**: 列出关键依赖
**入口**: `path/to/index.ts`
```

### 类型 3: 组件文档更新

```markdown
### ComponentName

**用途**: 组件功能描述

**Props**:
| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| prop1 | string | 是 | 说明 |
| prop2 | number | 否 | 说明，默认: 0 |

**使用示例**:
```tsx
<ComponentName prop1="value" prop2={42} />
```

**位置**: `packages/ui/src/components/component-name.tsx`
```

### 类型 4: API/数据流更新

```markdown
### Data Flow: FeatureName

```
User Action → API Call → Data Processing → State Update → UI Render
```

**API 端点**:
- `GET /api/resource` - 获取资源
- `POST /api/resource` - 创建资源

**关键文件**:
- `lib/api/resource.ts` - API 调用
- `hooks/useResource.ts` - 数据 hook
- `components/ResourceList.tsx` - 展示组件
```

## 更新检查清单

在完成任务时，检查以下文档是否需要更新：

### 代码层面
- [ ] `AGENTS.md` - 项目架构和模式
- [ ] `README.md` - 项目概览和快速开始
- [ ] `docs/tasks/*.md` - 任务状态和进度
- [ ] `docs/planning/*.md` - 设计文档和计划

### 配置层面
- [ ] `package.json` 变更 - 更新依赖说明
- [ ] 环境变量变更 - 更新配置文档
- [ ] 脚本变更 - 更新使用说明

### 组件层面
- [ ] 新组件 - 添加到组件列表
- [ ] Props 变更 - 更新接口定义
- [ ] 样式变更 - 更新主题文档

## 自动化规则

### 规则 1: Task 状态同步
```
当: 用户说"完成 Task X" 或 "Task X 已完成"
做:  自动将对应文档中的 Task X 标记为 ✅
     并添加完成摘要
```

### 规则 2: 文件创建同步
```
当: 在特定目录创建新文件
做:  检查 AGENTS.md 是否需要更新目录结构说明
     例如: 在 components/ 下创建新组件
```

### 规则 3: 配置变更同步
```
当: 修改配置文件 (如 next.config.mjs, tsconfig.json)
做:  更新 AGENTS.md 中的配置说明部分
```

### 规则 4: 依赖变更同步
```
当: 添加/删除/更新 npm 依赖
做:  更新文档中的依赖列表和版本说明
```

## 最佳实践

### 1. 使用明确的状态标记
```markdown
## Task Name ⏳  // 待开始
## Task Name 🔄  // 进行中
## Task Name ✅  // 已完成
## Task Name ❌  // 已取消/阻塞
```

### 2. 添加时间戳
```markdown
**最后更新**: 2026-04-04
**完成时间**: 2026-04-04
```

### 3. 保留历史记录
```markdown
### 变更历史
- 2026-04-04: 初始实现
- 2026-04-03: 修复 bug #123
- 2026-04-02: 添加新功能 X
```

### 4. 链接相关资源
```markdown
**相关文档**:
- [设计文档](../design.md)
- [API 文档](../api.md)

**相关代码**:
- `components/Button.tsx`
- `hooks/useAuth.ts`
```

## 示例场景

### 场景 1: 完成一个功能 Task

**用户指令**: "完成 Task 3: 添加用户认证功能"

**WriteAgent 行动**:
1. 找到 Task 3 所在文档
2. 更新状态为 ✅
3. 添加完成摘要：
   - 实现的功能点
   - 关键文件位置
   - 使用方式
   - 验证命令

### 场景 2: 修改架构

**用户指令**: "把 API 从 REST 改为 GraphQL"

**WriteAgent 行动**:
1. 更新 AGENTS.md 中的架构部分
2. 修改数据流说明
3. 更新 API 调用示例
4. 标记相关 Task 状态

### 场景 3: 发现文档过时

**WriteAgent 发现**: 代码中的组件 Props 与文档不符

**WriteAgent 行动**:
1. 自动更新文档中的 Props 定义
2. 更新使用示例
3. 添加最后更新时间戳

## 质量检查

更新文档后，验证以下方面：

- [ ] 准确性: 文档与实际代码一致
- [ ] 完整性: 没有遗漏重要信息
- [ ] 可读性: 格式清晰，易于理解
- [ ] 一致性: 使用统一的术语和风格
- [ ] 时效性: 包含最新的变更信息
- [ ] 链接有效性: 所有内部链接可正常访问

## 提示词模板

当你需要主动更新文档时，可以使用以下提示词：

```
请更新文档：
1. 文件: [文档路径]
2. 更新类型: [任务完成/架构变更/组件更新/其他]
3. 变更内容: [简要描述]
4. 需要添加的信息: [具体要点]
```
