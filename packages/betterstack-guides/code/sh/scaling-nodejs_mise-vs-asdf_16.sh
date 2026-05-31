# Source: https://betterstack.com/community/guides/scaling-nodejs/mise-vs-asdf/
# Original language: bash
# Normalized: sh
# Block index: 16

# Installing languages works much like asdf
$ time mise install ruby@3.2.2
Installing ruby@3.2.2...
Installed ruby-3.2.2 to /home/user/.local/share/mise/installs/ruby/3.2.2

real    8m41.334s
user    7m18.223s
sys     0m48.112s

# Pre-built binaries when available
$ time mise install node@20.10.0
Installing node@20.10.0...
Installed node@20.10.0 to /home/user/.local/share/mise/installs/node/20.10.0

real    0m19.223s
user    0m6.891s
sys     0m2.998s