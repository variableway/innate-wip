# Source: https://betterstack.com/community/guides/scaling-nodejs/mise-vs-asdf/
# Original language: bash
# Normalized: sh
# Block index: 14

# Built-in support for major languages
$ mise use python@3.11  # No plugin needed

# asdf plugins work too
$ mise plugin install elixir https://github.com/asdf-vm/asdf-elixir
$ mise install elixir@1.15.0

# List plugins
$ mise plugins ls
elixir      https://github.com/asdf-vm/asdf-elixir