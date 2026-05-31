# Source: https://betterstack.com/community/guides/linux/index/
# Original language: bash
# Normalized: sh
# Block index: 14

# Check current shell
echo $SHELL

# Install Zsh (if not already present)
# On Ubuntu/Debian:
sudo apt install zsh

# On macOS with Homebrew:
brew install zsh

# Set as default shell
chsh -s $(which zsh)

# Create initial Zsh configuration
# Option 1: Start with empty config
touch ~/.zshrc

# Option 2: Use Oh My Zsh installer (recommended for beginners)
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"