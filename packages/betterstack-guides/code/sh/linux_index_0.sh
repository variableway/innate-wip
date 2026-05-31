# Source: https://betterstack.com/community/guides/linux/index/
# Original language: bash
# Normalized: sh
# Block index: 0

# ~/.bashrc - for interactive non-login shells
# This file contains most of your personal configuration

# Add colorized output for ls command
alias ls='ls --color=auto'

# Custom command prompt with username, hostname, and current directory
PS1='\u@\h:\w\$ '

# Set command history size
HISTSIZE=1000
HISTFILESIZE=2000

# Add custom directory to PATH
export PATH=$PATH:$HOME/bin

# ~/.bash_profile - for login shells
# Often just sources ~/.bashrc plus environment variables

if [ -f ~/.bashrc ]; then
    . ~/.bashrc
fi

export EDITOR=vim