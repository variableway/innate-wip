# Source: https://betterstack.com/community/guides/scaling-nodejs/mise-vs-asdf/
# Original language: bash
# Normalized: sh
# Block index: 19

# Project structure
~/work/
  ├── legacy-api/
  │   └── .tool-versions      # node 16.20.0, ruby 2.7.8
  ├── main-app/
  │   └── .tool-versions      # node 18.19.0, ruby 3.1.4
  └── new-service/
      └── .tool-versions      # node 20.10.0, ruby 3.2.2

# Switching is automatic
$ cd ~/work/legacy-api && node --version
v16.20.0

$ cd ~/work/new-service && node --version
v20.10.0

# Global fallback for directories without .tool-versions
$ asdf global nodejs 20.10.0
$ cd ~/scratch && node --version
v20.10.0