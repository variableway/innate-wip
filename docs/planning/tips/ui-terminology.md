# UI 术语速查手册

本文档为前端开发初学者提供常见的 UI 布局、组件和 CSS 术语说明，并结合项目中的 shadcn/ui 组件进行解释。

---

## 目录

1. [布局模式 (Layout Patterns)](#1-布局模式-layout-patterns)
2. [UI 组件术语 (UI Components)](#2-ui-组件术语-ui-components)
3. [CSS 常用概念 (CSS Concepts)](#3-css-常用概念-css-concepts)
4. [项目组件对照表](#4-项目组件对照表)

---

## 1. 布局模式 (Layout Patterns)

### 1.1 页面级布局

#### Header (页头)
- **定义**: 页面顶部区域，通常包含 Logo、导航菜单、用户信息等
- **常见元素**: Logo、Navigation、Search、User Avatar
- **示例场景**: 网站顶部导航栏

#### Sidebar (侧边栏)
- **定义**: 页面侧面的垂直导航区域
- **特点**: 可折叠、支持多级菜单
- **项目组件**: `Sidebar`
- **示例场景**: 后台管理系统的左侧菜单

#### Footer (页脚)
- **定义**: 页面底部区域，包含版权信息、链接等
- **常见元素**: 版权声明、联系方式、社交链接

#### Main Content (主内容区)
- **定义**: 页面的核心内容展示区域
- **特点**: 响应式、可滚动

### 1.2 常见布局模式

#### Holy Grail Layout (圣杯布局)
```
+------------------+
|     Header       |
+--------+---------+
| Side   |  Main   |
| bar    | Content |
+--------+---------+
|     Footer       |
+------------------+
```
- **特点**: 三栏布局，中间内容区自适应
- **适用场景**: 传统网站、后台管理系统

#### F-Pattern Layout (F型布局)
```
+------------------+
| Header           |
+------------------+
| Nav | Content    |
|     | Content    |
|     | Content    |
+-----+------------+
```
- **特点**: 用户视线呈 F 形浏览
- **适用场景**: 新闻网站、博客

#### Card Layout (卡片布局)
```
+--------+  +--------+  +--------+
| Card 1 |  | Card 2 |  | Card 3 |
+--------+  +--------+  +--------+
```
- **特点**: 内容模块化、易于响应式
- **项目组件**: `Card`
- **适用场景**: 商品展示、文章列表

#### Grid Layout (网格布局)
- **定义**: 使用 CSS Grid 实现的二维布局系统
- **特点**: 行列可自由定义、支持响应式
- **CSS 属性**: `display: grid`, `grid-template-columns`, `grid-gap`

#### Flex Layout (弹性布局)
- **定义**: 使用 Flexbox 实现的一维布局系统
- **特点**: 子元素自动分配空间
- **CSS 属性**: `display: flex`, `justify-content`, `align-items`

### 1.3 响应式断点

| 断点名称 | 宽度范围 | Tailwind 前缀 | 典型设备 |
|---------|---------|--------------|---------|
| xs | < 640px | (默认) | 手机竖屏 |
| sm | ≥ 640px | `sm:` | 手机横屏 |
| md | ≥ 768px | `md:` | 平板 |
| lg | ≥ 1024px | `lg:` | 小屏笔记本 |
| xl | ≥ 1280px | `xl:` | 桌面显示器 |
| 2xl | ≥ 1536px | `2xl:` | 大屏显示器 |

---

## 2. UI 组件术语 (UI Components)

### 2.1 基础输入组件

#### Button (按钮)
- **定义**: 可点击的交互元素，触发操作
- **变体**: Primary、Secondary、Outline、Ghost、Destructive
- **项目组件**: `Button`, `ButtonGroup`
- **示例**: 提交表单、确认操作

#### Input (输入框)
- **定义**: 单行文本输入控件
- **变体**: Text、Password、Email、Number
- **项目组件**: `Input`, `InputGroup`
- **示例**: 用户名输入、搜索框

#### Textarea (文本域)
- **定义**: 多行文本输入控件
- **项目组件**: `Textarea`
- **示例**: 评论输入、描述填写

#### Select (选择器)
- **定义**: 下拉选择控件
- **特点**: 单选或多选
- **项目组件**: `Select`
- **示例**: 国家选择、分类筛选

#### Checkbox (复选框)
- **定义**: 多选控件
- **特点**: 可同时选择多个选项
- **项目组件**: `Checkbox`
- **示例**: 兴趣爱好、权限设置

#### Radio (单选框)
- **定义**: 单选控件
- **特点**: 同组内只能选择一个
- **项目组件**: `RadioGroup`
- **示例**: 性别选择、支付方式

#### Switch (开关)
- **定义**: 二元状态切换控件
- **特点**: 开/关两种状态
- **项目组件**: `Switch`
- **示例**: 深色模式开关、通知设置

#### Slider (滑块)
- **定义**: 数值范围选择控件
- **特点**: 拖动选择数值
- **项目组件**: `Slider`
- **示例**: 音量调节、价格范围

### 2.2 表单相关

#### Form (表单)
- **定义**: 收集用户输入的容器
- **项目组件**: `Form`, `Field`
- **常见功能**: 验证、提交、重置

#### Label (标签)
- **定义**: 表单字段的文字说明
- **项目组件**: `Label`
- **作用**: 提高可访问性

#### Input OTP (验证码输入)
- **定义**: 一次性密码输入控件
- **项目组件**: `InputOTP`
- **示例**: 短信验证码、邮箱验证码

### 2.3 数据展示组件

#### Table (表格)
- **定义**: 结构化数据展示
- **特点**: 行列结构、支持排序/筛选
- **项目组件**: `Table`
- **示例**: 用户列表、订单记录

#### Card (卡片)
- **定义**: 内容容器，将相关信息组合
- **特点**: 边框、阴影、圆角
- **项目组件**: `Card`
- **示例**: 商品卡片、文章卡片

#### Badge (徽章)
- **定义**: 小型状态标签
- **项目组件**: `Badge`
- **示例**: 新消息数量、状态标签

#### Avatar (头像)
- **定义**: 用户或实体的图形表示
- **项目组件**: `Avatar`
- **示例**: 用户头像、团队图标

#### Progress (进度条)
- **定义**: 显示任务完成进度
- **项目组件**: `Progress`
- **示例**: 文件上传进度、安装进度

#### Skeleton (骨架屏)
- **定义**: 内容加载时的占位符
- **项目组件**: `Skeleton`
- **作用**: 提升加载体验

#### Spinner (加载动画)
- **定义**: 旋转的加载指示器
- **项目组件**: `Spinner`
- **示例**: 数据加载中

#### Empty (空状态)
- **定义**: 无数据时的展示
- **项目组件**: `Empty`
- **示例**: 无搜索结果、空购物车

#### Chart (图表)
- **定义**: 数据可视化组件
- **项目组件**: `Chart`
- **示例**: 折线图、柱状图、饼图

### 2.4 导航组件

#### Navigation Menu (导航菜单)
- **定义**: 页面或功能导航
- **项目组件**: `NavigationMenu`
- **示例**: 顶部导航、下拉菜单

#### Breadcrumb (面包屑)
- **定义**: 显示当前页面在层级中的位置
- **项目组件**: `Breadcrumb`
- **示例**: 首页 > 产品 > 详情

#### Pagination (分页)
- **定义**: 长列表的分页导航
- **项目组件**: `Pagination`
- **示例**: 搜索结果分页

#### Menubar (菜单栏)
- **定义**: 水平菜单组件
- **项目组件**: `Menubar`
- **示例**: 应用程序顶部菜单

#### Tabs (标签页)
- **定义**: 内容分组切换
- **项目组件**: `Tabs`
- **示例**: 设置页面的不同配置组

### 2.5 反馈组件

#### Alert (警告)
- **定义**: 重要信息提示
- **变体**: Info、Success、Warning、Error
- **项目组件**: `Alert`
- **示例**: 操作成功、错误提示

#### Toast (消息提示)
- **定义**: 轻量级反馈消息
- **特点**: 自动消失、不打断用户
- **项目组件**: `Toast`, `Sonner`
- **示例**: 保存成功、复制成功

#### Dialog (对话框)
- **定义**: 模态窗口，需要用户响应
- **项目组件**: `Dialog`, `AlertDialog`
- **示例**: 确认删除、表单填写

#### Tooltip (工具提示)
- **定义**: 鼠标悬停时显示的补充信息
- **项目组件**: `Tooltip`
- **示例**: 按钮功能说明

#### Popover (弹出框)
- **定义**: 点击触发的浮层内容
- **项目组件**: `Popover`
- **示例**: 日期选择器、颜色选择器

#### Hover Card (悬停卡片)
- **定义**: 悬停显示的卡片内容
- **项目组件**: `HoverCard`
- **示例**: 用户信息卡片预览

### 2.6 覆盖层组件

#### Sheet (抽屉)
- **定义**: 从屏幕边缘滑入的面板
- **变体**: Top、Right、Bottom、Left
- **项目组件**: `Sheet`
- **示例**: 移动端菜单、购物车

#### Drawer (抽屉)
- **定义**: 侧边滑出的面板
- **项目组件**: `Drawer`
- **示例**: 筛选面板

#### Dropdown Menu (下拉菜单)
- **定义**: 点击展开的操作列表
- **项目组件**: `DropdownMenu`
- **示例**: 更多操作、用户菜单

#### Context Menu (右键菜单)
- **定义**: 右键触发的上下文菜单
- **项目组件**: `ContextMenu`
- **示例**: 右键操作列表

### 2.7 容器组件

#### Accordion (手风琴)
- **定义**: 可折叠的内容区域
- **特点**: 同时只展开一个或多个
- **项目组件**: `Accordion`
- **示例**: FAQ 列表

#### Collapsible (可折叠)
- **定义**: 可展开/收起的内容区域
- **项目组件**: `Collapsible`
- **示例**: 高级选项

#### Scroll Area (滚动区域)
- **定义**: 自定义滚动条的容器
- **项目组件**: `ScrollArea`
- **作用**: 美化滚动条样式

#### Resizable (可调整大小)
- **定义**: 可拖动调整大小的区域
- **项目组件**: `Resizable`
- **示例**: 代码编辑器面板

#### Separator (分隔线)
- **定义**: 视觉分隔元素
- **项目组件**: `Separator`
- **示例**: 内容分组

### 2.8 其他组件

#### Calendar (日历)
- **定义**: 日期选择器
- **项目组件**: `Calendar`
- **示例**: 预约日期选择

#### Carousel (轮播)
- **定义**: 内容滑动展示
- **项目组件**: `Carousel`
- **示例**: 图片轮播、商品展示

#### Toggle (切换按钮)
- **定义**: 可切换状态的按钮
- **项目组件**: `Toggle`, `ToggleGroup`
- **示例**: 粗体/斜体切换

#### Kbd (键盘按键)
- **定义**: 键盘按键样式
- **项目组件**: `Kbd`
- **示例**: 快捷键提示 `Ctrl + S`

#### Aspect Ratio (宽高比)
- **定义**: 固定宽高比的容器
- **项目组件**: `AspectRatio`
- **示例**: 16:9 视频容器

---

## 3. CSS 常用概念 (CSS Concepts)

### 3.1 盒模型 (Box Model)

```
+------------------------------------------+
|                 Margin                    |
|  +------------------------------------+  |
|  |              Border                |  |
|  |  +----------------------------+  |  |
|  |  |         Padding            |  |  |
|  |  |  +----------------------+  |  |  |
|  |  |  |      Content         |  |  |  |
|  |  |  +----------------------+  |  |  |
|  |  +----------------------------+  |  |
|  +------------------------------------+  |
+------------------------------------------+
```

- **Content**: 内容区域
- **Padding**: 内边距（内容与边框之间）
- **Border**: 边框
- **Margin**: 外边距（元素与其他元素之间）

### 3.2 定位 (Position)

| 定位类型 | CSS 值 | 说明 |
|---------|--------|------|
| 静态定位 | `static` | 默认，按文档流排列 |
| 相对定位 | `relative` | 相对自身原位置偏移 |
| 绝对定位 | `absolute` | 相对最近的非 static 父元素 |
| 固定定位 | `fixed` | 相对视口固定 |
| 粘性定位 | `sticky` | 滚动时在指定位置固定 |

### 3.3 显示类型 (Display)

| 类型 | 说明 | 常用场景 |
|------|------|---------|
| `block` | 块级元素，独占一行 | div、p、h1-h6 |
| `inline` | 行内元素，不换行 | span、a |
| `inline-block` | 行内块，可设宽高 | 按钮、图标 |
| `flex` | 弹性布局 | 一维布局 |
| `grid` | 网格布局 | 二维布局 |
| `none` | 隐藏元素 | 条件显示 |

### 3.4 Flexbox 常用属性

#### 容器属性
| 属性 | 说明 | 常用值 |
|------|------|--------|
| `flex-direction` | 主轴方向 | `row`, `column` |
| `justify-content` | 主轴对齐 | `center`, `space-between` |
| `align-items` | 交叉轴对齐 | `center`, `flex-start` |
| `flex-wrap` | 是否换行 | `wrap`, `nowrap` |
| `gap` | 子元素间距 | `1rem`, `16px` |

#### 子项属性
| 属性 | 说明 |
|------|------|
| `flex-grow` | 放大比例 |
| `flex-shrink` | 缩小比例 |
| `flex-basis` | 初始大小 |
| `align-self` | 单独对齐方式 |

### 3.5 Grid 常用属性

#### 容器属性
| 属性 | 说明 | 示例 |
|------|------|------|
| `grid-template-columns` | 列定义 | `repeat(3, 1fr)` |
| `grid-template-rows` | 行定义 | `auto 1fr auto` |
| `gap` | 间距 | `1rem` |
| `grid-area` | 区域命名 | `"header header"` |

#### 子项属性
| 属性 | 说明 |
|------|------|
| `grid-column` | 跨列 |
| `grid-row` | 跨行 |
| `grid-area` | 指定区域 |

### 3.6 常用单位

| 单位类型 | 单位 | 说明 |
|---------|------|------|
| 绝对单位 | `px` | 像素 |
| 相对单位 | `%` | 相对父元素 |
| 相对单位 | `em` | 相对自身字体大小 |
| 相对单位 | `rem` | 相对根元素字体大小 |
| 视口单位 | `vw` | 视口宽度的 1% |
| 视口单位 | `vh` | 视口高度的 1% |
| 自动计算 | `auto` | 浏览器自动计算 |

### 3.7 层叠上下文 (Z-Index)

- **定义**: 控制元素的堆叠顺序
- **规则**: 值越大越靠上
- **注意**: 只有定位元素（非 static）才生效
- **Tailwind**: `z-0`, `z-10`, `z-20`, `z-30`, `z-40`, `z-50`

### 3.8 过渡与动画

#### Transition (过渡)
```css
transition: property duration timing-function delay;
/* 示例 */
transition: all 0.3s ease-in-out;
```

#### Animation (动画)
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
animation: fadeIn 0.3s ease-out;
```

### 3.9 Tailwind CSS 常用类

#### 间距
| 类名 | 说明 |
|------|------|
| `p-{n}` | padding |
| `m-{n}` | margin |
| `px-{n}` | padding 左右 |
| `py-{n}` | padding 上下 |
| `gap-{n}` | flex/grid 间距 |

#### 尺寸
| 类名 | 说明 |
|------|------|
| `w-{n}` | width |
| `h-{n}` | height |
| `min-w-{n}` | min-width |
| `max-w-{n}` | max-width |

#### 文字
| 类名 | 说明 |
|------|------|
| `text-{size}` | 字体大小 |
| `font-{weight}` | 字体粗细 |
| `text-{color}` | 文字颜色 |
| `leading-{n}` | 行高 |
| `tracking-{n}` | 字间距 |

#### 背景
| 类名 | 说明 |
|------|------|
| `bg-{color}` | 背景色 |
| `bg-gradient-to-{dir}` | 渐变方向 |
| `bg-{image}` | 背景图 |

#### 边框
| 类名 | 说明 |
|------|------|
| `border` | 边框 |
| `rounded-{size}` | 圆角 |
| `border-{color}` | 边框颜色 |

---

## 4. 项目组件对照表

### 按功能分类

| 分类 | 组件 | 说明 |
|------|------|------|
| **表单输入** | Button, Input, Textarea, Select, Checkbox, RadioGroup, Switch, Slider, Form, Field, Label, InputOTP | 用户输入和交互 |
| **数据展示** | Table, Card, Badge, Avatar, Progress, Skeleton, Spinner, Empty, Chart, Calendar | 展示数据内容 |
| **导航** | NavigationMenu, Breadcrumb, Pagination, Menubar, Tabs, Sidebar | 页面和功能导航 |
| **反馈** | Alert, Toast, Sonner, Tooltip, Spinner | 用户操作反馈 |
| **覆盖层** | Dialog, AlertDialog, Sheet, Drawer, Popover, DropdownMenu, ContextMenu, HoverCard | 浮层内容 |
| **容器** | Accordion, Collapsible, ScrollArea, Resizable, Separator, AspectRatio | 内容组织和布局 |
| **其他** | Carousel, Toggle, ToggleGroup, Kbd, Command, Item | 辅助功能 |

### 组件使用场景速查

| 场景 | 推荐组件 |
|------|---------|
| 表单提交 | `Form` + `Field` + `Button` |
| 数据列表 | `Table` 或 `Card` + `Pagination` |
| 操作确认 | `AlertDialog` |
| 信息提示 | `Toast` / `Sonner` |
| 用户菜单 | `DropdownMenu` |
| 内容分组 | `Tabs` 或 `Accordion` |
| 加载状态 | `Skeleton` 或 `Spinner` |
| 空数据 | `Empty` |
| 移动端导航 | `Sheet` |
| 快捷操作 | `Tooltip` + `Kbd` |

---

## 快速参考

### 常见问题

**Q: 什么时候用 Dialog vs Sheet?**
- Dialog: 需要用户立即响应的确认类操作
- Sheet: 侧边滑出的内容展示，如移动端菜单

**Q: 什么时候用 Alert vs Toast?**
- Alert: 需要用户注意的重要信息，常驻显示
- Toast: 轻量反馈，自动消失

**Q: 什么时候用 Popover vs Tooltip?**
- Popover: 包含交互内容（如表单、按钮）
- Tooltip: 纯文本提示，无交互

**Q: 如何选择布局方式？**
- 一维布局（横向或纵向排列）: Flexbox
- 二维布局（行列网格）: Grid
- 简单响应式: Tailwind 响应式类

---

*本文档持续更新中，如有疑问请参考项目组件源码或咨询团队成员。*
