---
name: "glm-frontend"
description: "Expert frontend development skill for Zhipu GLM models. Invoke when building UI with GLM-4/GLM-5, creating React components, or implementing Chinese-language interfaces."
---

# GLM Frontend Development Skill

Expert frontend development guidance optimized for Zhipu AI's GLM models (GLM-4.7, GLM-5).

## Model Capabilities

### GLM-5 特性
- MoE架构，约7450亿总参数，每次推理激活440亿参数
- 支持200K token长上下文
- 支持深度思考模式 (thinking mode)
- 使用华为昇腾芯片训练

### GLM-4.7 特性
- 高性价比选择
- 适合常规前端任务
- 支持流式输出

## Prompting 最佳实践

### 深度思考模式
启用思考模式处理复杂前端任务：
```json
{
  "thinking": { "type": "enabled" },
  "max_tokens": 65536,
  "temperature": 1.0
}
```

### 前端开发指导原则

#### 组件设计规范
```tsx
import { cn } from '@innate/ui'
import { forwardRef, type HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated'
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: 'bg-card text-card-foreground',
      outlined: 'border border-border bg-card',
      elevated: 'bg-card shadow-lg',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg p-6',
          variants[variant],
          className
        )}
        {...props}
      />
    )
  }
)

Card.displayName = 'Card'
```

### 中文本地化

#### 字体选择
- 中文正文：思源黑体、阿里巴巴普惠体
- 中文标题：思源宋体、站酷高端黑
- 代码字体：JetBrains Mono、Fira Code
- 混合排版：Noto Sans SC + Inter

#### 布局考虑
- 中文行高通常需要更大（1.6-1.8）
- 中文标点处理（避免行首/行尾）
- 中英文混排间距调整
- 响应式断点适配移动端

### API 集成示例

```typescript
import { ZhipuAiClient } from 'zai'

const client = new ZhipuAiClient({
  apiKey: process.env.ZHIPU_API_KEY
})

const generateComponent = async (description: string) => {
  const response = await client.chat.completions.create({
    model: 'glm-5',
    messages: [
      {
        role: 'system',
        content: '你是一个专业的前端开发工程师，擅长React和TypeScript。'
      },
      {
        role: 'user',
        content: `请根据以下描述生成React组件：${description}`
      }
    ],
    thinking: { type: 'enabled' },
    max_tokens: 65536,
    temperature: 1.0
  })

  return response.choices[0].message.content
}
```

## 质量检查清单
- [ ] TypeScript 类型完整
- [ ] 中文文本显示正确
- [ ] 响应式布局适配
- [ ] 深色模式支持
- [ ] 无障碍访问
- [ ] 性能优化
- [ ] 跨浏览器兼容
