# Source: https://betterstack.com/community/guides/scaling-nodejs/mise-vs-asdf/
# Original language: bash
# Normalized: sh
# Block index: 18

# Update mise itself
$ brew upgrade mise
# or: mise self-update

# Check outdated versions
$ mise outdated
Tool    Requested  Current  Latest
node    20.10.0   20.10.0  20.11.0
ruby    3.2.2     3.2.2    3.3.0

# Update all tools
$ mise upgrade
Upgrading node@20.10.0 to node@20.11.0...
Upgrading ruby@3.2.2 to ruby@3.3.0...