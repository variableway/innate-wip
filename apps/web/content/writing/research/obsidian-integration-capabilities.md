# Obsidian Integration Capabilities Research

## 1. Plugin Ecosystem Overview

### How Plugins Work

Obsidian is an Electron-based desktop app (with mobile variants). Community plugins are TypeScript/JavaScript modules loaded into the Obsidian runtime.

**Plugin Structure:**
```
.obsidian/plugins/my-plugin/
  main.js          # Compiled entry point (built from TypeScript)
  manifest.json    # Plugin metadata (id, name, version, minAppVersion, isDesktopOnly)
  styles.css       # Optional plugin styles
```

**Plugin Lifecycle:**
- `onload()` - Called when plugin is enabled. Register commands, UI elements, event listeners here.
- `onunload()` - Called on disable. Clean up resources.
- `onLayoutReady()` - Recommended for initial UI setup (workspace is guaranteed ready).

**Key API Methods on the `Plugin` class:**

| Method | Purpose |
|--------|---------|
| `addCommand(cmd)` | Register a command (appears in Command Palette, can have hotkey) |
| `addStatusBarItem()` | Create a status bar element (returns HTMLElement) |
| `addSettingTab(tab)` | Register a settings panel |
| `registerEditorExtension(ext)` | Register CodeMirror 6 extensions for editor customization |
| `registerEvent(handler)` | Listen to vault/workspace events |
| `loadData()` / `saveData()` | Persist plugin settings as JSON |
| `registerInterval(id)` | Register a setInterval (auto-cleanup on unload) |
| `addRibbonIcon(icon, title, cb)` | Add icon to left ribbon sidebar |

**manifest.json fields:**
- `id` - Unique identifier
- `name`, `version`, `description`, `author`
- `minAppVersion` - Minimum Obsidian version required
- `isDesktopOnly` - Set `true` if using Node.js/Electron APIs not available on mobile

### Access to Underlying APIs

Because Obsidian runs on Electron, plugins have access to three layers:

1. **Obsidian Plugin API** (`import { ... } from 'obsidian'`) - The officially supported, stable API surface. Includes Vault operations, workspace, commands, settings, etc.

2. **Web APIs** (`navigator.clipboard`, `document`, `window`, etc.) - Standard browser APIs available in the Electron renderer process.

3. **Node.js / Electron APIs** (`require('electron')`, `require('fs')`, `require('child_process')`) - Available because Electron embeds Node.js. This enables:
   - Direct filesystem access via `require('fs')`
   - Spawning external processes via `require('child_process')`
   - Electron `remote` module for window management, global shortcuts, clipboard, etc.
   - Native Node.js module loading (with ABI compatibility caveats)

   NOTE: Using Node.js/Electron APIs means the plugin is desktop-only (`isDesktopOnly: true`).

### Official Plugin Submission Requirements

Per Obsidian's submission guidelines:
- Use `navigator.clipboard.readText()` / `writeText()` for clipboard (NOT `require('electron').clipboard`)
- Prefer the Vault API over raw filesystem access
- Plugins are reviewed before inclusion in the community list
- The API is still evolving; documentation gaps exist

---

## 2. Existing Plugins by Category

### A. Screenshot / Screen Capture Plugins

**There is no dominant, full-featured screenshot plugin for Obsidian.** This is a notable gap in the ecosystem.

| Plugin | Description |
|--------|-------------|
| **Obsidian Camera** | Captures photos/video from webcam within Obsidian. Not screen capture. |
| **(No major plugin)** | No plugin was found that captures screen regions directly. |

**Common workaround:** Users configure external tools (ShareX on Windows, Flameshot on Linux/macOS) to auto-save screenshots into a folder inside their Obsidian vault, then embed them with `![[image.png]]`.

### B. Image Handling and Annotation Plugins

