# Skills 设置指南

本文档介绍如何在 Trae IDE 中设置和使用前端开发 Skills。

## 什么是 Skill?

Skill 是一种可复用的提示模板，为特定任务类型提供专业化指导。当 AI 遇到相关任务时，会自动加载对应的 skill 来提供更好的输出质量。

## Skill 目录结构

Skills 存放在项目的 `.trae/skills/` 目录下：

```
.trae/
└── skills/
    ├── claude-frontend/
    │   └── SKILL.md
    ├── codex-frontend/
    │   └── SKILL.md
    ├── glm-frontend/
    │   └── SKILL.md
    └── kimi-frontend/
        └── SKILL.md
```

## 如何创建 Skill

### 1. 创建目录

```bash
mkdir -p .trae/skills/<skill-name>
```

### 2. 创建 SKILL.md 文件

每个 skill 必须包含一个 `SKILL.md` 文件，格式如下：

```markdown
---
name: "<skill-name>"
description: "<描述skill的功能和触发条件，保持在200字符以内>"
---

# Skill 标题

<详细说明、使用指南和示例>
```

### 必填字段

| 字段 | 位置 | 描述 |
|------|------|------|
| `name` | frontmatter | Skill 的唯一标识符 |
| `description` | frontmatter | **关键**：必须包含 (1) skill 的功能 (2) 何时触发。建议格式："Does X. Invoke when Y happens or user asks for Z." |
| 详细内容 | body | frontmatter 之后的完整 Markdown 内容 |

## 已配置的前端 Skills

本项目已配置以下前端开发 skills：

### 1. Claude Code Frontend (`claude-frontend`)

**适用场景**: 使用 Claude Code 进行 React/Next.js 开发

**特点**:
- 避免 "AI slop" 美学，使用独特的字体和配色
- 深度集成 Tailwind CSS 和 Radix UI
- 支持深色模式和响应式设计
- 包含动画和微交互指导

**触发条件**: 构建 React/Next.js UI、创建组件、实现前端设计时自动加载

### 2. OpenAI Codex Frontend (`codex-frontend`)

**适用场景**: 使用 OpenAI Codex/GPT-5 进行前端开发

**特点**:
- 原子化提示策略，分解复杂 UI
- TypeScript 严格模式支持
- 完整的表单验证和状态管理
- 集成 react-hook-form 和 zod

**触发条件**: 使用 OpenAI 模型构建 UI 组件、React 应用、生成 HTML/CSS 时

### 3. GLM Frontend (`glm-frontend`)

**适用场景**: 使用智谱 GLM-4/GLM-5 进行前端开发

**特点**:
- 支持深度思考模式处理复杂任务
- 中文本地化最佳实践
- 中文字体选择和排版指南
- API 集成示例

**触发条件**: 使用 GLM 模型构建 UI、创建中文界面时

### 4. Kimi Frontend (`kimi-frontend`)

**适用场景**: 使用 Moonshot Kimi K2/K2.5 进行前端开发

**特点**:
- 多模态能力，支持从设计图生成代码
- Agent 搭建模式，自动分解复杂任务
- 256K 长上下文支持
- 国内领先的 Coding 能力

**触发条件**: 使用 Kimi 模型构建 UI、创建 Agent 界面、实现复杂前端功能时

## 如何使用 Skill

### 自动触发

当你的请求与某个 skill 的描述匹配时，AI 会自动加载该 skill：

```
用户: 帮我创建一个响应式的导航栏组件
AI: [自动加载 claude-frontend skill] 开始创建组件...
```

### 手动指定

你也可以在请求中明确指定要使用的 skill：

```
用户: 使用 kimi-frontend skill 帮我分析这个设计图并生成代码
```

## Skill 最佳实践

### 1. Description 编写

好的 description 应该：
- 清晰说明 skill 的功能
- 明确触发条件
- 保持在 200 字符以内

**示例**:
```
✅ "Expert frontend development skill for Claude Code. Invoke when building React/Next.js UIs, creating components, or implementing frontend designs with Tailwind CSS."
❌ "A skill for frontend" (太模糊)
```

### 2. 内容组织

SKILL.md 内容应该包含：
- 核心原则和指导方针
- 代码示例和模板
- 最佳实践清单
- 常见问题解决方案

### 3. 保持更新

随着项目发展，定期更新 skill 内容：
- 添加新的组件模式
- 更新依赖版本
- 补充新学到的最佳实践

---

## 如何查找 Skill

### 官方资源

1. **Claude 官方 Cookbook**
   - 网址: https://platform.claude.com/cookbook
   - 内容: 前端美学、代码生成、Agent 搭建等

2. **OpenAI 开发者文档**
   - 网址: https://developers.openai.com/cookbook
   - 内容: Codex 提示指南、GPT-5 前端开发

3. **智谱 AI 开放平台**
   - 网址: https://docs.bigmodel.cn
   - 内容: GLM 模型使用指南、API 文档

4. **Kimi API 开放平台**
   - 网址: https://platform.moonshot.cn/docs
   - 内容: Kimi K2/K2.5 使用指南、Agent 搭建

### 社区资源

1. **GitHub**
   - 搜索关键词: `claude-code-skills`, `prompt-engineering`, `frontend-prompts`
   - 推荐仓库: `shanraisshan/claude-code-best-practice`

2. **技术博客**
   - Claude Blog: https://claude.com/blog
   - OpenAI Blog: https://openai.com/blog

3. **开发者社区**
   - Stack Overflow: 搜索相关标签
   - Discord/Telegram: AI 开发者群组

### 查找技巧

1. **关键词搜索**
   - `{model-name} frontend prompts`
   - `{model-name} best practices`
   - `prompt engineering for {use-case}`

2. **关注更新**
   - 各平台会定期发布新的 cookbook 和最佳实践
   - 订阅官方博客和更新日志

3. **实践总结**
   - 记录有效的提示模式
   - 将成功的 prompt 转化为 skill

---

## 下一步

1. 根据项目需要，调整现有 skill 的内容
2. 创建特定于项目的 skill（如 `project-components`）
3. 定期回顾和更新 skill 以保持最佳效果
