# Source: https://betterstack.com/community/guides/scaling-nodejs/mise-vs-asdf/
# Original language: bash
# Normalized: sh
# Block index: 6

# Project A uses Node 18
$ cd ~/projects/legacy-app
$ node --version
v18.19.0

# Project B uses Node 20
$ cd ~/projects/new-app
$ node --version
v20.10.0

# Check what's active
$ asdf current
nodejs          18.19.0         ~/projects/legacy-app/.tool-versions
ruby            3.2.2           ~/.tool-versions