# 开源截屏/录屏工具整合与 Obsidian 集成可行性分析报告

> 任务来源：`ideas/toolkits/os-tooling.md`  
> 调研范围：macOS / Windows 双平台 Top 开源仓库  
> 目标：分析功能整合可能性，并给出 2-3 条可行路径

---

## 1. 背景与目标

日常知识管理工作流中，用户需要在 **macOS/Windows** 上完成：
1. 截屏 / 录屏 / 滚动截屏
2. 即时标注（箭头、文字、马赛克、高亮）
3. OCR 提取文字
4. 快速将结果写入 Obsidian（Markdown + 本地附件）

本报告通过调研 GitHub 上 stars 高、社区活跃、功能完善的开源项目，分析它们的功能边界与架构特点，进而提出 **"整合成一个新软件"** 的可行路径。

---

## 2. 研究方法

- **筛选标准**：GitHub 高星（>1k stars）、近一年有维护更新、具备截屏/录屏/标注核心能力。
- **分析维度**：功能矩阵、技术栈、插件/扩展能力、许可证限制、与 Obsidian 的集成接口（剪贴板、文件系统、URI Scheme）。
- **平台划分**：macOS 原生栈（Swift/ScreenCaptureKit）、Windows 原生栈（C#/.NET/Win32）、跨平台方案（C++/Qt、Rust、Electron）。

---

## 3. macOS 平台 Top 开源仓库分析

| 排名 | 项目 |  stars | 技术栈 | 许可证 | 核心亮点 |
|------|------|--------|--------|--------|----------|
| 1 | **Capso** | 新星（增长快） | Swift 6 + SwiftUI + SPM 模块化 | BSL 1.1* | 最现代化的原生替代 CleanShot X；内置 CaptureKit/AnnotationKit/OCRKit/RecordingKit 等 8 个独立 SPM 包，可直接被第三方 App 嵌入 |
| 2 | **Kap** | ~19k | Electron + TypeScript | MIT | 录屏转 GIF/WebM/MP4 标杆；成熟插件系统（JavaScript 插件） |
| 3 | **ShotShot** | 数百 | Swift 6 + ScreenCaptureKit | MIT | 截屏+滚动截屏+标注一体化；自动复制到剪贴板 |
| 4 | **BetterCapture** | 数百 | SwiftUI + ScreenCaptureKit | MIT | 专业编码（ProRes/HEVC/H.264）；隐私优先；无追踪 |
| 5 | **QuickRecorder** | 1k+ | Swift + ScreenCaptureKit | 开源（未明确） | 驱动级内录音频、HEVC with Alpha、Presenter Overlay |

> *Capso 采用 Business Source License 1.1：个人/公司内部使用、阅读修改源码、发布免费衍生版均允许；**禁止直接 fork 后销售与之竞争的截屏产品**；每条发布在 3 年后自动转为 Apache 2.0。

### 3.1 功能对比（macOS）

| 功能 | Capso | Kap | ShotShot | BetterCapture | QuickRecorder |
|------|-------|-----|----------|---------------|---------------|
| 区域截屏 | ✅ | ✅(录屏) | ✅ | ❌ | ✅(录屏) |
| 窗口截屏 | ✅ | — | ✅ | ❌ | ✅ |
| 滚动截屏 |  roadmap | ❌ | ✅ | ❌ | ❌ |
| 屏幕录制 | ✅ MP4/GIF | ✅ GIF/MP4/WebM | ✅ MP4/GIF | ✅ ProRes/HEVC | ✅ HEVC/Alpha |
| 摄像头画中画 | ✅ 4 种形状 | ❌ | ❌ | ❌ | ✅ Overlay |
| 标注编辑器 | ✅ 高级（美化/阴影/圆角） | ❌ | ✅ 基础 | ❌ | ❌ |
| OCR | ✅ Vision 框架 | ❌ | ❌ | ❌ | ❌ |
| Pin 到屏幕 | ✅ | ❌ | ❌ | ❌ | ❌ |
| 全局快捷键 | ✅ | ✅ | ✅ | ✅ | ✅ |
| 插件/扩展 | 模块化 SPM（可嵌入） | JS 插件系统 | ❌ | ❌ | ❌ |

**结论**：
- **Capso** 是目前 macOS 上最接近 "All-in-One" 且架构最开放的原生项目。其 SPM 模块化设计使得你可以只引用 `CaptureKit` + `AnnotationKit` 到自己的壳 App 中，而不必重写底层。
- **Kap** 的插件生态适合做录屏后处理（压缩、上传），但基于 Electron，内存占用高，且没有截屏标注能力。
- **ShotShot** 适合作为轻量滚动截屏补充。

