---
name: "kimi-frontend"
description: "Expert frontend development skill for Kimi K2/K2.5 models. Invoke when building UI with Moonshot AI, creating Agent interfaces, or implementing complex frontend features."
---

# Kimi Frontend Development Skill

Expert frontend development guidance optimized for Moonshot AI's Kimi models (K2, K2.5).

## Model Capabilities

### Kimi K2.5 特性
- 国内领先的Coding模型
- 支持多模态理解与处理
- 256K上下文长度
- 支持思考与非思考模式
- 前端代码质量与设计表现力优秀
- 原生多模态架构设计

### Kimi K2 特性
- 1T总参数量，32B激活参数的MoE架构
- 卓越的代码编程能力
- 擅长Agent搭建
- 复杂任务自动分解

## Prompting 最佳实践

### Agent 搭建模式
Kimi K2擅长将需求分解为可执行的工具调用结构：

```typescript
interface AgentTask {
  goal: string
  steps: AgentStep[]
  tools: ToolDefinition[]
}

const frontendAgentTask: AgentTask = {
  goal: '构建响应式用户仪表板',
  steps: [
    { action: 'analyze_requirements', input: '用户需求文档' },
    { action: 'design_components', input: '组件架构设计' },
    { action: 'implement_ui', input: 'React组件实现' },
    { action: 'add_interactions', input: '交互逻辑添加' },
    { action: 'test_responsive', input: '响应式测试' }
  ],
  tools: [
    { name: 'create_component', description: '创建React组件' },
    { name: 'add_styles', description: '添加Tailwind样式' },
    { name: 'implement_logic', description: '实现业务逻辑' }
  ]
}
```

### 前端开发模式

#### React组件模板
```tsx
'use client'

import { useState, useCallback } from 'react'
import { cn } from '@innate/ui'

interface DashboardProps {
  data: DashboardData
  onUpdate?: (data: DashboardData) => void
}

export function Dashboard({ data, onUpdate }: DashboardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  const handleRefresh = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/dashboard/refresh')
      const newData = await response.json()
      onUpdate?.(newData)
    } finally {
      setIsLoading(false)
    }
  }, [onUpdate])

  return (
    <div className="grid gap-6 p-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">仪表板</h1>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className={cn(
            'px-4 py-2 rounded-md transition-colors',
            isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent'
          )}
        >
          {isLoading ? '刷新中...' : '刷新数据'}
        </button>
      </header>

      <nav className="flex gap-2">
        {['overview', 'analytics', 'settings'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-4 py-2 rounded-md capitalize',
              activeTab === tab
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-accent'
            )}
          >
            {tab}
          </button>
        ))}
      </nav>

      <main className="grid gap-4">
        {/* 动态内容区域 */}
      </main>
    </div>
  )
}
```

### 多模态能力利用

#### 从设计图生成代码
Kimi K2.5支持视觉输入，可以直接从设计图生成代码：
1. 上传UI设计截图
2. 描述交互需求
3. 生成完整的React组件

### 复杂任务分解

#### 功能模块化
```typescript
const featureBreakdown = {
  name: '用户管理系统',
  modules: [
    {
      name: '用户列表',
      components: ['UserTable', 'UserFilter', 'UserPagination'],
      api: '/api/users'
    },
    {
      name: '用户详情',
      components: ['UserProfile', 'UserStats', 'UserActivity'],
      api: '/api/users/:id'
    },
    {
      name: '用户编辑',
      components: ['UserForm', 'AvatarUpload', 'RoleSelector'],
      api: '/api/users/:id'
    }
  ]
}
```

## API 集成示例

```typescript
import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.MOONSHOT_API_KEY,
  baseURL: 'https://api.moonshot.cn/v1'
})

const generateUI = async (description: string, designImage?: string) => {
  const messages: any[] = [
    {
      role: 'system',
      content: '你是专业的前端开发工程师，擅长React、TypeScript和Tailwind CSS。'
    },
    {
      role: 'user',
      content: designImage
        ? [
            { type: 'text', text: `根据设计图生成React组件：${description}` },
            { type: 'image_url', image_url: { url: designImage } }
          ]
        : `生成React组件：${description}`
    }
  ]

  const response = await client.chat.completions.create({
    model: 'kimi-k2.5',
    messages,
    max_tokens: 8192
  })

  return response.choices[0].message.content
}
```

## 质量检查清单
- [ ] TypeScript类型完整
- [ ] 响应式设计
- [ ] 深色模式支持
- [ ] 无障碍访问
- [ ] 性能优化
- [ ] 错误处理
- [ ] 加载状态
- [ ] 动画流畅
