# Source: https://betterstack.com/community/guides/linux/index/
# Original language: bash
# Normalized: sh
# Block index: 16

# Set Bash as default shell
chsh -s $(which bash)

# Create basic Bash configuration
touch ~/.bashrc ~/.bash_profile

# Configure Bash to approximate some Zsh features
# In ~/.bashrc:

# Enable advanced tab completion
if [ -f /etc/bash_completion ]; then
    source /etc/bash_completion
fi

# Enhance history
HISTSIZE=10000
HISTFILESIZE=20000
HISTCONTROL=ignoreboth
shopt -s histappend

# Improve directory navigation
shopt -s autocd
shopt -s cdspell
shopt -s dirspell

# Customize prompt (simplified version of common Zsh prompts)
PS1='\[\033[01;32m\]\u@\h\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]\$ '