---

## 4. Windows 平台 Top 开源仓库分析

| 排名 | 项目 | stars | 技术栈 | 许可证 | 核心亮点 |
|------|------|-------|--------|--------|----------|
| 1 | **ShareX** | ~27k | C# / .NET Framework / Win32 | GPL-3.0 | 功能最全面；80+ 上传目标；OCR；工作流；图像效果；几乎无法移植到非 Windows 平台 |
| 2 | **Flameshot** | ~13k | C++ / Qt5&6 | GPLv3 | 跨平台（Win/macOS/Linux）；强大的 CLI；即时标注；社区极活跃（2025 年发布 v13） |
| 3 | **ScreenToGif** | ~25k | C# / WPF | MS-PL | 录屏转 GIF + 逐帧编辑器；Windows 用户最爱 |
| 4 | **Greenshot** | ~4k | C# / .NET | GPL | 轻量；Office 集成；适合简单工作流 |
| 5 | **SnapX** | ~850 | C# / .NET 10 / Avalonia | GPL-3.0（ShareX fork）| **跨平台 ShareX fork**；使用 XCap(macOS)、XDG Portals(Linux)、D3D11(Windows)；PaddleOCR；仍在开发中，尚未可用 |

### 4.1 功能对比（Windows）

| 功能 | ShareX | Flameshot | ScreenToGif | Greenshot | SnapX |
|------|--------|-----------|-------------|-----------|-------|
| 区域截屏 | ✅ | ✅ | ❌ | ✅ | ✅ |
| 窗口截屏 | ✅ | ✅ | ❌ | ✅ | ✅ |
| 滚动截屏 | ✅ | ❌ | ❌ | ❌ | roadmap |
| 屏幕录制 | ✅ | ❌ | ✅ GIF | ❌ | roadmap |
| 标注编辑器 | ✅ 高级 | ✅ 基础-中级 | ✅ 逐帧 | ✅ 基础 | roadmap |
| OCR | ✅ Tesseract | 需脚本扩展 | ❌ | ❌ | ✅ PaddleOCR |
| 上传/工作流 | ✅ 80+ | ✅ Imgur | ❌ | ✅ Office | ✅ 95% ShareX |
| 插件系统 | 自定义上传器/工作流 | CLI 脚本化 | ❌ | 插件 | 继承 ShareX |
| 跨平台 | ❌ 明确不支持 | ✅ | ❌ | ❌ | ✅ |

**结论**：
- **ShareX** 是 Windows 上的绝对王者，但它明确声明：由于大量 Native Win32 API、UI 控件和外部库依赖，**无法通过 Mono 移植到 macOS/Linux**。
- **Flameshot** 是跨平台截图+标注的最成熟方案，但缺少原生的录屏和视频编辑能力。
- **SnapX** 是唯一的 "跨平台 ShareX" 希望，但目前 **under development and is not ready for use**，风险较高。

---

## 5. 功能与使用场景整合分析

基于上述仓库，我们可以将需求拆分为 **4 层能力栈**：

```
┌─────────────────────────────────────────────────────────────┐
│  Layer 4: 知识库集成层   → Obsidian 快速写入、Markdown 生成、附件管理  │
├─────────────────────────────────────────────────────────────┤
│  Layer 3: 后处理与分发层 → OCR、压缩、上传、快捷键、工作流、插件市场    │
├─────────────────────────────────────────────────────────────┤
│  Layer 2: 标注与编辑层   → 箭头、文字、马赛克、截图美化、GIF/视频剪辑   │
├─────────────────────────────────────────────────────────────┤
│  Layer 1: 采集引擎层     → 截屏(ScreenCaptureKit/Win32)、录屏、滚动截屏 │
└─────────────────────────────────────────────────────────────┘
```

### 5.1 各项目覆盖的层级

- **Capso**：覆盖 Layer 1~3 且原生性能最优；Layer 4 目前缺失（没有 Obsidian 专用导出）。
- **ShareX**：覆盖 Layer 1~4（可通过自定义上传器/工作流把结果写入本地 Markdown 文件）。
- **Flameshot**：主要覆盖 Layer 1~2；Layer 3 可通过 CLI + 外部脚本实现；Layer 4 需配合 Python/AutoHotkey 等胶水代码。
- **Kap**：覆盖 Layer 1（录屏）和部分 Layer 3（转码/上传插件）；Layer 2 缺失。
- **SnapX**：理论上覆盖 ShareX 的全部层级，但工程进度未达可用状态。