| Plugin | Key Features |
|--------|-------------|
| **Excalidraw** | Full drawing/whiteboard embedded in Obsidian. Can import images onto canvas and annotate with shapes, arrows, text, freehand drawing. Deep Obsidian integration with backlinks, embedding (`![[drawing.excalidraw]]`), and command palette. The most powerful annotation solution. |
| **Image Toolkit** | Click-to-zoom, pan, rotate, flip, gallery navigation for images in vault. No annotation/drawing. |
| **Ozan's Image in Editor Plugin** | Renders images inline in editor view (WYSIWYG-style). Drag-and-drop, resizable. |
| **Obsidian Annotator** | Annotates PDFs and EPUBs using Hypothesis. Annotations stored as markdown notes with backlinks. Limited image annotation support. |
| **Paste Image Rename** | Auto-renames pasted images with customizable naming patterns. |
| **Image Caption** | Adds caption text below embedded images. |
| **Local Images Plus** | Downloads external images locally into vault. |

### C. Clipboard Integration Plugins

| Plugin | Key Features |
|--------|-------------|
| **Clipboard Manager** | Saves recent clipboard copies, searchable history, one-click paste back. |
| **Copy Metadata** | Copy note frontmatter/metadata to clipboard. |
| **Templater** | Insert clipboard content (including images) via templates. |

**Native clipboard support:** Obsidian natively supports pasting images from clipboard (Ctrl/Cmd+V) directly into notes, auto-saving to vault and creating `![[image.png]]` embed.

**API for clipboard in plugins:**
```typescript
// Officially recommended approach
await navigator.clipboard.readText();
await navigator.clipboard.writeText("text");

// For images in clipboard (more complex - requires ClipboardItem API)
const items = await navigator.clipboard.read();
for (const item of items) {
  for (const type of item.types) {
    if (type.startsWith('image/')) {
      const blob = await item.getType(type);
      // Process the image blob
    }
  }
}
```

### D. File Attachment Management Plugins

| Plugin | Key Features |
|--------|-------------|
| **Attachment Management** | Auto-rename attachments, customize paths with variables. |
| **Attachment Manager** | Bind attachment folders to note names automatically. |
| **Custom Attachment Location** | Configure where Obsidian stores pasted attachments. |
| **Local File Interface** | Import/export files between vault and external filesystem locations. |
| **FolderBridge** | Mount external folders as native directories inside vault. |

---

## 3. How Obsidian Handles Specific Capabilities

### A. Keyboard Shortcuts

**Local (in-app) shortcuts:**
- Plugins register commands via `this.addCommand()` which automatically appear in Settings > Hotkeys for user customization.
- Commands can specify default hotkeys: `{ modifiers: ['Mod', 'Shift'], key: 'K' }`
- Users can rebind any command's hotkey.

**Global (system-wide) shortcuts:**
- The **Global Hotkeys plugin** uses Electron's `globalShortcut` API to register system-wide hotkeys that work even when Obsidian is not focused.
- Source code pattern (from the plugin):
  ```typescript
  const remote = require('electron').remote;
  const globalShortcut = remote.globalShortcut;

  // Register a global shortcut
  globalShortcut.register('Cmd+Shift+Ctrl+Alt+N', () => {
    // Execute Obsidian command
    // Optionally bring window to front
    remote.getCurrentWindow().show();
  });
  ```
- This plugin has 13,000+ downloads and is the standard solution for global hotkeys.

### B. Clipboard Read/Write Access

**Official approach:** Use Web Clipboard API (`navigator.clipboard`).
- `readText()` / `writeText()` for text
- `read()` / `write()` for rich content including images (via `ClipboardItem`)
- Obsidian natively handles image paste: clipboard image -> save to vault -> insert `![[image.png]]` embed

**Electron approach (desktop-only):** `require('electron').clipboard` provides additional capabilities like `readImage()`, `writeImage()`, `readBuffer()`, but is discouraged for community plugin submissions.

### C. File System Watching and Auto-Import

