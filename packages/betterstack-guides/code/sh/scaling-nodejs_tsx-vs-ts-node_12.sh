# Source: https://betterstack.com/community/guides/scaling-nodejs/tsx-vs-ts-node/
# Original language: bash
# Normalized: sh
# Block index: 12

# ts-node shell scripts need explicit registration
node -r ts-node/register automation-script.ts production

# Or with npx for installed packages
npx ts-node deployment-tool.ts --environment staging