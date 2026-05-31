# Source: https://betterstack.com/community/guides/scaling-nodejs/nvm-alternatives-guide/
# Original language: bash
# Normalized: sh
# Block index: 7

# Install a specific Node.js version
volta install node@14.17.0

# Pin a Node.js version for a project
volta pin node@14.17.0

# Install and pin npm
volta install npm@7.24.0

# Install global tools
volta install yarn
volta install typescript

# List installed tools
volta list