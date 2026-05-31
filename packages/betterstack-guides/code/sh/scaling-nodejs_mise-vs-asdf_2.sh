# Source: https://betterstack.com/community/guides/scaling-nodejs/mise-vs-asdf/
# Original language: bash
# Normalized: sh
# Block index: 2

# Install the Node plugin
asdf plugin add nodejs

# List available versions
asdf list all nodejs

# Install a specific version
asdf install nodejs 20.10.0

# Set it globally
asdf global nodejs 20.10.0

# Or set it for a specific project
cd my-project
asdf local nodejs 20.10.0