### 5.2 与 Obsidian 集成的 4 种技术接口

| 接口方式 | 原理 | 代表工具/插件 | 优缺点 |
|----------|------|---------------|--------|
| **A. 剪贴板桥接** | 截图工具复制图片 → 用户在 Obsidian 中 `Ctrl+V` 粘贴 | 几乎所有工具都支持 | 最通用，但需手动切换窗口、命名不可控 |
| **B. 文件监视器** | 截图保存到 Vault 的固定附件目录 → Obsidian 插件自动把最新图片嵌入当前笔记 | 可自研 Obsidian 插件 + 任意截图工具 | 无需切换 App，可实现完全自动化 |
| **C. URI Scheme** | 截图完成后调用 `obsidian://advanced-uri?...` 创建/追加笔记 | Advanced URI 插件 | 可带参数（文件名、日期），但受 URL 长度限制，通常需配合剪贴板传内容 |
| **D. 专用 Obsidian 插件** | 在 Obsidian 内直接调用外部命令行工具截屏，并自动接收返回路径 | 可自研插件（调用 `flameshot gui -p ...` 或 macOS `screencapture`） | 体验最一体化，但开发成本高 |

---

## 6. Obsidian 快速使用方案设计

假设我们要为 Obsidian 用户设计 **"一键截图→自动入笔记"** 的快捷方式，下面是基于不同截图工具的具体实现思路。

### 6.1 基于 Capso（macOS）

**快捷方式设计**：
1. 用户在 Capso 的 Quick Access 浮窗中新增一个 **"Copy as Obsidian Link"** 按钮。
2. 点击后，图片自动保存到 `~/Obsidian/Vault/Assets/Screenshots/YYYY-MM-DD_HH-MM-SS.png`。
3. 同时生成 Markdown 链接 `![Screenshot](Assets/Screenshots/YYYY-MM-DD_HH-MM-SS.png)` 并写入系统剪贴板。
4. 用户回到 Obsidian 直接粘贴即可；若配合 Raycast/Alfred 脚本，可进一步调用 `obsidian://` URI 自动跳转到 Daily Note 并粘贴。

**读取剪贴板增强**：
- Capso 的 OCR 结果可以直接以纯文本形式复制到剪贴板，用户在 Obsidian 中粘贴为引用块 `> `。

### 6.2 基于 ShareX（Windows）

**快捷方式设计**：
1. 在 ShareX 的 **After Capture Tasks** 中勾选 "Perform actions"。
2. 配置一个自定义 PowerShell/Batch 动作：
   - 将截图移动到 Obsidian Vault 的附件目录。
   - 生成 Markdown 图片链接。
   - 调用 `obsidian://advanced-uri?vault=MyVault&filepath=Notes%2FInbox.md&clipboard=true&mode=append` 将链接追加到指定笔记。
3. 绑定全局热键（如 `Ctrl + Shift + O`），实现一键截图→自动入笔记。

**工作流扩展**：
- ShareX 内置 OCR（Tesseract），可将识别结果同时写入剪贴板；通过自定义动作把 OCR 文本放在图片下方的代码块中。

### 6.3 基于 Flameshot（跨平台）

**快捷方式设计**：
- 通过命令行参数精确控制输出路径和剪贴板行为：
  ```bash
  # macOS / Linux / Windows
  flameshot gui -p ~/Obsidian/Vault/Assets/ -c
  ```
- `-p` 指定保存到 Vault 附件目录；`-c` 同时复制到剪贴板。
- 配合一个跨平台的轻量守护进程（Rust/Tauri），监听该目录，一旦有新文件就通过 Obsidian Advanced URI 自动在当前笔记插入 Markdown 链接。

---

## 7. 可行路径（2-3 条）

### 路径一：「原生模块化套件」—— macOS 主战场 + Windows 另起炉灶（推荐）

**核心策略**：不做大而全的跨平台移植，而是在 **macOS 以 Capso 为底座**，在 **Windows 以 ShareX 为灵感新建 C# 应用**，分别构建 Obsidian 集成层。

#### macOS 侧
- ** Fork / 扩展 Capso**：
  - 新增一个 `ObsidianKit` Swift Package，提供：
    - `VaultAttachmentWriter`：按日期命名保存图片到 Vault 附件目录。
    - `MarkdownLinkGenerator`：生成标准 Markdown 图片语法（兼容 GitHub）。
    - `ClipboardMarkdownPaster`：将 Markdown 链接写入剪贴板。
  - 在 Capso 的 Quick Access 浮窗和右键菜单中增加 **"Send to Obsidian"** 动作。
  - 利用 Capso Roadmap 中的 **URL Scheme API**，未来可支持 Raycast / Shortcuts 一键触发并直接打开 Obsidian Daily Note。

