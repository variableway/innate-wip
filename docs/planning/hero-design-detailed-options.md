# Hero Section 设计方案详解与参考

---

## 方案 B: 分屏布局 + 内容预览 (详细实现)

### 设计概念
将屏幕分为左右两区，左侧是品牌展示，右侧是文案和最新内容预览。

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  ┌─────────────────────┐  │  ┌─────────────────────────┐  │
│  │                     │  │  │                         │  │
│  │    ┌──────────┐     │  │  │   What drives you,      │  │
│  │    │          │     │  │  │   and what you makes,   │  │
│  │    │   Logo   │     │  │  │   make you.             │  │
│  │    │  (浮动)  │     │  │  │                         │  │
│  │    │          │     │  │  │   A community for...    │  │
│  │    └──────────┘     │  │  │                         │  │
│  │                     │  │  │   [Start Learning]      │  │
│  │   ●  ○  ●          │  │  │                         │  │
│  │   (装饰圆点)        │  │  │   Latest from community │  │
│  │                     │  │  │   ┌───┐ ┌───┐ ┌───┐    │  │
│  │                     │  │  │   │   │ │   │ │   │    │  │
│  └─────────────────────┘  │  │   └───┘ └───┘ └───┘    │  │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### 代码实现

```tsx
// components/hero-section-split.tsx
"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@allone/ui"
import { feedPosts } from "@/lib/data"
import { ArrowRight } from "lucide-react"

function FloatingDecoration() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* 浮动的小圆点 */}
      <div className="absolute top-10 left-10 w-3 h-3 bg-[#8FA68E] rounded-full animate-float-slow" />
      <div className="absolute top-32 right-20 w-2 h-2 bg-[#D4845E] rounded-full animate-float-medium" />
      <div className="absolute bottom-20 left-20 w-4 h-4 bg-[#7A9CAE] rounded-full animate-float-fast" />
      
      {/* 几何形状 */}
      <div className="absolute top-20 right-10 w-6 h-6 border-2 border-[#8FA68E]/30 rotate-45 animate-spin-slow" />
      <div className="absolute bottom-32 right-32 w-8 h-8 border-2 border-[#D4845E]/20 rounded-full animate-pulse" />
    </div>
  )
}

function LatestPostCard({ post }: { post: typeof feedPosts[0] }) {
  return (
    <div className="w-48 flex-shrink-0 bg-card border border-border rounded-xl p-4 hover:shadow-lg transition-shadow cursor-pointer">
      <div className="text-xs text-muted-foreground mb-2">{post.date}</div>
      <h4 className="font-medium text-sm line-clamp-2 mb-2">{post.title}</h4>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-full bg-secondary" />
        <span className="text-xs text-muted-foreground">{post.author.name}</span>
      </div>
    </div>
  )
}

export function HeroSectionSplit() {
  const latestPosts = feedPosts.slice(0, 3)
  
  return (
    <section className="relative min-h-[600px] py-16 px-6 overflow-hidden">
      <FloatingDecoration />
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* 左侧 - 品牌区 */}
        <div className="relative flex justify-center lg:justify-end">
          <div className="relative">
            {/* Logo */}
            <div className="relative w-64 h-64 animate-float">
              <Image
                src="/innate-logo.png"
                alt="Innate"
                fill
                className="object-contain"
              />
              {/* 发光效果 */}
              <div className="absolute inset-0 bg-[#F5E6C8]/20 rounded-full blur-3xl" />
            </div>
            
            {/* 环绕的装饰文字 */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-center">
              <span className="text-4xl font-bold text-[#8FA68E]/20">INNATE</span>
            </div>
          </div>
        </div>
        
        {/* 右侧 - 文案区 */}
        <div className="text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            What drives you,
            <br />
            <span className="text-[#D4845E]">and what you makes,</span>
            <br />
            make you.
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-md">
            A community for creators, builders, and lifelong learners. 
            Explore courses, share insights, and grow together.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-12">
            <Link href="/learning-library">
              <Button size="lg" className="bg-[#8FA68E] hover:bg-[#8FA68E]/90 text-white">
                Start Learning
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/feed">
              <Button size="lg" variant="outline" className="border-[#7A9CAE] text-[#7A9CAE]">
                View Community
              </Button>
            </Link>
          </div>
          
          {/* 最新内容预览 */}
          <div>
            <p className="text-sm text-muted-foreground mb-4">Latest from community</p>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {latestPosts.map((post) => (
                <LatestPostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// 添加 CSS 动画
const customAnimations = `
@keyframes float-slow {
  0%, 100% { transform: translateY(0) translateX(0); }
  50% { transform: translateY(-20px) translateX(10px); }
}

