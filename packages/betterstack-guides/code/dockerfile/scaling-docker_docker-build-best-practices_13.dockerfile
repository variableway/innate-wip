# Source: https://betterstack.com/community/guides/scaling-docker/docker-build-best-practices/
# Original language: dockerfile
# Normalized: dockerfile
# Block index: 13

[label Dockerfile]
FROM ubuntu:24.04
RUN apt-get update && apt-get install -y --no-install-recommends \
   nginx=1.24.0-2ubuntu1 \
   curl=8.5.0-2ubuntu1 \
&& rm -rf /var/lib/apt/lists/*