# Source: https://betterstack.com/community/guides/scaling-nodejs/mise-vs-asdf/
# Original language: bash
# Normalized: sh
# Block index: 12

# List available tasks
$ mise tasks
Name     Description          Source
install  Install dependencies .mise.toml
dev      Start dev server     .mise.toml
test     Run tests           .mise.toml

# Run a task
$ mise run dev
$ mise run test