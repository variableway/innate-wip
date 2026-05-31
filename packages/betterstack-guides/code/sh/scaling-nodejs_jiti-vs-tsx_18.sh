# Source: https://betterstack.com/community/guides/scaling-nodejs/jiti-vs-tsx/
# Original language: bash
# Normalized: sh
# Block index: 18

# Consistent Jiti execution pattern
npx jiti application.ts       # Standard execution
JITI_DEBUG=1 npx jiti app.ts  # Debug mode via environment
jiti production-script.ts     # Direct command usage