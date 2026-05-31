# Source: https://betterstack.com/community/guides/scaling-nodejs/mise-vs-asdf/
# Original language: bash
# Normalized: sh
# Block index: 15

# Installing Ruby takes several minutes
$ time asdf install ruby 3.2.2
Downloading ruby-3.2.2.tar.gz...
Installing ruby-3.2.2...
Installed ruby-3.2.2 to /home/user/.asdf/installs/ruby/3.2.2

real    8m34.221s
user    7m12.445s
sys     0m45.789s

# Node installs from pre-built binaries (faster)
$ time asdf install nodejs 20.10.0
Downloading node-v20.10.0-linux-x64.tar.gz...
Installed nodejs 20.10.0 to /home/user/.asdf/installs/nodejs/20.10.0

real    0m23.445s
user    0m8.123s
sys     0m3.234s