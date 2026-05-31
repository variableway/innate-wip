# Source: https://betterstack.com/community/guides/web-servers/index/
# Original language: command
# Normalized: sh
# Block index: 23

docker run -it --rm -v .:/workdir --workdir /workdir --user $(id -u):$(id -g) node:20 /bin/bash -c "npm install && npm run build"