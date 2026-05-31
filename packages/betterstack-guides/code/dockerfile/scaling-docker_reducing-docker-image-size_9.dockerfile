# Source: https://betterstack.com/community/guides/scaling-docker/reducing-docker-image-size/
# Original language: dockerfile
# Normalized: dockerfile
# Block index: 9

[label Dockerfile]
RUN apt-get update && \
    apt-get install -y --no-install-recommends some-package && \
    # Do some work with the package
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*