@keyframes float-medium {
  0%, 100% { transform: translateY(0) translateX(0); }
  50% { transform: translateY(-15px) translateX(-10px); }
}

@keyframes float-fast {
  0%, 100% { transform: translateY(0) translateX(0); }
  50% { transform: translateY(-25px) translateX(5px); }
}

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
`
```

---

## 方案 C: 全屏沉浸式 + 视差滚动 (详细实现)

### 设计概念
占据整个视口高度，使用视差滚动效果，打造沉浸式体验。

```
┌────────────────────────────────────────────────────────────┐
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│░░░░░░                                        ░░░░░░░░░░░░│
│░░░░░░     ┌──────┐                           ░░░░░░░░░░░░│
│░░░░░░     │      │      I N N A T E          ░░░░░░░░░░░░│
│░░░░░░     │ Logo │      ───────────          ░░░░░░░░░░░░│
│░░░░░░     │      │      What drives...       ░░░░░░░░░░░░│
│░░░░░░     └──────┘                           ░░░░░░░░░░░░│
│░░░░░░                                        ░░░░░░░░░░░░│
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
│                                                            │
│                    ↓ Scroll to explore                     │
└────────────────────────────────────────────────────────────┘
```

### 代码实现

```tsx
// components/hero-section-immersive.tsx
"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@allone/ui"
import { ChevronDown } from "lucide-react"

function ParallaxBackground() {
  const [scrollY, setScrollY] = useState(0)
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])
  
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* 多层视差背景 */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-[#F5E6C8]/30 via-[#8FA68E]/10 to-[#7A9CAE]/20"
        style={{ transform: `translateY(${scrollY * 0.2}px)` }}
      />
      
      {/* 浮动的大型几何形状 */}
      <div 
        className="absolute top-20 right-10 w-96 h-96 bg-[#8FA68E]/10 rounded-full blur-3xl"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      />
      <div 
        className="absolute bottom-20 left-10 w-80 h-80 bg-[#D4845E]/10 rounded-full blur-3xl"
        style={{ transform: `translateY(${scrollY * 0.4}px)` }}
      />
      <div 
        className="absolute top-1/3 left-1/4 w-64 h-64 bg-[#7A9CAE]/10 rounded-full blur-2xl"
        style={{ transform: `translateY(${scrollY * 0.5}px)` }}
      />
    </div>
  )
}

function ScrollIndicator() {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
      <span className="text-sm text-muted-foreground">Scroll to explore</span>
      <ChevronDown className="h-5 w-5 text-muted-foreground" />
    </div>
  )
}

export function HeroSectionImmersive() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <ParallaxBackground />
      
      <div className="relative z-10 text-center px-6">
        {/* Logo */}
        <div className="relative w-32 h-32 mx-auto mb-8">
          <Image
            src="/innate-logo.png"
            alt="Innate"
            fill
            className="object-contain"
          />
        </div>
        
        {/* 大标题 - 字母间距 */}
        <h1 className="text-6xl md:text-8xl font-bold tracking-[0.2em] mb-6">
          INNATE
        </h1>
        
        {/* 副标题 */}
        <p className="text-xl md:text-2xl text-[#D4845E] font-medium mb-4 max-w-2xl mx-auto">
          What drives you, and what you makes, make you.
        </p>
        
        {/* 描述 */}
        <p className="text-muted-foreground mb-12 max-w-md mx-auto">
          A community for creators, builders, and lifelong learners.
        </p>
        
        {/* CTA */}
        <Link href="/learning-library">
          <Button size="lg" className="bg-[#8FA68E] hover:bg-[#8FA68E]/90 text-white px-12 py-6 text-lg">
            Start Your Journey
          </Button>
        </Link>
      </div>
      
      <ScrollIndicator />
    </section>
  )
}
```

---

## 方案 D: 几何网格 + 功能卡片 (详细实现)

