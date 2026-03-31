# Innate 主页重新设计计划

## 一、Assets 分析

### 1.1 视觉资产

**Logo/头像图片** (`innate_github_avatar_v4.png`)
- **构图**: 圆形设计，中心发光球体 + 环绕几何体
- **色彩主题**:
  - 中心: 暖黄色/金色光芒 (#F5E6C8, #FFE4B5)
  - 绿色: 鼠尾草绿/灰绿色 (#8FA68E, #A8C5A8)
  - 蓝色: 灰蓝色/雾霾蓝 (#7A9CAE, #9BB5C4)
  - 橙色: 赤陶色/暖橙色 (#D4845E, #E89B73)
  - 米色: 奶油白/暖白色 (#F5F0E6, #E8E0D0)
- **视觉隐喻**: 多样性中的统一、创造与构建、围绕核心发光体

**主题文档** (`Innate_What_drives_you,_and_what_you_makes,_make_you..pdf`)
- **文件暗示的主题**: "What drives you, and what you makes, make you"
- **核心理念**: 内在驱动力、创造力、个人/团队身份认同

### 1.2 主题关键词

- **Innate** (天生的、内在的)
- **Drive** (驱动力)
- **Create/Make** (创造)
- **Diversity in Unity** (多样统一)
- **Warm & Organic** (温暖有机)

---

## 二、当前主页问题

### 2.1 现状

当前首页 (`/`) 是 Deep News Feed：
- 左侧: LeftBar (全局导航)
- 中间: Sidebar (频道列表) 
- 右侧: Deep News 帖子流

### 2.2 问题

1. **品牌认知弱** - 没有展示 Innate 的视觉形象和核心理念
2. **内容分散** - 直接显示 Feed，缺乏引导性
3. **配色不匹配** - 当前配色与品牌视觉资产不协调
4. **无层次感** - 缺少 Hero 区域和清晰的视觉焦点

---

## 三、重新设计目标

1. **建立品牌认知** - 突出 Innate 视觉形象和核心理念
2. **清晰导航** - 引导用户发现内容
3. **温暖体验** - 配色与视觉资产保持一致
4. **保留功能** - 不丢失现有的 LeftBar/Sidebar 布局系统

---

## 四、设计方案

### 4.1 整体布局

```
┌─────────────────────────────────────────────────────────────────┐
│ LeftBar │  Sidebar  │              Main Content                 │
├─────────┼───────────┼─────────────────────────────────────────────┤
│         │           │  ┌─────────────────────────────────────┐   │
│   🏠    │  Main     │  │         HERO SECTION                │   │
│   🔍    │  Nav      │  │  ┌─────┐                            │   │
│   📚    │           │  │  │Logo │   Innate                   │   │
│   📌    │  Feed     │  │  └─────┘   What drives you...        │   │
│   🔔    │  Learn    │  │                                     │   │
│         │  News     │  │  [Explore] [Learn More]             │   │
│   ➕    │           │  └─────────────────────────────────────┘   │
│         ├───────────┼─────────────────────────────────────────────┤
│         │Categories │  ┌─────────────────────────────────────┐   │
│         │ Courses   │  │      FEATURED SECTIONS              │   │
│         │ Community │  │  ┌─────────┐ ┌─────────┐ ┌────────┐ │   │
│         │           │  │  │Courses  │ │Community│ │News    │ │   │
│         │           │  │  │Card     │ │Card     │ │Card    │ │   │
│         │           │  │  └─────────┘ └─────────┘ └────────┘ │   │
│         │           │  └─────────────────────────────────────┘   │
│         │           │                                             │
│         │           │  ┌─────────────────────────────────────┐   │
│         │           │  │      RECENT CONTENT                 │   │
│         │           │  │  (Optional: Show recent posts)      │   │
│         │           │  └─────────────────────────────────────┘   │
└─────────┴───────────┴─────────────────────────────────────────────┘
```

### 4.2 配色方案

基于 Logo 提取的品牌色：

```css
:root {
  /* Primary - 中心发光体 */
  --innate-primary: #F5E6C8;
  --innate-primary-dark: #E8D4A0;
  --innate-glow: rgba(255, 228, 181, 0.3);
  
  /* Secondary Colors - 几何体 */
  --innate-sage: #8FA68E;        /* 鼠尾草绿 */
  --innate-sage-light: #A8C5A8;
  
  --innate-slate: #7A9CAE;       /* 灰蓝色 */
  --innate-slate-light: #9BB5C4;
  
  --innate-terracotta: #D4845E;  /* 赤陶色 */
  --innate-terracotta-light: #E89B73;
  
  --innate-cream: #F5F0E6;       /* 奶油白 */
  --innate-warm-white: #E8E0D0;
  
  /* Background */
  --innate-bg: #FAF8F3;          /* 暖白色背景 */
  --innate-bg-card: #FFFFFF;
  
  /* Text */
  --innate-text: #2D2A26;        /* 暖黑色 */
  --innate-text-muted: #6B6560;  /* 暖灰色 */
}
```

### 4.3 Hero Section 设计

**视觉元素**:
- 左侧: Innate Logo (圆形头像)
- 右侧: 品牌标语 + 简介
- 背景: 微妙的渐变或 Logo 元素的装饰图案
- CTA 按钮: "Explore" (主按钮) + "Learn More" (次按钮)

**文案**:
```
标题: Innate
副标题: What drives you, and what you makes, make you.
描述: A community for creators, builders, and lifelong learners.
```

### 4.4 Featured Sections

展示 3-4 个核心板块：

1. **Learning Library** 📚
   - 图标: 书本/毕业帽
   - 描述: Explore courses and tutorials
   - 链接: /learning-library

2. **Community** 👥
   - 图标: 人群/对话气泡
   - 描述: Connect with like-minded creators
   - 链接: /discover

3. **Deep News** 📰
   - 图标: 报纸
   - 描述: Latest insights and updates
   - 链接: /deep-news

4. **Get Started** 🚀 (可选)
   - 新手引导入口

---

## 五、实施计划

### ✅ 已完成

**Phase 1: 基础**
- [x] 1.1 将 Logo 复制到 `public/innate-logo.png`
- [x] 1.2 在 `globals.css` 中添加品牌色变量

**Phase 2: 组件开发**
- [x] 2.1 创建 `HeroSection` 组件 (`components/hero-section.tsx`)
- [x] 2.2 创建 `FeaturedSection` 组件 (`components/featured-section.tsx`)

**Phase 3: 页面整合**
- [x] 3.1 更新 `app/page.tsx` 使用新组件

**Phase 4: 细节优化**
- [x] 4.1 构建测试通过
- [x] 4.2 响应式布局支持

### 🔮 可选优化 (未来)
- [ ] 添加背景装饰元素动画
- [ ] 添加页面加载动画
- [ ] 社区统计数据展示

---

## 六、创建的文件

### 新文件
1. `apps/web/public/innate-logo.png` - 品牌 Logo
2. `apps/web/components/hero-section.tsx` - Hero 区域组件
3. `apps/web/components/featured-section.tsx` - 特色板块组件

### 修改的文件
1. `apps/web/app/globals.css` - 添加品牌色变量
2. `apps/web/app/page.tsx` - 重构为新的主页结构

---

## 七、预期效果

### 设计效果
- 品牌识别度提升 - Logo 和标语醒目展示
- 视觉一致性 - 配色与品牌资产统一
- 温暖体验 - 使用自然、柔和的色调

### 用户体验
- 清晰的导航入口 - 3个核心板块一目了然
- 减少认知负荷 - 不再直接展示 Feed
- 更好的第一印象 - Hero 区域传达品牌价值

### 技术影响
- 保持现有布局系统 - LeftBar + Sidebar 不变
- 新增独立组件 - 易于维护和复用
- 可扩展性强 - 后续可轻松添加更多板块

---

## 八、参考资源

### 图片资源
- Logo: `assets/innate_github_avatar_v4.png`
- 主题文档: `assets/Innate_What_drives_you,_and_what_you_makes,_make_you..pdf`

### 配色参考
```
Primary:    #F5E6C8 (暖黄)
Sage:       #8FA68E (鼠尾草绿)
Slate:      #7A9CAE (灰蓝)
Terracotta: #D4845E (赤陶)
Cream:      #F5F0E6 (奶油)
```

---

*文档生成时间: 2026-03-27*
*基于 Assets 分析*
*实施完成: 2026-03-27*
