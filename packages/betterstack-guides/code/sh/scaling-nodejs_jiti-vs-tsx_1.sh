# Source: https://betterstack.com/community/guides/scaling-nodejs/jiti-vs-tsx/
# Original language: bash
# Normalized: sh
# Block index: 1

# No native Jiti REPL - requires standard Node.js
node
> const jiti = require('jiti')(__filename)
> const module = jiti('./typescript-module.ts')