### 设计概念
使用几何图形网格作为背景，底部展示三个核心功能卡片。

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│   □        ○         △         ◇         □               │
│                                                            │
│                                                            │
│              ┌───────────────────────┐                    │
│   ┌──────┐   │                       │   ┌──────┐        │
│   │      │   │       Innate          │   │      │        │
│   │ Logo │   │   What drives you...  │   │ Card │        │
│   │      │   │                       │   │Stack │        │
│   └──────┘   │   [Explore] [Feed]    │   │      │        │
│              └───────────────────────┘   └──────┘        │
│                                                            │
│   ○        △         □         ○         ◇               │
│                                                            │
├────────────────────────────────────────────────────────────┤
│                                                            │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│   │   📚        │  │   💻        │  │   📝        │      │
│   │   Learn     │  │   Practice  │  │   Share     │      │
│   │             │  │             │  │             │      │
│   │  Explore    │  │  Hands-on   │  │  Connect    │      │
│   │  courses    │  │  coding     │  │  with       │      │
│   │             │  │  exercises  │  │  others     │      │
│   └─────────────┘  └─────────────┘  └─────────────┘      │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### 代码实现

```tsx
// components/hero-section-geometric.tsx
"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@allone/ui"
import { BookOpen, Code, Users } from "lucide-react"

function GeometricGrid() {
  const shapes = [
    { type: "circle", x: "10%", y: "20%", size: 40, color: "#8FA68E", delay: 0 },
    { type: "square", x: "85%", y: "15%", size: 30, color: "#D4845E", delay: 1 },
    { type: "diamond", x: "75%", y: "60%", size: 50, color: "#7A9CAE", delay: 2 },
    { type: "circle", x: "20%", y: "70%", size: 35, color: "#F5E6C8", delay: 0.5 },
    { type: "square", x: "5%", y: "80%", size: 25, color: "#8FA68E", delay: 1.5 },
    { type: "diamond", x: "90%", y: "85%", size: 45, color: "#D4845E", delay: 2.5 },
  ]
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.map((shape, i) => (
        <div
          key={i}
          className="absolute animate-float-rotate"
          style={{
            left: shape.x,
            top: shape.y,
            width: shape.size,
            height: shape.size,
            animationDelay: `${shape.delay}s`,
          }}
        >
          {shape.type === "circle" && (
            <div 
              className="w-full h-full rounded-full opacity-20"
              style={{ backgroundColor: shape.color }}
            />
          )}
          {shape.type === "square" && (
            <div 
              className="w-full h-full rotate-12 opacity-20"
              style={{ backgroundColor: shape.color }}
            />
          )}
          {shape.type === "diamond" && (
            <div 
              className="w-full h-full rotate-45 opacity-15"
              style={{ backgroundColor: shape.color }}
            />
          )}
        </div>
      ))}
    </div>
  )
}

const features = [
  {
    icon: BookOpen,
    title: "Learn",
    description: "Explore curated courses and tutorials designed to level up your skills.",
    color: "#8FA68E",
    href: "/learning-library",
  },
  {
    icon: Code,
    title: "Practice",
    description: "Hands-on coding exercises with AI assistance to accelerate your learning.",
    color: "#D4845E",
    href: "/ai-coding",
  },
  {
    icon: Users,
    title: "Share",
    description: "Connect with like-minded creators and share your journey.",
    color: "#7A9CAE",
    href: "/feed",
  },
]

function FeatureCard({ feature }: { feature: typeof features[0] }) {
  const Icon = feature.icon
  return (
    <Link href={feature.href}>
      <div className="group bg-card border border-border rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div 
          className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
          style={{ backgroundColor: `${feature.color}20` }}
        >
          <Icon className="h-7 w-7" style={{ color: feature.color }} />
        </div>
        <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
        <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
      </div>
    </Link>
  )
}

export function HeroSectionGeometric() {
  return (
    <section className="relative py-20 overflow-hidden">
      <GeometricGrid />
      
      {/* 主内容区 */}
      <div className="max-w-6xl mx-auto px-6 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          {/* Logo */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-48 h-48">
              <Image
                src="/innate-logo.png"
                alt="Innate"
                fill
                className="object-contain"
              />
            </div>
          </div>
          
          {/* 文案 */}
          <div className="lg:col-span-2 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Innate
            </h1>
            <p className="text-xl text-[#D4845E] font-medium mb-4">
              What drives you, and what you makes, make you.
            </p>
            <p className="text-muted-foreground mb-8 max-w-md">
              A community for creators, builders, and lifelong learners.
            </p>
            <div className="flex gap-4 justify-center lg:justify-start">
              <Link href="/learning-library">
                <Button className="bg-[#8FA68E] hover:bg-[#8FA68E]/90 text-white">
                  Explore
                </Button>
              </Link>
              <Link href="/feed">
                <Button variant="outline" className="border-[#7A9CAE] text-[#7A9CAE]">
                  View Feed
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* 特色卡片 */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  )
}
```

