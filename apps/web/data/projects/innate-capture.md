# AGENTS.md - AI Agent Context

## Project Overview

**Capture** is a Go-based CLI/TUI tool for capturing ideas from Terminal and Feishu (飞书), saving them as Markdown files and syncing to Feishu Bitable (多维表格).

## Repository Structure

```
innate-capture/                 # Repository root
├── projects/
│   └── capture/               # Main Go project
│       ├── main.go            # Entry point
│       ├── cmd/               # Cobra CLI commands
│       ├── internal/          # Internal packages
│       ├── pkg/               # Public packages
│       ├── go.mod             # Go module
│       └── Makefile           # Build scripts
│
├── linear/                     # Git submodule - Linear SDK (reference)
├── multica/                    # Git submodule - Multica reference implementation
│
├── tasks/                      # Task tracking and analysis
│   ├── task/                  # Task definitions
│   ├── features/              # Feature analysis
│   ├── prd/spec/              # Product specifications
│   └── issue/                 # Issue tracking
│
├── docs/                       # Documentation
├── README.md                   # Main README
├── AGENTS.md                   # This file
└── CLAUDE.md                   # Claude Code guidance
```

## Project Architecture (projects/capture/)

```
capture/
├── main.go              # Entry point
├── cmd/                 # Cobra CLI commands
├── internal/
│   ├── model/           # Task, Config data models
│   ├── store/           # Markdown + SQLite + dual-write storage
│   ├── service/         # TaskService, BotService business logic
│   ├── bot/             # Feishu Bot webhook + websocket handlers
│   ├── bitable/         # Feishu Bitable API client + sync
│   ├── feishu/          # Shared Feishu SDK wrapper
│   ├── tui/             # bubbletea TUI kanban
│   └── config/          # Viper config management
├── pkg/
│   ├── idgen/           # TASK-XXXXX ID generator
│   └── frontmatter/     # YAML frontmatter parser
└── docs/                # Documentation
```

## Key Design Decisions

- **Go language** with Cobra CLI + bubbletea TUI
- **Dual-write storage**: Markdown files (source of truth) + SQLite (fast querying)
- **YAML frontmatter** in Markdown files for structured metadata
- **Feishu SDK**: `github.com/larksuite/oapi-sdk-go/v3`
- **Bot modes**: Both Webhook (HTTP) and WebSocket (long connection)
- **Pure Go SQLite**: `modernc.org/sqlite` (no CGo required)

## Task Model

- **Status flow**: todo → in_progress → done, todo → cancelled → archived
- **Priority**: high, medium, low
- **Source**: cli, tui, feishu_bot
- **Storage**: `~/.capture/tasks/YYYY/MM/TASK-NNNNN.md`

## Build & Test

```bash
cd projects/capture

go build ./...
go test ./...
go run . --help
```

## Feishu Bot Commands

- `记录 <内容>` - Create new task
- `列出` - List all tasks
- `删除 <TASK-ID>` - Delete task
- `帮助` - Show help

## Environment Variables

```bash
FEISHU_APP_ID           # Required for bot
FEISHU_APP_SECRET       # Required for bot
FEISHU_VERIFICATION_TOKEN  # For webhook mode
FEISHU_ENCRYPT_KEY      # For webhook mode
FEISHU_BITABLE_APP_TOKEN   # For bitable sync
FEISHU_BITABLE_TABLE_ID    # For bitable sync
```

## References

- [Linear SDK](./linear/) - Git submodule for reference
- [Multica](./multica/) - Git submodule for reference
- [PRD Specs](./tasks/prd/spec/) - Product specifications
- [Issue Tracking](./tasks/issue/) - Implementation issues
