# Source: https://betterstack.com/community/guides/linux/index/
# Original language: zsh
# Normalized: sh
# Block index: 15

# In ~/.zshrc - Import Bash configuration
# Add this near the top before framework initialization

# Import aliases from Bash
if [ -f ~/.bash_aliases ]; then
    source ~/.bash_aliases
fi

# Import environment variables from Bash profile
if [ -f ~/.bash_profile ]; then
    source ~/.bash_profile
fi

# Note: Some Bash-specific syntax may need adjustment
# - Array indexing syntax differences
# - Test conditions may need parentheses instead of brackets
# - Some environment settings might use different variable names