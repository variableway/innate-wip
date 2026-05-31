# Source: https://betterstack.com/community/guides/scaling-docker/reducing-docker-image-size/
# Original language: dockerfile
# Normalized: dockerfile
# Block index: 2

[label Dockerfile]
# Full image: includes many tools which are unnecessary for most projects
FROM node:latest  # ~1GB+

# Slim variant: minimal Debian with Node.js
FROM node:22-slim  # ~220MB

# Alpine variant: extremely minimal Linux distribution
FROM node:22-alpine  # ~150MB