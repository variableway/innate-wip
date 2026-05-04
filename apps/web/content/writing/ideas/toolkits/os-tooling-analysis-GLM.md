# OS TOOLING 整合分析报告 (GLM-5.1 独立调研)

> 生成日期: 2026-04-14
> 模型: GLM-5.1
> 说明: 本报告完全基于独立调研，不参考已有分析报告
> 主题: 截屏/录屏/分屏工具开源生态调研 + Obsidian 集成方案 + 可行路径

---

## 一、开源工具全景调研

### 1. macOS 工具生态

#### 截屏工具 (Screenshot)

| 工具 | Stars | 技术栈 | License | 核心亮点 |
|---|---:|---|---|---|
| [macshot](https://github.com/sw33tLie/macshot) | ~3,000+ | Swift/AppKit (原生) | 开源 | **macOS 最全能开源截图工具**: 截屏+录屏+OCR+滚动截屏+完整标注+PII自动脱敏+AI模糊人脸，定位为免费 CleanShot X。原生 Swift，仅 8MB |
| [DodoShot](https://github.com/DodoApps/dodoshot) | ~500-1,000 | SwiftUI (原生) | 开源 | 轻量 CleanShot X 替代品，SwiftUI 界面精致 |
| [Snipp](https://github.com/codehakase/snipp) | ~200-500 | Rust + Tauri v2 | 开源 | **极简 Rust 截图工具**，Tauri 插件架构支持扩展，极轻量 |
| [Flameshot](https://github.com/flameshot-org/flameshot) | ~25,000+ | C++/Qt | GPLv3 | 跨平台标注工具标杆，CLI 支持完善，macOS 非主要平台但可用 |
| [ksnip](https://github.com/ksnip/ksnip) | ~2,000-3,000 | C++/Qt | GPLv2 | 跨平台截图+丰富标注，Wayland 支持，标签式界面 |

#### 录屏工具 (Screen Recording)

| 工具 | Stars | 技术栈 | License | 核心亮点 |
|---|---:|---|---|---|
| [Kap](https://github.com/wulkano/Kap) | ~18,000+ | TypeScript/Electron | MIT | macOS 最流行的开源录屏。导出 GIF/MP4/WebM/APNG，**成熟 JS 插件系统** |
| [QuickRecorder](https://github.com/lihaoyun6/QuickRecorder) | ~8,200+ | SwiftUI + ScreenCaptureKit | 开源 | **驱动级内录音频**（无需额外驱动），HEVC with Alpha，Presenter Overlay，仅 10MB。Lifehacker 推荐 |
| [OpenScreen](https://github.com/siddharthvaddem/openscreen) | ~15,700+ | Electron + React + PixiJS | **MIT** | **Screen Studio ($29/月) 的免费替代**。自动缩放、精美背景、流畅转场，专为产品演示录制 |
| [BetterCapture](https://github.com/jsattler/BetterCapture) | ~1,000-2,000 | SwiftUI + ScreenCaptureKit | 开源 | 专业编码 (ProRes 422/4444, HEVC, H.264)，隐私优先 |
| [Gifski](https://github.com/sindresorhus/Gifski) | ~7,500+ | Swift + Rust (编码器) | MIT (CLI) | 最高质量 GIF 转换，跨帧调色板+时序抖动，数千色/帧。CLI + GUI 双形态 |

#### 窗口管理 / 分屏 (Window Management)

| 工具 | Stars | 技术栈 | License | 核心亮点 |
|---|---:|---|---|---|
| [Rectangle](https://github.com/rxhanson/Rectangle) | ~26,000+ | Swift | MIT | macOS 最流行的窗口管理。吸附式布局，键盘快捷键，Pro 付费版 |
| [AeroSpace](https://github.com/nikitabobko/AeroSpace) | ~12,000+ | Swift | 开源 | **增长最快的 macOS 平铺 WM**。i3 风格树形平铺，**无需禁用 SIP**，TOML 配置，CLI 驱动 |
| [yabai](https://github.com/koekeishiya/yabai) | ~24,000+ | C | MIT | 最强大 macOS 平铺 WM。BSP 算法，CLI 高度可编程，配合 skhd 使用。**部分功能需禁用 SIP** |
| [Amethyst](https://github.com/ianyh/Amethyst) | ~14,000+ | Swift | MIT | xmonad 风格自动平铺，GUI 配置面板，开箱即用 |
| [Hammerspoon](https://github.com/Hammerspoon/hammerspoon) | ~15,200+ | Obj-C/Lua | MIT | 终极自动化框架，Lua 脚本驱动窗口管理+热键+应用启动等一切 |

---

### 2. Windows 工具生态

#### 截屏工具

| 工具 | Stars | 技术栈 | License | 核心亮点 |
|---|---:|---|---|---|
| [ShareX](https://github.com/ShareX/ShareX) | ~30,000+ | C#/.NET (WinForms) | GPLv3 | **Windows 截屏之王**: 全屏/区域/窗口/滚动截屏+录屏(GIF/MP4)+OCR+标注+80+上传目标+自动化工作流+CLI |
| [WinShot](https://github.com/mrgoonie/winshot) | ~500-1,500 | Go + React/TS (Wails) | 开源 | **毛玻璃现代 UI** 截图工具，Wails 框架 (Go 后端+React 前端)，轻量美观 |
| [Fastshot](https://github.com/JimEverest/fastshot) | ~200-800 | (待确认) | 开源 | **GenAI 驱动**截图标注工具，Pin-on-top 浮窗，AI 增强工作流，面向学生/开发者/研究者 |
| [Flameshot](https://github.com/flameshot-org/flameshot) | ~25,000+ | C++/Qt | GPLv3 | 跨平台截图+即时标注，CLI 接口，Imgur 上传 |

#### 录屏工具

| 工具 | Stars | 技术栈 | License | 核心亮点 |
|---|---:|---|---|---|
| [OBS Studio](https://github.com/obsproject/obs-studio) | ~62,000+ | C/C++ | GPLv2 | 专业级录屏/直播，场景合成，多源混合，**庞大插件生态**+Python/Lua 脚本+WebSocket 远程控制 |
| [OpenScreen](https://github.com/siddharthvaddem/openscreen) | ~15,700+ | Electron + React + PixiJS | **MIT** | Screen Studio 免费替代，自动缩放+精美背景+流畅转场，**跨平台 (Mac/Win/Linux)** |
| [ScreenVivid](https://github.com/tamnguyenvan/screenvivid) | ~500-1,000 | Python | 开源 | 跨平台录屏+内置编辑，面向教程/会议/游戏 |
| [SimpleRecorderWinUI3](https://github.com/renanalencar/SimpleRecorderWinUI3) | ~100-300 | C# + WinUI 3 | 开源 | **Windows.Graphics.Capture API 参考实现**，现代 Win10/11 录屏架构范例 |

#### 窗口管理 / 分屏

| 工具 | Stars | 技术栈 | License | 核心亮点 |
|---|---:|---|---|---|
| [PowerToys/FancyZones](https://github.com/microsoft/PowerToys) | ~110,000+ | C#/.NET | **MIT** | **微软官方**，静态区域吸附布局，PowerToys 套件一部分 |
| [komorebi](https://github.com/LGUG2Z/komorebi) | ~10,000+ | Rust | 开源 | **增长最快的 Windows 平铺 WM**。BSP/i3 布局，CLI (`komorebic`)+热键守护进程 (whkd)，丰富生态系统 |
| [GlazeWM](https://github.com/glzr-io/glazewm) | ~7,000+ | Rust (v2 重写) | 开源 | i3/sway 风格，YAML 配置，v3 架构重写中，跨平台野心 (提及 macOS) |
| [FancyWM](https://github.com/FancyWM/fancywm) | ~1,100+ | C#/.NET | GPL-2.0 | 动态平铺 (垂直/水平/堆叠面板)，Microsoft Store 可安装 |

---

### 3. 跨平台 All-in-One 对比

| 工具 | 平台 | 截屏 | 录屏 | 标注 | OCR | 滚动截屏 | Stars | License |
|---|---|:---:|:---:|:---:|:---:|:---:|---:|---|
| **macshot** | macOS | Y | Y (MP4/GIF) | Y (全套) | Y | Y | ~3k | 开源 |
| **ShareX** | Windows | Y | Y (GIF/MP4) | Y (全套) | Y (Tesseract) | Y | ~30k | GPLv3 |
| **OpenScreen** | 跨平台 | N | Y | Y (编辑) | N | N | ~15.7k | **MIT** |
| **Kap** | macOS | N | Y (GIF/MP4) | N | N | N | ~18k | MIT |
| **Pypeek** | 跨平台 | Y | Y (GIF/MP4) | Y | N | N | ~100-500 | 开源 |

---

### 4. 2025-2026 关键趋势

1. **macOS 原生复兴**: macshot、QuickRecorder、BetterCapture、AeroSpace 全部基于 Swift + ScreenCaptureKit，质量接近甚至超越付费应用 (CleanShot X, Screen Studio)
2. **Rust 入侵 Windows 系统工具**: komorebi (平铺 WM)、Snipp (截图) 展示了 Rust 在系统级工具中的潜力
3. **Tauri 崛起**: Snipp (Rust + Tauri v2) 代表了 Tauri 截图工具的前沿
4. **Screen Studio 克隆潮**: OpenScreen (~15.7k stars, MIT) 和 Recordly 满足了对精美录屏演示的需求
5. **Wails 框架**: WinShot 用 Wails (Go + React) 构建现代 Windows 截图工具，Electron 的高性能替代
6. **AI 集成**: Fastshot 开创 GenAI 截图工作流，更多工具将整合 AI 标注/脱敏/自动化

---

## 二、Obsidian 集成能力深度分析

### 1. Plugin API 能力矩阵

Obsidian 桌面插件运行在 **Node.js/Electron 进程**中，无沙盒限制，拥有用户级别的完整 OS 权限。

| 能力 | 支持情况 | 实现方式 | 备注 |
|---|---|---|---|
| 命令注册 (应用内热键) | **完全支持** | `addCommand()` | 可分配快捷键，仅 Obsidian 有焦点时生效 |
| 全局快捷键 (系统级) | **不支持** | 插件无法注册全局热键 | 需外部辅助 (Alfred/Raycast/Hammerspoon) |
| 剪贴板 (文本+图片) | **完全支持** | Electron `clipboard` 模块 | `clipboard.readImage()`/`writeImage()` |
| 二进制文件创建 | **完全支持** | `vault.createBinary()` | 可直接保存图片到 Vault |
| 启动外部进程 | **完全支持** | `child_process.exec()`/`spawn()` | 可调用任意 CLI 工具 |
| HTTP 请求 | **完全支持** | `requestUrl()` / `fetch()` | 绕过 CORS |
| 文件变化监听 | **部分支持** | `vault.on('create'/'modify')` | `modify` 事件不包含 diff；外部子目录变化可能丢失 |
| 自定义 URI 处理 | **完全支持** | `registerObsidianProtocolHandler()` | 处理 `obsidian://my-action` URL |
| CLI 命令注册 (v1.12+) | **完全支持** | `registerCliHandler()` | 新功能，支持终端/Agent 集成 |
| 编辑器扩展 | **完全支持** | CodeMirror 6 扩展 | 自定义编辑器行为和 UI |
| 原生屏幕捕获 | **不可用** | `getDisplayMedia()`/`desktopCapturer` 不可靠 | 论坛确认此限制 |

### 2. 现有相关插件

| 插件 | 功能 | 与目标的差距 |
|---|---|---|
| **Vision Recall** | 监控文件夹+剪贴板+深度链接接收截图 → AI (GPT-4o/Ollama) 分析 → 自动生成结构化笔记+标签+OCR | **最接近目标**，但需要 LLM 供应商，且不能自行截图 |
| **Image Converter** | 图片格式转换、裁剪、翻转 | 纯后期处理 |
| **Excalidraw** | 完整绘图/白板，可导入图片标注 | 只能标注，不能截屏 |
| **Local REST API** | HTTPS 服务器 (端口 27124)，完整 Vault CRUD + 命令执行 | 最强大的外部集成方式 |
| **Advanced URI** | 扩展 `obsidian://` 协议，追加/替换笔记内容 | 适合外部工具触发 |

### 3. Obsidian 原生图片处理

| 维度 | 说明 |
|---|---|
| 支持格式 | `.avif`, `.bmp`, `.gif`, `.jpeg`, `.jpg`, `.png`, `.svg`, `.webp` |
| 粘贴行为 | Cmd/Ctrl+V → 自动保存为 PNG → 插入 `![[Pasted image YYYYMMDDHHMMSS.png]]` |
| 附件位置 | Settings > Files & Links 可配置：特定文件夹 / 当前文件目录 / Vault 外路径 |
| 限制 | 无内置压缩、无 OCR、无自动标签、默认 PNG 不可更改 |

### 4. 五种集成模式

| 模式 | 原理 | 优势 | 劣势 |
|---|---|---|---|
| **A. URI Scheme** | `obsidian://new?vault=...&content=...` | 最简单，任何应用都能调用 | URL 长度限制，无法传二进制 |
| **B. Local REST API** | HTTPS 端点，API Key 认证，完整 CRUD | 最强大，支持精确编辑（PATCH 指定标题/块） | 需安装插件+配置认证 |
| **C. 文件系统直写** | 外部工具写入 Vault 文件夹 | 最通用，无依赖 | Obsidian 检测有延迟，需轮询 |
| **D. 剪贴板桥接** | 工具写剪贴板 → 用户粘贴 | 用户最熟悉 | 需手动操作，无法自动化 |
| **E. 插件启外部进程** | 插件通过 `child_process` 调用 CLI | 体验最一体化 | 开发成本高 |

### 5. 关键空白

**目前没有任何方案实现完整流程**: 全局热键触发 → 屏幕区域捕获 → 标注 → 自动嵌入 Obsidian 笔记

各环节分别有解决方案，但无人将其串联。Vision Recall 最接近但依赖外部 LLM 且不自捕获。这正是核心机会。

---

## 三、三条可行路径

### 路径 A: Obsidian Companion 插件 + 外部工具桥接 (最快 MVP)

**核心思路**: Obsidian 插件作为"胶水层"，调用平台最佳 CLI 工具完成截屏，自动导入结果。

```
┌──────────────────────────────────────────────────────┐
│              Obsidian Companion Plugin                │
│                                                      │
│  ┌──────────────┐    ┌──────────────────────────┐    │
│  │ 命令面板触发  │───→│ child_process.exec()     │    │
│  │ (应用内热键)  │    │ macshot CLI / ShareX CLI  │    │
│  └──────────────┘    └──────────┬───────────────┘    │
│                                 │                    │
│  ┌──────────────────────────────▼───────────────┐    │
│  │         Vault 文件监听器                       │    │
│  │  vault.on('create') → 自动插入 Markdown 链接  │    │
│  │  支持: ![[image.png]] 或 ![alt](path)         │    │
│  └──────────────────────────────────────────────┘    │
│                                                      │
│  可选增强:                                           │
│  • 上下文面板: 截图后弹出 "写一句备注？" 浮窗        │
│  • OCR 自动化: 调用 macshot/ShareX OCR → 生成引用块  │
│  • Local REST API: 精确插入到指定笔记的指定位置       │
└──────────────────────────────────────────────────────┘
```

**平台适配:**

| 平台 | 截屏工具 | CLI 调用方式 |
|---|---|---|
| macOS | `macshot` (推荐) 或 `flameshot gui` | `child_process.exec('macshot capture --path ~/Vault/Assets/')` |
| Windows | `ShareX` (配置精简模式) | ShareX 的 After Capture Tasks 自动保存到 Vault 目录 |
| 跨平台 | `flameshot gui -p ~/Vault/Assets/ -c` | 同时保存到 Vault + 复制到剪贴板 |

**优势:**
- **1-2 周出 MVP**，TypeScript 开发
- 利用成熟工具的全部功能
- Obsidian 社区插件商店分发

**劣势:**
- 依赖用户安装外部截屏工具
- 无法注册全局热键 (需配合 Raycast/Alfred/whkd)
- 各工具 UI 不统一

**适用场景**: 个人/小团队快速验证 "截图→笔记" 工作流需求

---

### 路径 B: Tauri 跨平台桌面应用 (独立产品 + Obsidian Bridge)

**核心思路**: 用 Tauri 构建独立桌面应用，整合截屏/录屏/标注，通过多种协议与 Obsidian 深度联动。

```
┌───────────────────────────────────────────────────────┐
│           "Capture Hub" Desktop App (Tauri v2)        │
│                                                       │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐  │
│  │  截屏引擎   │  │  录屏引擎   │  │  标注编辑器  │  │
│  │             │  │             │  │              │  │
│  │ macOS:      │  │ scap crate  │  │ Fabric.js /  │  │
│  │ ScreenCap-  │  │ (MIT许可)   │  │ Konva.js /   │  │
│  │ tureKit绑定 │  │ 或          │  │ Excalidraw   │  │
│  │             │  │ AVFound.    │  │              │  │
│  │ Windows:    │  │ 绑定        │  │              │  │
│  │ Win.Graphics│  │             │  │              │  │
│  │ .Capture    │  │             │  │              │  │
│  └──────┬──────┘  └──────┬──────┘  └──────┬───────┘  │
│         └────────┬───────┘                │          │
│                  ▼                        │          │
│  ┌───────────────────────────────────────────────┐   │
│  │              Obsidian Bridge                  │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────────┐  │   │
│  │  │REST API  │ │URI Scheme│ │文件系统直写  │  │   │
│  │  │(精确编辑)│ │(快速触发)│ │(无依赖备选)  │  │   │
│  │  └──────────┘ └──────────┘ └──────────────┘  │   │
│  └───────────────────────────────────────────────┘   │
│                                                       │
│  系统托盘 · 全局热键 · 菜单栏浮窗 · 暗色模式优先     │
└───────────────────────────────────────────────────────┘
```

**关键开源组件:**

| 组件 | 来源 | License | 用途 |
|---|---|---|---|
| `scap` Rust crate | [Cap](https://github.com/CapSoftware/cap) 项目 | **MIT** | 跨平台屏幕捕获核心，使用原生 OS API |
| OpenScreen 引擎 | [OpenScreen](https://github.com/siddharthvaddem/openscreen) | **MIT** | 录屏+自动缩放+转场，可参考其架构 |
| Excalidraw | 开源 | MIT | 前端标注/绘图引擎 |
| Tauri v2 | 开源 | MIT/Apache-2.0 | 跨平台桌面框架 |
| kImageAnnotator | [ksnip](https://github.com/ksnip/ksnip) 项目 | GPLv2 | Qt 标注库，可参考功能设计 |

**Obsidian 联动方式 (三通道冗余):**
1. **Local REST API** (首选): 精确 PATCH 到指定笔记的指定位置
2. **obsidian:// URI Scheme** (备选): 快速触发打开/创建笔记
3. **文件系统直写** (兜底): 无任何依赖的纯文件操作

**优势:**
- **跨平台** (macOS + Windows + Linux)
- 核心库 `scap` **MIT 许可**，可商用
- 完全自主 UI/UX 控制
- 独立运行，不依赖 Obsidian

**劣势:**
- **2-3 月出 MVP**
- 需自建标注编辑器
- 各平台屏幕录制权限处理复杂

**适用场景**: 有一定开发资源，想打造独立产品

---

### 路径 C: macOS 原生精品应用 (最高体验质量)

**核心思路**: 以 macOS 为首要平台，基于 Swift + 系统框架构建原生应用，利用 Apple 独有能力 (PencilKit, Vision, Shortcuts)。

```
┌─────────────────────────────────────────────────────┐
│        Native macOS App (Swift/SwiftUI)             │
│                                                     │
│  ┌──────────────────┐  ┌──────────────────────────┐ │
│  │ ScreenCaptureKit │  │ AVFoundation 录屏引擎    │ │
│  │ (macOS 12.3+)    │  │ H.264 / HEVC / ProRes    │ │
│  └────────┬─────────┘  └────────────┬─────────────┘ │
│           │                         │                │
│           ▼                         ▼                │
│  ┌──────────────────────────────────────────────┐   │
│  │            标注编辑器 (PencilKit)             │   │
│  │  • Apple Pencil 原生支持                     │   │
│  │  • Shape Detection (形状自动识别)            │   │
│  │  • 手写文字 → 打字转换                       │   │
│  └──────────────────────┬───────────────────────┘   │
│                         │                            │
│  ┌──────────────────────▼───────────────────────┐   │
│  │             Plugin System                    │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────────┐ │   │
│  │  │ Obsidian │ │ Notion   │ │ Custom       │ │   │
│  │  │ Exporter │ │ Exporter │ │ Webhook      │ │   │
│  │  └──────────┘ └──────────┘ └──────────────┘ │   │
│  └──────────────────────────────────────────────┘   │
│                                                     │
│  系统能力集成:                                      │
│  • Vision 框架 → OCR                               │
│  • macOS Shortcuts → 自定义工作流                   │
│  • Spotlight / Raycast / Alfred 集成               │
│  • NSPasteboard → 剪贴板桥接                       │
│  • FSEvents → Vault 目录监控                        │
└─────────────────────────────────────────────────────┘
```

**macOS 系统框架优势:**

| 框架 | 能力 | 与开源方案对比 |
|---|---|---|
| ScreenCaptureKit | 高性能屏幕捕获 | 比 Electron `desktopCapturer` 性能高 10x+ |
| PencilKit | 原生绘图标注 | 开源 Canvas 库无法模拟 Apple Pencil 延迟补偿 |
| Vision | 设备端 OCR | 无需 Tesseract 安装，支持多语言 |
| AVFoundation | 专业视频编码 | ProRes/HEVC 硬件编码 |
| Shortcuts | 系统级工作流自动化 | 可与 Raycast/Alfred 联动 |

**Obsidian 集成 (macOS 专属优势):**
- `NSPasteboard` 直接写入图片 → Obsidian Cmd+V 即粘贴
- macOS Shortcuts 可编排 "截图 → OCR → 追加到 Daily Note" 全链路
- `obsidian://` URL Scheme + Automator/AppleScript 自动化
- FSEvents 高效监控 Vault 目录变化

**参考/Fork 基础:**
- **macshot** (~3k stars): 功能最接近目标，原生 Swift，可作为 Fork 基础
- **QuickRecorder** (~8.2k stars): ScreenCaptureKit 录屏最佳实践
- **Rectangle** (~26k stars): Swift 窗口管理参考

**优势:**
- **最高性能和最原生体验** (8-10MB 体积)
- PencilKit + Apple Pencil 专业级标注
- Vision OCR 无需外部依赖
- 可通过 Mac App Store / Setapp 分发

**劣势:**
- **仅 macOS 平台**
- Swift 开发者池较小
- **3-4 月出 MVP**
- Windows 版需完全另行开发

**适用场景**: 追求极致体验的 macOS 精品路线，对标 CleanShot X

---

## 四、路径对比与决策

| 维度 | 路径 A (Obsidian 插件) | 路径 B (Tauri 跨平台) | 路径 C (Swift 原生) |
|---|---|---|---|
| **开发周期** | 1-2 周 | 2-3 月 | 3-4 月 |
| **跨平台** | 需 Obsidian (跨平台) | macOS + Windows + Linux | 仅 macOS |
| **用户体验** | 中 (多工具拼凑) | 良好 | **最佳** |
| **独立运行** | 否 | 是 | 是 |
| **全局热键** | 需外部辅助 | 原生支持 | 原生支持 |
| **许可证风险** | 中 (GPL CLI 调用) | **低** (MIT 核心库) | 低 (系统框架) |
| **核心技术** | TypeScript | Rust + TypeScript | Swift |
| **标注质量** | 依赖外部工具 | Canvas 库 (Fabric/Konva) | **PencilKit** (Apple Pencil) |
| **MVP 功能** | 截屏+自动导入 | 截屏+录屏+标注 | 截屏+录屏+标注+OCR |
| **分发渠道** | Obsidian 插件商店 | 官网 + 包管理器 | Mac App Store + Setapp |
| **商业化难度** | 低 (免费+增值) | 中 | 中高 (精品定价) |

### 推荐策略: 渐进式验证

```
Phase 1 (1-2 周)          Phase 2 (2-3 月)          Phase 3 (按需)
┌──────────────┐          ┌──────────────┐          ┌──────────────┐
│  路径 A       │   验证   │  路径 B       │   macOS  │  路径 C       │
│  Obsidian    │ ──────→ │  Tauri 跨平台 │ ──────→ │  Swift 原生   │
│  插件 MVP    │  成功?   │  独立应用     │  深度    │  精品应用     │
│              │          │              │  优化    │              │
│  验证:       │          │  功能:       │          │  差异化:     │
│  • 用户需求  │          │  • 独立运行  │          │  • PencilKit │
│  • 付费意愿  │          │  • 自有 UI   │          │  • Vision OCR│
│  • 核心痛点  │          │  • 跨平台    │          │  • Setapp    │
└──────────────┘          └──────────────┘          └──────────────┘
```

---

## 五、关键风险

| 风险 | 影响 | 应对策略 |
|---|---|---|
| **GPL 传染性**: macshot/ShareX/Flameshot 都是 GPL | 高 | CLI 调用方式 (进程隔离) 而非代码集成；路径 B 的 `scap` (MIT) 无此风险 |
| **macOS 屏幕录制权限**: 需用户手动授权 Screen Recording | 中 | 首次启动引导授权流程，参考 macshot/QuickRecorder 的处理方式 |
| **Windows Graphics Capture 弹窗**: 每次捕获需用户确认 | 中 | Cap 的 `scap` 已封装处理逻辑，可直接复用 |
| **Obsidian 文件监听延迟**: 外部写入时 Vault 事件可能丢失 | 中 | 使用 Local REST API 直接操作 (精确可靠) 而非文件监听 |
| **macshot 项目成熟度**: ~3k stars，长期维护风险 | 中 | 路径 C 应以系统框架为主，macshot 仅作参考而非硬依赖 |
| **OpenScreen MIT 可用性**: 虽为 MIT 但架构为 Electron | 低 | 路径 B 参考 OpenScreen 的功能设计但用 Tauri/Rust 重写 |

---

## 六、调研数据来源

本报告基于以下来源的实时调研 (2026-04-14):

- GitHub 公开仓库及 API (Stars 数据为近似值)
- Reddit: r/swift, r/rust, r/macapps, r/ObsidianMD, r/Windows11
- Hacker News: macshot, komorebi, OpenScreen 讨论帖
- Obsidian 官方文档: Plugin API, URI Scheme, File Formats
- Obsidian 论坛: 插件安全、屏幕捕获限制、文件事件
- ObsidianStats: 插件下载统计
- Lifehacker, MakeUseOf, Zight Blog 等科技媒体评测
