# Source: https://betterstack.com/community/guides/scaling-nodejs/nvm-alternatives-guide/
# Original language: bash
# Normalized: sh
# Block index: 4

# Install a specific version
fnm install 16.13.0

# Install the latest LTS release
fnm install --lts

# Use a specific version
fnm use 16.13.0

# Set a default version
fnm default 16.13.0

# List installed versions
fnm list

# Create an alias
fnm alias 16.13.0 my-project