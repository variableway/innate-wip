# Source: https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/
# Original language: command
# Normalized: sh
# Block index: 6

node index.js | jq 'del(.time,.hostname,.pid)'