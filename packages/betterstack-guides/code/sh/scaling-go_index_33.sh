# Source: https://betterstack.com/community/guides/scaling-go/index/
# Original language: command
# Normalized: sh
# Block index: 33

docker run \
   --rm \
   --name go-blog-caddy \
[highlight]
   -p 80:80 \
   -v caddy-config:/config \
   -v caddy-data:/data \
   -v $(pwd)/Caddyfile:/etc/caddy/Caddyfile \
   --network go-blog-network \
[/highlight]
   caddy