**Built-in vault events:**
```typescript
// Register vault event listeners
this.registerEvent(
  this.app.vault.on('create', (file) => {
    // Fires when file is created (also fires for each existing file on vault load)
  })
);
this.registerEvent(
  this.app.vault.on('modify', (file) => {
    // Fires when file content changes
  })
);
this.registerEvent(
  this.app.vault.on('delete', (file) => { /* ... */ })
);
this.registerEvent(
  this.app.vault.on('rename', (file, oldPath) => { /* ... */ })
);
```

**Limitations:**
- Vault events only fire for changes Obsidian detects. External changes to subdirectories may not always be detected (vault file watcher historically focused on root).
- There is no built-in "watched folder / hot folder" feature for auto-importing from outside the vault.

**Workaround solutions:**
- **FolderBridge plugin** - Mounts external folders inside the vault, making their contents appear as vault files.
- **Local File Interface plugin** - Manual import/export of files between vault and external locations.
- **External scripting** - Use OS-level file watchers (e.g., Python watchdog) to copy files into the vault directory.

### D. Image Embedding in Markdown

**Obsidian's image embed syntax:**

| Syntax | Format | Notes |
|--------|--------|-------|
| Wiki-style embed (default) | `![[image.png]]` | Preferred; resolves by filename in vault |
| Wiki-style with size | `![[image.png\|300]]` | Resize to 300px wide |
| Wiki-style with alt text | `![[image.png\|Alt text]]` | Alt text after pipe |
| Standard Markdown | `![alt](path/to/image.png)` | Works when wikilinks disabled |
| External URL | `![](https://example.com/image.png)` | Embeds remote image (not downloaded) |

**Configuration:** Settings > Files & Links controls:
- Default attachment location (vault root, current folder, or specified subfolder)
- Whether to use wikilinks or standard markdown links
- Internal file naming for new attachments

**Vault API for binary files:**
```typescript
// Create binary file (image)
await this.app.vault.createBinary(path, arrayBuffer);

// Read binary file
const data: ArrayBuffer = await this.app.vault.readBinary(tFile);

// Modify binary file
await this.app.vault.modifyBinary(tFile, newArrayBuffer);
```

---

## 4. External Tools That Combine Note-Taking with Screen Capture

### ShareX (Windows, open source)
- Full-featured screenshot/screen recording tool
- Can be configured to auto-save captures into an Obsidian vault folder
- Supports annotations, OCR, color picking
- CLI and API for automation
- **Integration pattern:** ShareX saves to `vault/attachments/` -> Obsidian auto-detects -> user embeds with `![[screenshot.png]]`

### Flameshot (Linux/Windows/macOS, open source)
- Screenshot with built-in annotation tools (arrows, text, blur, shapes)
- CLI support: `flameshot gui -p /path/to/vault/attachments/`
- Can be scripted to capture directly into vault
- **Integration pattern:** CLI capture to vault folder -> embed in note

### Greenshot (Windows, open source)
- Screenshot capture with annotation editor
- Integrates with Jira, Confluence, etc.
- Export to clipboard for pasting into Obsidian
- **Integration pattern:** Copy annotated screenshot to clipboard -> paste into Obsidian note

### Notable gap: There is no tool that deeply integrates screen capture WITHIN Obsidian itself (e.g., a plugin that captures a screen region, annotates it, and embeds it in one seamless flow). Users currently rely on external tools + manual embedding.

---

## 5. Network and External Communication

### HTTP Requests from Plugins

- **`requestUrl()`** (from `obsidian` module) - The recommended way to make HTTP requests from plugins. Bypasses CORS restrictions because requests go through Electron's main process.
- **`fetch()`** - Standard Web API, but blocked by CORS in Obsidian's renderer process.
- `requestUrl()` does NOT appear in DevTools network tab.
- Streaming response bodies is not yet supported.
- Mobile (iOS/Android) has quirks with plain HTTP and certain headers.

