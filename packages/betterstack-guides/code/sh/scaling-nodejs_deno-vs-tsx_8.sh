# Source: https://betterstack.com/community/guides/scaling-nodejs/deno-vs-tsx/
# Original language: bash
# Normalized: sh
# Block index: 8

# TSX with Node.js REPL
tsx  # Starts Node.js REPL with TypeScript support
> const userService = await import('./services/user.ts')
> const result = userService.processUser({ name: 'Alice' })