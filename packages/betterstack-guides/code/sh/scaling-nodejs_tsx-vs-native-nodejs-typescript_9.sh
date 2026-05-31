# Source: https://betterstack.com/community/guides/scaling-nodejs/tsx-vs-native-nodejs-typescript/
# Original language: bash
# Normalized: sh
# Block index: 9

# Native support follows standard Node.js rules  
node app.ts                 # Uses package.json "type" field
node app.mts               # Always ESM
node app.cts               # Always CommonJS

# File extensions are mandatory in imports
import './utils.ts'        # Required, not './utils'
require('./config.ts')     # Also required for CommonJS