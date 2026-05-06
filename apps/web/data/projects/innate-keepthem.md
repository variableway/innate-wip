# AGENTS.md - AI Agent Context

This document provides context for AI agents working on the vYtDL codebase.

## Project Overview

vYtDL is a YouTube downloader suite with four components:
- **vYtDL CLI** - Go-based CLI wrapping yt-dlp
- **vYtDL Desktop** - Tauri v2 + Next.js + React 19 desktop app with i18n support
- **vYtDL Web** - Docker-deployable web UI with Express backend
- **URL Extractor** - Chrome extension for URL extraction

## Technology Stack

### CLI (vYtDL/)
- **Language**: Go 1.24+
- **CLI Framework**: spf13/cobra
- **TUI Framework**: charmbracelet/bubbletea + lipgloss
- **External Dependency**: yt-dlp (called as subprocess)

### Desktop (vYtDL-desktop/)
- **Frontend**: Next.js + React 19 + TypeScript + Tailwind CSS
- **Desktop Shell**: Tauri v2 (Rust backend)
- **Build**: pnpm monorepo (apps/desktop, packages/ui, packages/utils)
- **State**: Zustand stores (downloadStore, settingsStore)
- **Storage**: Tauri storage adapter + SQLite database
- **i18n**: Custom React context with JSON locale files (`src/i18n/`)
- **API Abstraction**: `api-client.ts` supports both Tauri IPC and HTTP API modes

### Web Server (vYtDL-desktop/web-server/)
- **Backend**: Node.js + Express + WebSocket (`ws`)
- **Database**: better-sqlite3 (same schema as desktop)
- **Queue**: In-memory queue manager with configurable concurrency
- **yt-dlp**: Spawned as child process

### URL Extractor (url-extractor/)
- **Chrome Extension**: Manifest V3
- **Frontend**: Vanilla HTML/CSS/JS
- **Batch Script**: Python 3.6+

## Architecture

### CLI

```
main.go → cmd.Execute() → cmd/root.go
                              ↓
                    cmd/download.go (flags parsing)
                              ↓
                    downloader.New() → yt-dlp subprocess
                              ↓
                    record.Manager → JSON/CSV output files
```

### Desktop

```
Next.js App Router
    ↓
React Components (download-form, download-list, app-shell, app-sidebar)
    ↓
Zustand Stores (downloadStore, settingsStore)
    ↓
api-client.ts (Tauri IPC ↔ HTTP API abstraction)
    ↓
Tauri IPC (commands.rs → queue.rs → downloader.rs, database.rs)
    ↓
yt-dlp subprocess (via Tauri Rust backend)
```

### Web Server (Docker)

```
Browser
    ↓
Next.js Static Build (served by Express)
    ↓
HTTP API / WebSocket (Express server)
    ↓
Queue Manager → yt-dlp subprocess
    ↓
SQLite Database
```

## Key Modules

### CLI (vYtDL/)

- `cmd/root.go` - Cobra root command
- `cmd/download.go` - CLI flags, download orchestration, TUI coordination
- `internal/config/` - Loads `config.json` for yt-dlp binary path
- `internal/downloader/` - Core download logic, wraps yt-dlp as subprocess
- `internal/playliststate/` - Manages `.playlist_state.json` for resume
- `internal/record/` - Manages download_record and subtitle_mapping files
- `internal/tui/` - bubbletea-based terminal UI

### Desktop (vYtDL-desktop/)

- `apps/desktop/src/app/` - Next.js pages (home, settings, library, player)
- `apps/desktop/src/components/` - React components
  - `download-form.tsx` - Single/Batch/Smart download form with textarea + file import
  - `download-list.tsx` - Download list with progress, logs, queue position, retry
- `apps/desktop/src/i18n/` - Internationalization (provider, hook, locale JSON files)
- `apps/desktop/src/store/` - Zustand stores
- `apps/desktop/src/lib/api-client.ts` - API abstraction (Tauri IPC / HTTP fetch)
- `apps/desktop/src-tauri/src/` - Rust backend
  - `commands.rs` - Tauri IPC commands (start_download, cancel, get_downloads, etc.)
  - `downloader.rs` - yt-dlp subprocess wrapper
  - `database.rs` - SQLite database layer (downloads + settings tables)
  - `queue.rs` - Async download queue manager (max concurrency, FIFO, cancel)
  - `lib.rs` - App setup, bundled yt-dlp extraction, auto-resume on startup
- `packages/ui/` - Shared UI components
- `packages/utils/` - Shared utilities
- `scripts/` - Startup scripts
- `web-server/` - Docker web API server (Node.js + Express)

### URL Extractor (url-extractor/)

- `manifest.json` - Chrome extension config (Manifest V3)
- `popup.html/js/css` - Extension popup UI
- `content.js` - Content script for URL extraction from YouTube pages

## Download Form Modes

The `download-form.tsx` component supports three modes via the `mode` prop:

| Mode | Input | Behavior |
|------|-------|----------|
| `single` | Single `<Input>` | Fetches video info on URL input, shows thumbnail preview |
| `batch` | `<textarea>` + file import | Parses multiple URLs (one per line), submits all to queue |
| `smart` | `<textarea>` + file import | Same as batch, but auto-detects playlist URLs (regex heuristic) |

Batch/Smart modes:
- URLs are split by newlines, filtered for validity, deduplicated
- `#` lines are treated as comments and ignored
- `.txt` file import supported via hidden `<input type="file">`
- Sequential `startDownload()` calls; queue handles concurrency

## Download Queue System

The desktop and web backends both implement a download queue:

