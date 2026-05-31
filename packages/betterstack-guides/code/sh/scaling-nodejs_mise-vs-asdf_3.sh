# Source: https://betterstack.com/community/guides/scaling-nodejs/mise-vs-asdf/
# Original language: bash
# Normalized: sh
# Block index: 3

# Install Node directly (no plugin needed)
mise use --global node@20.10.0

# Or for the current project
mise use node@20.10.0

# Install and set in one command
cd my-project
mise use node@20.10.0 python@3.11