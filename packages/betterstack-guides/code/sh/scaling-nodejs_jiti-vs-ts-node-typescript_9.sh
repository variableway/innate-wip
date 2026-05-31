# Source: https://betterstack.com/community/guides/scaling-nodejs/jiti-vs-ts-node-typescript/
# Original language: bash
# Normalized: sh
# Block index: 9

# Enable JSX support
JITI_JSX=true npx jiti app.tsx

# Or programmatically
const jiti = createJiti(import.meta.url, { jsx: true });