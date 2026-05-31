# Source: https://betterstack.com/community/guides/scaling-nodejs/mise-vs-asdf/
# Original language: bash
# Normalized: sh
# Block index: 10

# You use whatever task runner your project has
$ cat Makefile
test:
    npm test
    
dev:
    npm run dev
    
install:
    npm install

# Run with make
$ make test