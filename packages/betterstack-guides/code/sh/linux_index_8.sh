# Source: https://betterstack.com/community/guides/linux/index/
# Original language: zsh
# Normalized: sh
# Block index: 8

#!/usr/bin/env zsh
# Fall back to bash if zsh is not available
if [ -z "$ZSH_VERSION" ]; then
    exec bash "$0" "$@"
fi

# Zsh-specific code follows