# Source: https://betterstack.com/community/guides/scaling-nodejs/mise-vs-asdf/
# Original language: bash
# Normalized: sh
# Block index: 21

# For bash
echo '. "$HOME/.asdf/asdf.sh"' >> ~/.bashrc
echo '. "$HOME/.asdf/completions/asdf.bash"' >> ~/.bashrc

# For zsh  
echo '. "$HOME/.asdf/asdf.sh"' >> ~/.zshrc
echo '. "$HOME/.asdf/completions/asdf.zsh"' >> ~/.zshrc

# For fish
echo 'source ~/.asdf/asdf.fish' >> ~/.config/fish/config.fish

# The sourced script adds hooks to your shell
# These hooks run before each command prompt