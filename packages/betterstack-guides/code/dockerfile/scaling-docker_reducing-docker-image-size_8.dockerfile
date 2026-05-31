# Source: https://betterstack.com/community/guides/scaling-docker/reducing-docker-image-size/
# Original language: dockerfile
# Normalized: dockerfile
# Block index: 8

[label Dockerfile]
RUN apk add --no-cache some-package && \
    # Do some work with the package
    rm -rf /var/cache/apk/*