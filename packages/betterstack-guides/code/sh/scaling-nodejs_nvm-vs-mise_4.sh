# Source: https://betterstack.com/community/guides/scaling-nodejs/nvm-vs-mise/
# Original language: bash
# Normalized: sh
# Block index: 4

# List available versions
mise ls-remote node

# Install a version
mise install node@22.0.0

# Set global version
mise use --global node@22

# Set project version
mise use node@22