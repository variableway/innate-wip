# Source: https://betterstack.com/community/guides/scaling-nodejs/mise-vs-asdf/
# Original language: bash
# Normalized: sh
# Block index: 8

# You need a separate tool like direnv
$ cat .envrc
export DATABASE_URL="postgresql://localhost/myapp"
export API_KEY="secret-key-here"
export NODE_ENV="development"

# With direnv configured
$ cd my-project
direnv: loading ~/my-project/.envrc
direnv: export +DATABASE_URL +API_KEY +NODE_ENV