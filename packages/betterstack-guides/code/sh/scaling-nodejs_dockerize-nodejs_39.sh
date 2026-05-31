# Source: https://betterstack.com/community/guides/scaling-nodejs/dockerize-nodejs/
# Original language: command
# Normalized: sh
# Block index: 39

docker run \
  --rm \
  --name url-shortener-caddy-server \
  -p 80:80 \
[highlight]
  -v caddy-config:/config \
  -v caddy-data:/data \
  -v $(pwd)/Caddyfile:/etc/caddy/Caddyfile \
  --network url-shortener \
[/highlight]
  caddy:alpine