- **Plugin 方式**：
  - Capso 的 SPM 架构本身就是天然插件：社区开发者可以发布独立的 Swift Package（如 `ScrollCaptureKit`、`AICaptionKit`），主 App 通过 Swift Package 依赖或动态加载方式集成。

#### Windows 侧
- **新建轻量 C#/.NET 应用**：
  - 由于 ShareX **无法移植到 macOS**，且其 WinForms 代码库历史包袱重，建议以 **SnapX 的跨平台思路** 为参考，但先只聚焦 Windows：
  - 使用 Windows.Graphics.Capture API（现代 Win10/11 推荐）替代传统 GDI BitBlt。
  - 使用 ImageSharp 做图像处理（为将来跨平台预留）。
  - 内置 "Obsidian Workflow" 模板，用户配置 Vault 路径后即可一键截图→入笔记。

- **License 注意**：
  - Capso 的 BSL 1.1 限制 3 年内不能销售直接竞争的截屏产品；若你的新产品定位为 "Obsidian 知识管理配套工具"（强调笔记集成而非截屏本身），法律风险较低，但仍建议与 Capso 作者沟通或等待 2029 年后版本转为 Apache 2.0。
  - 若追求完全无忧，可改用 **ShotShot**（MIT）+ 自行重写缺失模块（OCR、美化），开发成本更高但许可证最自由。

#### 适用人群
- 追求原生体验、愿意为 macOS/Windows 分别维护版本的专业知识工作者。

---

### 路径二：「跨平台脚本中枢」—— 不重造轮子，只做集成层

**核心策略**：不开发新的截屏/录屏引擎，而是做一个 **跨平台的轻量「中枢」应用**（建议用 **Tauri / Rust** 或 **Flutter** 开发），它负责：
1. 调用平台已有的最佳开源工具（macOS 调用 Capso/ShotShot/Flameshot CLI；Windows 调用 Flameshot CLI 或 ShareX CLI）。
2. 统一处理输出文件（移动、重命名、压缩）。
3. 与 Obsidian 通信（通过 Advanced URI 或 companion 插件）。

#### 架构示意图

```
┌────────────────────────────────────────────────────────────┐
│              OS Tooling Hub (Tauri/Rust)                    │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐   │
│  │  Plugin Mgr │  │  File Mover │  │ Obsidian Bridge  │   │
│  │  (JS/WASM)  │  │  (Rust)     │  │ (URI / WebSocket)│   │
│  └──────┬──────┘  └──────┬──────┘  └────────┬─────────┘   │
└─────────┼────────────────┼──────────────────┼─────────────┘
          │                │                  │
    ┌─────┴─────┐    ┌─────┴─────┐      ┌────┴────┐
    │ macOS CLI │    │Win CLI/API│      │Obsidian │
    │ Capso/    │    │ Flameshot │      │Companion│
    │ Flameshot │    │ ShareX    │      │ Plugin  │
    └───────────┘    └───────────┘      └─────────┘
```

#### 工作流程示例
1. 用户按全局热键 `Cmd/Ctrl + Shift + 5`。
2. Hub 检测到当前平台为 macOS，调用 `capso-cli screenshot --path ~/Vault/Assets/`（或退化为 `flameshot gui -p ...`）。
3. Hub 监听文件系统事件，截图生成后自动：
   - 压缩图片（可选）。
   - 生成 Markdown 链接。
   - 通过 HTTP/WebSocket 发送给 Obsidian Companion 插件，插件在当前光标处自动插入 `![...](...)`。

#### 优缺点
| 优点 | 缺点 |
|------|------|
| 跨平台，一份 Hub 代码跑 macOS/Windows/Linux | 依赖外部工具安装，用户配置成本略高 |
| 不触碰底层截屏引擎，开发周期最短（3-6 个月 MVP） | 无法提供像 Capso 那样无缝的原生浮窗/Pin 屏体验 |
| 许可证完全自由，无商业限制 | 不同平台 CLI 参数不统一，需要大量适配层 |

#### 适用人群
- 技术背景强、愿意在多台操作系统间保持统一工作流的团队用户。

---

### 路径三：「零代码/低代码配置」—— 基于现有工具快速落地（最快 MVP）

**核心策略**：不开发新软件，而是为 **Capso（macOS）** 和 **ShareX（Windows）** 分别编写配置模板 + Obsidian 配套插件，让现有工具直接支持 Obsidian 工作流。

