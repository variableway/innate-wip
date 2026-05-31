# Source: https://betterstack.com/community/guides/linux/index/
# Original language: zsh
# Normalized: sh
# Block index: 2

# Example of installing Oh My Zsh
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# Edit ~/.zshrc to choose themes and plugins
ZSH_THEME="agnoster"
plugins=(git docker python vscode)