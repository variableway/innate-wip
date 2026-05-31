# Source: https://betterstack.com/community/guides/scaling-nodejs/mise-vs-asdf/
# Original language: bash
# Normalized: sh
# Block index: 7

# Same automatic behavior
$ cd ~/projects/legacy-app
$ node --version
v18.19.0

# Check active versions
$ mise ls
Tool    Version  Config Source            Requested
node    18.19.0  ~/projects/legacy-app/.tool-versions  18
ruby    3.2.2    ~/.config/mise/config.toml            3.2