---

## 优秀参考网站

### 1. Linear.app - 简洁动态背景
**网址**: https://linear.app

**特点**:
- 深色渐变背景 + 微妙的网格动画
- 文字渐入动画
- 悬浮的预览卡片
- 简洁有力的 CTA

**借鉴点**:
```
- 使用深色渐变作为背景
- 微妙的动画不分散注意力
- 产品预览直接展示在 Hero 区
```

### 2. Notion.so - 清晰信息架构
**网址**: https://notion.so

**特点**:
- 分屏布局 (左侧文案 + 右侧预览)
- 多平台展示图 (Mac, iPad, iPhone)
- 简洁的统计数据
- 强大的社会证明 (知名公司 Logo)

**借鉴点**:
```
- 右侧展示产品实际使用场景
- 底部展示客户 Logo 增加信任
- 渐变的 CTA 按钮
```

### 3. Vercel.com - 动态网格背景
**网址**: https://vercel.com

**特点**:
- 动态网格背景效果
- 终端风格的代码展示
- 悬浮的部署预览卡片
- 鼠标跟随的光效

**借鉴点**:
```
- 动态网格背景营造科技感
- 代码/终端元素展示技术性
- 悬浮卡片的层次感
```

### 4. Figma.com - 分屏 + 动画
**网址**: https://figma.com

**特点**:
- 紫色渐变背景
- 左右分屏布局
- 右侧实时协作动画
- 多个 CTA 层次分明

**借鉴点**:
```
- 实时协作动画展示核心价值
- 多种产品用 Tab 切换展示
- 渐变色背景营造品牌感
```

### 5. Stripe.com - 精致排版 + 动效
**网址**: https://stripe.com

**特点**:
- 精美的代码终端展示
- 渐变光效背景
- 微妙的浮动动画
- 终端代码打字效果

**借鉴点**:
```
- 代码终端展示技术专业性
- 打字机动画增加动态感
- 渐变光效提升质感
```

### 6. Raycast.com - 产品为中心
**网址**: https://raycast.com

**特点**:
- 产品截图居中展示
- 简洁的文案
- 强大的社区展示
- 深色主题

**借鉴点**:
```
- 产品截图是视觉焦点
- 简洁但有力的文案
- 社区数据展示 (插件数量等)
```

### 7. Craft.do - 极简主义
**网址**: https://craft.do

**特点**:
- 极简的设计
- 精美的产品动图
- 优雅的排版
- 微妙的背景纹理

**借鉴点**:
```
- 少即是多的设计理念
- 产品动图直接展示功能
- 优雅的衬线字体搭配
```

### 8. Arc Browser - 沉浸式体验
**网址**: https://arc.net

**特点**:
- 全屏视频背景
- 大胆的排版
- 渐变色运用
- 强烈的设计风格

**借鉴点**:
```
- 大胆使用渐变色
- 视频/动态背景提升沉浸感
- 非传统的布局设计
```

---

## 针对 Innate 的建议

基于品牌调性（创造力、学习、社区），我推荐参考：

1. **Notion** - 社区感 + 清晰信息架构
2. **Craft** - 温暖的配色 + 优雅排版
3. **Linear** - 动态背景 + 简洁有力
4. **Raycast** - 产品为中心 + 社区数据

### 建议的组合方案

结合上述参考，我建议的 Hero Section 结构：

```
┌────────────────────────────────────────────────────────────┐
│ [动态渐变网格背景 - 类似 Linear]                             │
│                                                            │
│   ┌──────┐                                                 │
│   │ Logo │     Innate         [简洁有力的品牌名 - 类似 Craft]│
│   │  ★   │     ─────                                         │
│   └──────┘     What drives you...  [标语 - 类似 Raycast]     │
│                                                            │
│   [Explore] [Join Community]   [双 CTA - 类似 Notion]        │
│                                                            │
│   ┌─────┐ ┌─────┐ ┌─────┐                                  │
│   │1.2K+│ │ 50+ │ │100+ │   [统计数据 - 类似 Raycast]       │
│   │Users│ │Course│ │Posts│                                  │
│   └─────┘ └─────┘ └─────┘                                  │
│                                                            │
│              ↓                                             │
└────────────────────────────────────────────────────────────┘
```

---

需要我实现**特定方案**或**组合方案**吗？
