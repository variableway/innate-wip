# Source: https://betterstack.com/community/guides/linux/index/
# Original language: zsh
# Normalized: sh
# Block index: 1

# ~/.zshrc - primary configuration file

# Load Oh My Zsh framework
export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="robbyrussell"
plugins=(git docker kubectl macos)
source $ZSH/oh-my-zsh.sh

# Custom aliases beyond what plugins provide
alias zshconfig="vim ~/.zshrc"
alias ohmyzsh="vim ~/.oh-my-zsh"

# Enable case-insensitive auto-completion
zstyle ':completion:*' matcher-list 'm:{a-zA-Z}={A-Za-z}'

# Directory shortcuts
hash -d projects=~/Documents/Projects
hash -d docs=~/Documents

# Custom functions
mkcd() {
  mkdir -p "$1" && cd "$1"
}