### Rust Queue (`queue.rs`)
- `QueueManager` spawns a background Tokio task
- Maintains a `VecDeque` of pending downloads and `HashMap` of active tasks
- Configurable `max_concurrent` (default: 3, range: 1-10)
- FIFO ordering with `queue_position` persisted to SQLite
- Cancellation via `tokio::sync::mpsc` channel
- Status transitions: `pending` → `downloading` → `completed`/`failed`/`cancelled`

### Resume on Startup
- `lib.rs` calls `db.get_incomplete_downloads()` on startup
- Downloads with `status = 'downloading'` are reset to `'pending'`
- Saved `options` JSON is deserialized back to `DownloadOptions`
- Each resumed download is re-enqueued via `QueueManager::enqueue()`

### Web Server Queue (`web-server/src/queue.ts`)
- `QueueManager` with `Map` of active downloads and array of pending
- Configurable `maxConcurrent` (default: 3)
- WebSocket broadcast for real-time progress updates
- Same status transitions as Rust backend

## API Client Abstraction

`apps/desktop/src/lib/api-client.ts` provides a unified interface:

- `apiInvoke(command, args)` - Calls Tauri `invoke()` in desktop mode, `POST /api/{command}` in web mode
- `apiListen(event, handler)` - Binds to Tauri events in desktop mode, WebSocket in web mode
- `apiConfirm(message, options)` - Uses Tauri dialog in desktop mode, native `confirm()` in web mode

This allows the same Next.js frontend to run in both Tauri desktop and Docker web contexts.

## Database Schema

### `downloads` table
| Column | Type | Notes |
|--------|------|-------|
| id | TEXT PRIMARY KEY | UUID |
| url | TEXT NOT NULL | Video URL |
| title | TEXT | Fetched from yt-dlp |
| status | TEXT | pending/downloading/completed/failed/cancelled |
| progress | REAL | 0.0 - 100.0 |
| speed | TEXT | e.g. "1.5MiB/s" |
| eta | TEXT | e.g. "00:02:15" |
| output_dir | TEXT | Download destination |
| filename | TEXT | Final filename |
| subtitles | TEXT | JSON array of subtitle file paths |
| error | TEXT | Error message if failed |
| queue_position | INTEGER | Position in pending queue |
| options | TEXT | JSON serialized `StartDownloadRequest` for resume |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### `settings` table
| Column | Type | Notes |
|--------|------|-------|
| key | TEXT PRIMARY KEY | Setting key |
| value | TEXT | Setting value |
| updated_at | TIMESTAMP | |

## Common Tasks

### Adding a New CLI Flag

1. Add flag variable in `cmd/download.go` init()
2. Add to `downloader.Options` struct
3. Pass through to yt-dlp in `internal/downloader/downloader.go`

### Adding a Desktop Feature

1. Add Rust command in `src-tauri/src/commands.rs`
2. Add frontend API call via `api-client.ts` (not direct Tauri imports)
3. Build React component in `src/components/`
4. Wire into Zustand store if state management needed
5. Add translation keys to all locale JSON files in `src/i18n/locales/`

### Adding a New Language

1. Create a new JSON file in `apps/desktop/src/i18n/locales/` (copy from `en.json`)
2. Translate all values
3. Import and register in `apps/desktop/src/i18n/index.tsx`
4. Add option in `apps/desktop/src/app/settings/page.tsx`

### Modifying Download Behavior

- CLI: Edit `internal/downloader/downloader.go`
- Desktop: Edit `src-tauri/src/downloader.rs`
- Web: Edit `vYtDL-desktop/web-server/src/downloader.ts`

### Adding a Web API Endpoint

1. Add route in `vYtDL-desktop/web-server/src/index.ts`
2. Implement logic using `database.ts` and `downloader.ts`
3. Ensure the desktop frontend uses `apiInvoke()` (same command name as Tauri)

## File Conventions

- Go files: standard Go formatting, no external formatters required
- TypeScript: ESLint + Prettier
- Test files: `*_test.go` (Go), `*.test.ts` (TypeScript)
- JSON config: simple key-value, no nested structures
- JSON locale files: nested object structure with dot-notation keys

## Shell Scripts

Located in `vYtDL/scripts/`:
- `download_video.sh` - Single video wrapper
- `download_collection.sh` - Playlist wrapper
- `build.sh` - Cross-build helper for macOS/Linux/Windows targets
- `build.ps1` - Cross-build helper for macOS/Linux/Windows targets on PowerShell

Located in `vYtDL-desktop/scripts/`:
- `start-desktop.sh` - Mac/Linux desktop startup
- `start-desktop.ps1` - Windows desktop startup
- `start-desktop.py` - Cross-platform desktop launcher
- `vytdl-launcher.py` - Python launcher (dev/build/clean/schedule)

Download wrapper scripts validate `yt-dlp`/`youtube-dl` availability before running.

## AI Skill & Development Guide

- **Project Skill**: `.agents/skills/vytdl-dev/SKILL.md` — Loaded automatically by Kimi Code CLI when working on this project. Contains architecture reference, component patterns, and common task workflows.
- **How-To Tutorial**: `docs/how-to/README.md` — Step-by-step guide for implementing this project with AI assistance, including tech stack overview and dependency installation.
- **One-Click Setup**: `docs/how-to/setup.sh` (macOS/Linux) and `docs/how-to/setup.ps1` (Windows) — Install all dependencies (Go, Node.js, Rust, yt-dlp, FFmpeg) in one command.

## Known Issues

- yt-dlp must be installed separately and path configured in `config.json`
- YouTube may block anonymous requests; use `--cookies-from-browser` as workaround
- URL escaping issues were fixed; downloader normalizes input URLs
- Desktop `tauriStorage` type has known TypeScript incompatibility with Zustand `PersistStorage`
