# Source: https://betterstack.com/community/guides/scaling-nodejs/mise-vs-asdf/
# Original language: bash
# Normalized: sh
# Block index: 1

# Using Homebrew
brew install mise

# Or download directly
curl https://mise.run | sh

# Activate (happens automatically on most shells)
echo 'eval "$(~/.local/bin/mise activate bash)"' >> ~/.bashrc