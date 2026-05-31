# Source: https://betterstack.com/community/guides/scaling-nodejs/jiti-vs-ts-node-typescript/
# Original language: bash
# Normalized: sh
# Block index: 5

# No dedicated Jiti REPL
node
> const jiti = require('jiti')(__filename)
> const module = jiti('./my-module.ts')