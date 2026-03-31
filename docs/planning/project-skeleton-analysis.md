# Innate Website 项目骨架分析

## 一、项目概述

**Innate** 是一个基于 Next.js 的 monorepo 项目，采用 pnpm workspaces 管理。项目主要目的是展示和提供一套完整的 UI 组件库，并构建一个演示网站。

---

## 二、目录结构

```
innate/
├── apps/
│   └── web/                    # Next.js 主应用
├── packages/
│   ├── ui/                     # @innate/ui - UI 组件库
│   ├── utils/                  # @innate/utils - 工具函数
│   └── tsconfig/               # @innate/tsconfig - 共享 TS 配置
├── docs/
│   ├── tasks/
│   │   └── tasks.md            # 任务列表
│   ├── ui-terminology.md       # UI 术语文档
│   └── project-skeleton-analysis.md  # 本文档
├── package.json                # 根项目配置
├── pnpm-workspace.yaml         # pnpm workspace 配置
├── tsconfig.json               # 根 TS 配置
└── run.sh                      # 项目运行脚本
```

---

## 三、模块详细分析

### 3.1 Apps 模块

#### `apps/web` - 主 Web 应用

**定位**: 演示网站，展示 UI 组件库的使用

**目录结构**:
```
apps/web/
├── app/                        # Next.js App Router
│   ├── course/[id]/            # 课程详情页面
│   ├── deep-news/              # Deep News 页面
│   ├── discover/               # 发现页面
│   ├── learning-library/       # 学习库页面
│   ├── globals.css             # 全局样式
│   ├── layout.tsx              # 根布局
│   └── page.tsx                # 首页 (Feed 页面)
├── components/                 # 业务组件
│   ├── header.tsx              # 顶部导航栏
│   ├── sidebar.tsx             # 侧边栏 + 左侧栏
│   ├── post-card.tsx           # 帖子卡片
│   ├── course-card.tsx         # 课程卡片
│   ├── community-card.tsx      # 社区卡片
│   ├── course-content.tsx      # 课程内容组件
│   └── theme-provider.tsx      # 主题提供者
├── hooks/                      # 自定义 Hooks
│   ├── use-mobile.ts           # 移动端检测
│   └── use-toast.ts            # Toast 通知
├── lib/                        # 工具库
│   ├── data.ts                 # 模拟数据
│   ├── types.ts                # TypeScript 类型定义
│   └── utils.ts                # 工具函数
├── public/                     # 静态资源
├── styles/                     # 样式文件
├── next.config.mjs             # Next.js 配置
├── package.json                # 依赖配置
├── postcss.config.mjs          # PostCSS 配置
├── tsconfig.json               # TS 配置
└── components.json             # shadcn/ui 配置
```

**核心依赖**:
- `next`: 16.2.1
- `react`: 19.2.4
- `@innate/ui`: workspace 依赖
- `@innate/utils`: workspace 依赖
- `@radix-ui/*`: 可访问性 UI 原语
- `tailwindcss`: 4.2.2
- `lucide-react`: 图标库

**页面路由**:
| 路由 | 页面 | 描述 |
|------|------|------|
| `/` | 首页/Feed | Deep News 帖子流 |
| `/learning-library` | 学习库 | 课程卡片网格 |
| `/discover` | 发现 | 搜索和社区展示 |
| `/course/[id]` | 课程详情 | 课程进度和课时 |
| `/deep-news` | Deep News | 新闻内容 |

---

### 3.2 Packages 模块

#### `packages/ui` - UI 组件库

**定位**: 提供完整的 React UI 组件集合

**目录结构**:
```
packages/ui/
├── src/
│   ├── components/ui/          # UI 组件集合
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── sidebar.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   └── ... (50+ 组件)
│   ├── lib/
│   │   └── utils.ts            # cn() 工具函数
│   ├── globals.css             # 全局样式变量
│   └── index.ts                # 统一导出
├── package.json
└── tsconfig.json
```

**组件分类**:

| 类别 | 组件 |
|------|------|
| **表单** | Button, Input, Textarea, Select, Checkbox, Radio, Switch, Slider, Form |
| **布局** | Card, Dialog, Sheet, Sidebar, Tabs, Accordion, Collapsible, Resizable |
| **导航** | Breadcrumb, NavigationMenu, Pagination, Menubar |
| **数据展示** | Table, Badge, Avatar, Progress, Skeleton, Chart |
| **反馈** | Alert, Toast, Sonner, Spinner, Empty |
| **覆盖层** | Popover, Tooltip, HoverCard, DropdownMenu, ContextMenu, AlertDialog |
| **工具** | ScrollArea, Separator, AspectRatio, Kbd, Label |

