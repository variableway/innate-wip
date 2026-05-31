# Source: https://betterstack.com/community/guides/scaling-nodejs/mise-vs-asdf/
# Original language: bash
# Normalized: sh
# Block index: 13

# Browse available plugins
$ asdf plugin list all
1password-cli
R
actionlint
act
ag
...

# Install a plugin
$ asdf plugin add elixir
$ asdf plugin add kubectl

# Some plugins need additional dependencies
$ asdf plugin add ruby
# May need build tools: apt-get install libssl-dev libreadline-dev