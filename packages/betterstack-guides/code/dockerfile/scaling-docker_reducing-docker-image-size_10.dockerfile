# Source: https://betterstack.com/community/guides/scaling-docker/reducing-docker-image-size/
# Original language: dockerfile
# Normalized: dockerfile
# Block index: 10

[label Dockerfile]
RUN npm ci --production && \
    npm cache clean --force