#### macOS：Capso + 快捷指令 + Obsidian Advanced URI
- 等待或使用 Capso Roadmap 中的 **URL Scheme API**（如 `capso://capture?callback=obsidian://...`）。
- 现阶段：利用 macOS **Shortcuts（快捷指令）** + **Automator**：
  1. 调用 `screencapture` 或 `flameshot gui` 截图到 Vault 目录。
  2. 生成 Markdown 链接文本。
  3. 通过 `Open URL` 动作调用 `obsidian://advanced-uri?vault=...&clipboard=true&mode=append`。
- 可为社区制作一个 **Capso-Obsidian 配置包**，用户导入即可使用。

#### Windows：ShareX 自定义工作流
- 编写一个 ShareX **Custom Uploader / After-capture Action**：
  - 使用 PowerShell 脚本将截图移入 Vault，并追加到 Daily Note。
  - 提供现成的 `.sxcu` 配置文件和 `.ps1` 脚本，用户一键导入。

#### 配套 Obsidian 插件
- 开发一个极简的 **"Screenshot Inbox"** Obsidian 插件：
  - 监视 `Vault/Attachments/Screenshots/` 目录。
  - 当检测到新文件时，在当前笔记末尾自动插入 `![[filename.png]]` 并弹出通知。
  - 支持热键：一键打开系统默认截图工具（通过 Node.js `child_process.exec` 调用外部命令）。

#### 优缺点
| 优点 | 缺点 |
|------|------|
| 几乎零开发成本，1-2 周即可落地 | 无法形成独立产品，难以商业化 |
| 充分利用现有成熟工具的全部功能 | 用户体验碎片化，依赖多个软件的协同 |
| 适合个人或小型团队先验证工作流 | 对 "整合成一个新软件" 的目标契合度最低 |

#### 适用人群
- 希望 **立刻** 改善工作流、不想投入大量开发资源的个人用户。

---

## 8. 综合建议

| 你的目标 | 推荐路径 | 理由 |
|----------|----------|------|
| **打造一款可商业化的 macOS 原生生产力工具** | **路径一** | Capso 的模块化 SPM 架构是天然护城河；Obsidian 集成可作为增值卖点。需注意 BSL 1.1 的 3 年非竞争期，或改用 ShotShot(MIT) 重写缺失模块。 |
| **做一个跨平台（Mac+Win）的统一工具，尽快验证市场** | **路径二** | 避免陷入底层截屏引擎开发泥潭，把资源集中在 Obsidian 集成和插件市场。Tauri/Rust 是成本最低的跨平台 UI 方案。 |
| **个人/小团队先跑通工作流，不着急写新 App** | **路径三** | 直接基于 ShareX + Capso/Flameshot 做配置和 Obsidian 插件，1-2 周落地，风险为零。 |

### 关键风险提示
1. **许可证**：
   - Capso（BSL 1.1）有商业竞争限制；ShareX/SnapX/Flameshot（GPL-3.0）要求衍生作品开源。
   - 若计划闭源商业化，优先选择 **MIT 项目**（ShotShot、BetterCapture、Kap）作为代码基础，或完全自研引擎。
2. **跨平台陷阱**：
   - ShareX 明确无法跨平台；SnapX 尚未成熟。**不要试图把 ShareX 直接移植到 macOS**。
   - 如果必须跨平台，Flameshot（C++/Qt）+ 自研录屏模块（Rust/XCap）是更现实的技术组合。
3. **Obsidian 集成的最佳体验**：
   - 纯剪贴板方案门槛低但操作步骤多；
   - **文件监视器 + Companion 插件** 可实现真正的"一键无感插入"，是产品差异化核心。

---

## 9. 下一步行动清单

1. **明确产品定位**：是只做 macOS 精品工具，还是必须跨平台？是否计划商业化？
2. **选择技术底座**：
   - macOS：Fork Capso（评估 BSL 风险）或 Fork ShotShot（MIT，安全但需补功能）。
   - Windows：基于 ShareX 做工作流脚本（路径三），或新建 .NET 应用（路径一）。
3. **开发最小可行原型（MVP）**：
   - 先做 Obsidian Companion 插件（文件监视器自动嵌入图片），再对接截图工具。
4. **社区验证**：在 Reddit (r/ObsidianMD, r/macapps) 或 V2EX 发布工作流 Demo，收集反馈。

---

*报告生成时间：2026-04-14*  
*数据来源：GitHub 公开仓库、官方文档、社区论坛*