**核心依赖**:
- `@radix-ui/*`: 22+ 个 Radix UI 原语
- `class-variance-authority`: 组件变体管理
- `tailwind-merge`: Tailwind 类名合并
- `lucide-react`: 图标
- `recharts`: 图表库
- `react-hook-form` + `zod`: 表单处理

---

#### `packages/utils` - 工具函数库

**定位**: 提供共享工具函数

**目录结构**:
```
packages/utils/
├── src/
│   └── index.ts                # 导出 cn() 等工具
├── package.json
└── tsconfig.json
```

**导出内容**:
- `cn()`: 合并 Tailwind 类名 (clsx + tailwind-merge)

---

#### `packages/tsconfig` - TypeScript 配置

**定位**: 共享 TypeScript 配置

**目录结构**:
```
packages/tsconfig/
├── base.json                   # 基础配置
├── nextjs.json                 # Next.js 项目配置
├── react-library.json          # React 库配置
└── package.json
```

---

## 四、项目依赖关系

```
┌─────────────────────────────────────────────────────────────┐
│                        apps/web                              │
│                   (Next.js 主应用)                            │
├─────────────────────────────────────────────────────────────┤
│  依赖:                                                       │
│  - @innate/ui (workspace:*)                                  │
│  - @innate/utils (workspace:*)                               │
│  - @radix-ui/*                                               │
│  - next, react, tailwindcss                                  │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
          ▼                   ▼                   ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  @innate/ui     │  │ @innate/utils   │  │ @innate/tsconfig│
│  (UI 组件库)     │  │  (工具函数)      │  │  (TS 配置)      │
├─────────────────┤  ├─────────────────┤  ├─────────────────┤
│ 依赖:            │  │ 依赖:            │  │ 依赖:            │
│ - @radix-ui/*   │  │ - clsx          │  │ 无              │
│ - tailwind-merge│  │ - tailwind-merge│  │                 │
│ - lucide-react  │  │                 │  │                 │
│ - recharts      │  │                 │  │                 │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

---

## 五、核心组件说明

### 5.1 Header 组件
- **位置**: `apps/web/components/header.tsx`
- **功能**: 顶部导航栏
- **包含**: Logo、导航链接、搜索、通知、用户头像
- **导航项**: Home, Learning Library, Overview & Freebies, AI Coding Basics, Events

### 5.2 Sidebar + LeftBar 组件
- **位置**: `apps/web/components/sidebar.tsx`
- **功能**: 
  - `LeftBar`: 左侧图标栏（16px 宽度）
  - `Sidebar`: 左侧分类导航（256px 宽度）
- **分类**:
  - Superlinear AI (12 项)
  - 社区公共空间 (6 项)
  - 课代表尊贵的会员们 (5 项)

### 5.3 PostCard 组件
- **位置**: `apps/web/components/post-card.tsx`
- **功能**: 帖子卡片展示
- **交互**: 点赞、评论

### 5.4 CourseCard 组件
- **位置**: `apps/web/components/course-card.tsx`
- **功能**: 课程卡片展示
- **显示**: 封面图、标题、组织、进度条、私密状态

### 5.5 CommunityCard 组件
- **位置**: `apps/web/components/community-card.tsx`
- **功能**: 社区卡片展示
- **显示**: 封面图、标题、描述、价格

### 5.6 CourseContent 组件
- **位置**: `apps/web/components/course-content.tsx`
- **功能**: 课程内容展示
- **特性**: 可折叠的课时列表

---

## 六、当前架构分析

### 6.1 优点
1. **Monorepo 结构清晰**: pnpm workspace 管理良好
2. **组件化程度高**: UI 组件和业务组件分离
3. **TypeScript 支持**: 完整的类型定义
4. **样式系统完善**: Tailwind CSS + CSS 变量
5. **可访问性**: 基于 Radix UI 构建

### 6.2 存在的问题
1. **内容冗余**: 大量模拟数据和频道分类
2. **导航复杂**: 3 级导航栏占据太多空间
3. **页面耦合**: 各页面都直接引入 Header 和 Sidebar
4. **布局重复**: 每个页面重复相同的布局结构

---

## 七、修改计划和建议

### 7.1 目标
1. ✅ 减少内容，简化展示
2. ✅ 只暴露所有 UI 组件
3. ✅ 确定项目 Layout
4. ✅ 隐藏分类和频道（代码保留但不在页面展示）

### 7.2 具体修改建议

#### 1. 简化布局结构
```
当前: LeftBar + Sidebar + Main Content
建议: Header + Main Content (简化版)
```

#### 2. 保留代码但隐藏
- 保留 `Sidebar` 和 `LeftBar` 组件代码
- 从页面中移除引用，但文件保留

#### 3. 首页改造为组件展示
将首页 (`/`) 改造为 UI 组件展示页面：
- 展示所有 `@innate/ui` 组件
- 按分类组织：Forms, Layout, Feedback 等
- 提供组件代码示例

#### 4. 简化页面
| 页面 | 修改建议 |
|------|----------|
| `/` | 改为 UI 组件展示主页 |
| `/learning-library` | 隐藏或简化 |
| `/discover` | 隐藏或简化 |
| `/course/[id]` | 隐藏或简化 |
| `/deep-news` | 隐藏或简化 |

#### 5. 统一布局
创建共享布局组件：
```tsx
// components/app-layout.tsx
export function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>{children}</main>
    </div>
  )
}
```

---

## 八、具体任务分解

### Phase 1: 项目骨架整理
- [ ] 分析现有代码结构
- [ ] 确定保留/隐藏/删除的内容
- [ ] 创建新的布局组件

### Phase 2: UI 组件展示页
- [ ] 设计组件展示页面结构
- [ ] 按分类展示 UI 组件
- [ ] 添加组件代码示例

### Phase 3: 页面简化
- [ ] 简化首页
- [ ] 隐藏次要页面入口
- [ ] 更新导航链接

### Phase 4: 清理和优化
- [ ] 删除未使用的导入
- [ ] 优化样式
- [ ] 更新文档

---

## 九、Worktree 工作模式

### 9.1 什么是 Worktree

Git worktree 允许在同一个仓库中同时检出多个分支到不同的目录，方便并行开发。

### 9.2 Worktree 常用命令

```bash
# 查看现有 worktree
git worktree list

