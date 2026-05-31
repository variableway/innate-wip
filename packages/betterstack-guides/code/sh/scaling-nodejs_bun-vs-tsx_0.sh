# Source: https://betterstack.com/community/guides/scaling-nodejs/bun-vs-tsx/
# Original language: bash
# Normalized: sh
# Block index: 0

# Bun standard watch mode (process restart)
bun --watch server.ts

# Bun hot mode (in-memory reloading)
bun --hot server.ts

# Features:
# - Filesystem-native watching (kqueue/inotify)
# - Preserved global state in hot mode
# - HTTP server hot reloading without restarts