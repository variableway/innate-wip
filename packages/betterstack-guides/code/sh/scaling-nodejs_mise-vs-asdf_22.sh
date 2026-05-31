# Source: https://betterstack.com/community/guides/scaling-nodejs/mise-vs-asdf/
# Original language: bash
# Normalized: sh
# Block index: 22

# mise activates itself when it detects it's needed
# You still add it to your shell config, but it's a single command

# Bash/Zsh
eval "$(~/.local/bin/mise activate bash)"  # or zsh

# Fish
~/.local/bin/mise activate fish | source

# The activation is lighter than asdf's approach