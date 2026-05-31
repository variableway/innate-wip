# Source: https://betterstack.com/community/guides/scaling-docker/reducing-docker-image-size/
# Original language: dockerfile
# Normalized: dockerfile
# Block index: 5

[Dockerfile]
RUN npm ci --production && \
    npm cache clean --force && \
    rm -rf /tmp/* /var/cache/apk/*