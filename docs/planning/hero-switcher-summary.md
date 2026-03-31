# Hero Section 多设计方案切换系统

**实现日期**: 2026-03-27  
**功能**: 用户可以通过 UI 切换 4 种不同的 Hero Section 设计

---

## 功能演示

```
┌────────────────────────────────────────────────────────────┐
│                                           ┌─────────────┐  │
│                                           │ Design:     │  │
│                                           │ Dynamic     │  │
│   [Hero Section Content]                  │ Grid ▼      │  │
│                                           └─────────────┘  │
│                                                            │
│   ┌────────────────────────────────────────────────────┐  │
│   │                                                    │  │
│   │              Hero Section Content                  │  │
│   │         (根据选择的设计动态变化)                     │  │
│   │                                                    │  │
│   └────────────────────────────────────────────────────┘  │
│                                                            │
└────────────────────────────────────────────────────────────┘

点击 "Design: xxx" 按钮:
┌────────────────────────────────────────────────────────────┐
│                                           ┌─────────────┐  │
│                                           │ Design:     │  │
│   [Hero Section Content]                  │ Dynamic     │  │
│                                           │ Grid ▼      │  │
│   ┌───────────────────────────────┐       └─────────────┘  │
│   │ ○ Dynamic Grid               │                        │
│   │   Animated background...     │                        │
│   ├───────────────────────────────┤                        │
│   │ ○ Split Layout               │                        │
│   │   Side-by-side with...       │                        │
│   ├───────────────────────────────┤                        │
│   │ ○ Immersive                  │                        │
│   │   Full-screen with...        │                        │
│   ├───────────────────────────────┤                        │
│   │ ○ Geometric                  │                        │
│   │   Shapes with feature...     │                        │
│   └───────────────────────────────┘                        │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## 四种设计方案

### 1. Variant A: Dynamic Grid ⭐ (默认)

**特点**:
- 动态渐变网格背景
- 浮动渐变圆装饰 (3个不同速度)
- 统计数据展示: 1.2K+ Members | 50+ Courses | 100+ Articles
- 双 CTA: "Explore Courses" + "View Feed"
- Logo 轻微浮动动画

**适用场景**: 想展示平台规模和活跃度的产品

**动画**:
- 网格背景固定
- 3个渐变圆以不同速度 pulse
- Logo 上下浮动 (6秒周期)

---

### 2. Variant B: Split Layout

**特点**:
- 左右分屏布局
- 左侧: Logo + 装饰圆点 + "INNATE" 文字
- 右侧: 大标题 + 描述 + CTA + 最新帖子
- 最新3篇社区帖子卡片预览

**适用场景**: 强调社区活跃度和内容更新

**动画**:
- Logo 浮动 (6秒)
- 8个装饰圆点不同速度浮动
- 2个几何形状旋转
- 帖子卡片悬停效果

---

### 3. Variant C: Immersive

**特点**:
- 全屏高度 (100vh)
- 视差滚动效果 (3层背景以不同速度移动)
- 星空闪烁效果 (20个小点随机闪烁)
- 大标题 "INNATE" 字母间距
- 居中简洁布局

**适用场景**: 追求高端、简洁、沉浸感的品牌

**动画**:
- 3层背景视差滚动
- 20个星星随机闪烁
- 滚动指示器跳动

---

### 4. Variant D: Geometric

**特点**:
- 8个几何形状装饰 (圆、方、菱形)
- 三列功能卡片 (Learn / Practice / Log)
- 右侧堆叠卡片装饰
- 温暖的品牌配色

**适用场景**: 教育产品、强调功能特点

**动画**:
- 8个几何形状浮动 + 轻微旋转
- 卡片悬停上浮 + 阴影
- 图标悬停放大

---

## 技术实现

### 文件结构
```
components/hero/
├── index.ts              # 统一导出
├── hero-switcher.tsx     # 切换器组件 (主逻辑)
├── hero-variant-a.tsx    # Dynamic Grid 实现
├── hero-variant-b.tsx    # Split Layout 实现
├── hero-variant-c.tsx    # Immersive 实现
└── hero-variant-d.tsx    # Geometric 实现
```

### 核心逻辑 (hero-switcher.tsx)

```typescript
// 定义变体类型
type HeroVariant = "a" | "b" | "c" | "d"

// 变体配置
const variants = [
  { id: "a", label: "Dynamic Grid", component: HeroVariantA },
  { id: "b", label: "Split Layout", component: HeroVariantB },
  { id: "c", label: "Immersive", component: HeroVariantC },
  { id: "d", label: "Geometric", component: HeroVariantD },
]

// 状态管理
const [currentVariant, setCurrentVariant] = useState<HeroVariant>("a")

// 持久化到 localStorage
useEffect(() => {
  localStorage.setItem("hero-variant", currentVariant)
}, [currentVariant])

// 切换动画 (framer-motion)
<AnimatePresence mode="wait">
  <motion.div
    key={currentVariant}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
  >
    <CurrentComponent />
  </motion.div>
</AnimatePresence>
```

### 全局 CSS 动画

```css
/* 浮动动画 */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

/* 渐变 pulse */
@keyframes pulse-slow {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.05); }
}

/* 星星闪烁 */
@keyframes twinkle {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}
```

---

## 使用指南

### 对于用户

1. **访问首页** (`/`)
2. **找到切换按钮**: 页面右上角 "Design: xxx"
3. **点击按钮**: 展开下拉菜单
4. **选择设计**: 点击喜欢的设计
5. **自动保存**: 选择自动保存到浏览器，下次访问保持

### 对于开发者

**添加新设计**:
```typescript
// 1. 创建组件
// components/hero/hero-variant-e.tsx
export function HeroVariantE() {
  return <section>...</section>
}

// 2. 注册到 switcher
const variants = [
  ...
  { id: "e", label: "New Design", component: HeroVariantE },
]
```

**修改现有设计**:
直接编辑对应的 `hero-variant-x.tsx` 文件

---

## 性能优化

1. **代码分割**: 每个变体独立文件，按需加载
2. **动画性能**: 使用 CSS transform 和 opacity
3. **减少重绘**: 避免修改 layout 属性
4. **localStorage**: 最小化读写 (只在切换时保存)

---

## 浏览器兼容性

- ✅ Chrome / Edge (推荐)
- ✅ Firefox
- ✅ Safari
- ✅ 移动端浏览器

**注意**: 部分动画在低性能设备上可能不流畅

---

## 后续扩展建议

1. **添加更多设计**
   - 深色主题版本
   - 季节性主题 (春节、圣诞等)
   - 用户自定义配色

2. **A/B 测试**
   - 记录用户选择数据
   - 分析最受欢迎的设计
   - 优化默认选择

3. **动画控制**
   - 添加 "减少动画" 选项
   - 尊重用户系统偏好 (prefers-reduced-motion)

4. **预览模式**
   - 切换前显示缩略图预览
   - 实时预览效果

---

## 总结

这个多设计方案切换系统允许:
- ✅ 用户自由选择喜欢的设计风格
- ✅ 开发者快速迭代和测试不同设计
- ✅ 收集用户偏好数据
- ✅ 保持代码整洁和可维护性

**推荐默认**: Variant A (Dynamic Grid) - 平衡了视觉效果和信息密度

---

*实现完成时间: 2026-03-27*  
*使用技术: React + TypeScript + Framer Motion + Tailwind CSS*
