# Source: https://betterstack.com/community/guides/logging/caddy-logging/
# Original language: dockerfile
# Normalized: dockerfile
# Block index: 32

[label Dockerfile]
ARG VERSION=2.9.1

FROM caddy:${VERSION}-builder AS builder

RUN xcaddy build \
  --with github.com/caddyserver/transform-encoder

FROM caddy:${VERSION}

COPY --from=builder /usr/bin/caddy /usr/bin/caddy