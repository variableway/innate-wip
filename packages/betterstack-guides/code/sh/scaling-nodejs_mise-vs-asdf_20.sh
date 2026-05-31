# Source: https://betterstack.com/community/guides/scaling-nodejs/mise-vs-asdf/
# Original language: bash
# Normalized: sh
# Block index: 20

# Same directory isolation
~/work/
  ├── legacy-api/
  │   └── .tool-versions      # node 16.20.0
  ├── main-app/
  │   └── .mise.toml          # node 18.19.0, env vars, tasks
  └── new-service/
      └── .tool-versions      # node 20.10.0

# Check all project versions at once
$ mise ls --all
Tool  Version   Source
node  16.20.0  ~/work/legacy-api/.tool-versions
node  18.19.0  ~/work/main-app/.mise.toml
node  20.10.0  ~/work/new-service/.tool-versions

# Set versions for a group of projects
$ mise use --path ~/work node@18.19.0  # Sets default for ~/work and subdirectories