```typescript
import { requestUrl } from 'obsidian';

const response = await requestUrl({
  url: 'https://api.example.com/data',
  method: 'GET',
  headers: { 'Authorization': 'Bearer ...' }
});
console.log(response.json);
```

---

## 6. Editor Extensions (CodeMirror 6)

Obsidian uses CodeMirror 6 as its editor engine. Plugins can deeply customize editor behavior:

```typescript
import { Plugin } from 'obsidian';
import { EditorView } from '@codemirror/view';
import { StateField } from '@codemirror/state';

export default class MyPlugin extends Plugin {
  onload() {
    this.registerEditorExtension([
      // CM6 extensions: decorations, keybindings, state fields, etc.
    ]);
  }
}
```

This enables custom rendering of content, new keybindings, custom syntax highlighting, inline widgets, and more.

---

## 7. Summary of Integration Capabilities

| Capability | Support Level | Mechanism |
|------------|--------------|-----------|
| Register commands with hotkeys | Full | `plugin.addCommand()` |
| Global system-wide hotkeys | Full (desktop) | `require('electron').remote.globalShortcut` |
| Read/write clipboard (text) | Full | `navigator.clipboard.readText/writeText()` |
| Read/write clipboard (images) | Full | `navigator.clipboard.read()` + ClipboardItem API |
| Native image paste to vault | Built-in | Ctrl/Cmd+V auto-saves to vault |
| Create binary files (images) | Full | `vault.createBinary()`, `vault.modifyBinary()` |
| Read binary files | Full | `vault.readBinary()` |
| Watch for file changes | Partial | `vault.on('create'/'modify')` but external changes may be missed |
| HTTP requests | Full | `requestUrl()` (no CORS limits) |
| Access Node.js APIs | Full (desktop) | `require('fs')`, `require('child_process')`, etc. |
| Spawn external processes | Full (desktop) | `require('child_process').spawn/exec` |
| Editor customization | Full | `registerEditorExtension()` (CodeMirror 6) |
| Settings persistence | Full | `plugin.loadData()` / `saveData()` |
| UI elements | Full | Status bar, ribbon icons, modals, settings tabs, view panels |
| Drawing/annotation | Via plugin | Excalidraw plugin provides full canvas |
| Screen capture | Gap | No native plugin; relies on external tools |
| File auto-import from outside vault | Gap | No built-in hot-folder; FolderBridge plugin partially addresses |

---

## 8. Key Resources

- [Obsidian Plugin API Reference](https://docs.obsidian.md/Reference/TypeScript+API/Plugin)
- [Obsidian Developer Docs](https://docs.obsidian.md/)
- [Official Sample Plugin](https://github.com/obsidianmd/obsidian-sample-plugin)
- [Obsidian API Type Definitions (obsidian.d.ts)](https://github.com/obsidianmd/obsidian-api/blob/master/obsidian.d.ts)
- [Obsidian Plugin Directory](https://obsidian.md/plugins)
- [Global Hotkeys Plugin Source](https://github.com/mjessome/obsidian-global-hotkeys)
- [Excalidraw Plugin](https://github.com/zsviczian/obsidian-excalidraw-plugin)
- [Obsidian Hub - Plugins by Category](https://publish.obsidian.md/hub/02+-+Community+Expansions/02.01+Plugins+by+Category/Plugins+by+category)
- [Editor Extensions Guide](https://docs.obsidian.md/Plugins/Editor/Editor+extensions)
- [Obsidian Annotator Plugin](https://github.com/elias-sundqvist/obsidian-annotator)
- [FolderBridge Plugin](https://github.com/tescolopio/Obsidian_FolderBridge)
- [Attachment Management Plugin](https://www.obsidianstats.com/plugins/attachment-manager)
- [Clipboard Manager Plugin](https://github.com/ayu5h-raj/clipboard-manager)
