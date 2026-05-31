# Source: https://betterstack.com/community/guides/scaling-nodejs/mise-vs-asdf/
# Original language: bash
# Normalized: sh
# Block index: 0

# Clone the repository
git clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v0.16.1

# Add to your shell (bash example)
echo '. "$HOME/.asdf/asdf.sh"' >> ~/.bashrc
echo '. "$HOME/.asdf/completions/asdf.bash"' >> ~/.bashrc

# Restart your shell
exec $SHELL