# 创建新的 worktree
git worktree add ../innate-website-dev develop

# 创建基于特定分支的 worktree
git worktree add -b feature/ui-showcase ../innate-feature main

# 删除 worktree
git worktree remove ../innate-website-dev

# 清理已删除的 worktree 引用
git worktree prune
```

### 9.3 本项目 Worktree 建议

建议创建以下 worktree 进行并行开发：

```bash
# 主开发分支
git worktree add ../innate-main main

# UI 展示页开发
git worktree add -b feature/ui-showcase ../innate-ui-showcase main

# 布局重构
git worktree add -b refactor/layout ../innate-layout-refactor main

# 文档编写
git worktree add -b docs/update ../innate-docs main
```

### 9.4 Worktree 目录结构

```
/workspace/
├── innate/                     # 主仓库 (main 分支)
├── innate-main/                # main 分支工作区
├── innate-ui-showcase/         # UI 展示功能开发
├── innate-layout-refactor/     # 布局重构开发
└── innate-docs/                # 文档更新
```

### 9.5 Worktree 工作流程

```bash
# 1. 在主仓库创建并切换到新分支
cd /workspace/innate
git checkout -b feature/ui-showcase

# 2. 创建对应的 worktree
git worktree add ../innate-ui-showcase feature/ui-showcase

# 3. 在新 worktree 中开发
cd ../innate-ui-showcase
# ... 进行开发工作

# 4. 提交更改
git add .
git commit -m "Add UI showcase page"

# 5. 推送分支
git push -u origin feature/ui-showcase

# 6. 清理 worktree (完成后)
git worktree remove ../innate-ui-showcase
git branch -d feature/ui-showcase
```

---

## 十、总结

### 10.1 项目状态
- **技术栈**: Next.js 16 + React 19 + TypeScript 6 + Tailwind CSS 4
- **架构**: Monorepo (pnpm workspaces)
- **组件**: 50+ 个 UI 组件

### 10.2 下一步行动
1. 使用 worktree 创建开发分支
2. 简化首页为 UI 组件展示
3. 隐藏次要页面和内容
4. 保留代码但减少页面复杂度

### 10.3 文档位置
- 本文档: `docs/project-skeleton-analysis.md`
- UI 术语: `docs/ui-terminology.md`
- 任务列表: `docs/tasks/tasks.md`
