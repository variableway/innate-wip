# Source: https://betterstack.com/community/guides/scaling-docker/docker-build-best-practices/
# Original language: dockerfile
# Normalized: dockerfile
# Block index: 24

[label Dockerfile]
FROM node:22
# Use ADD for extracting archives
ADD project.tar.gz /app/

# Use ADD for downloading files with checksum verification
ADD --checksum=sha256:24cb2a3f9ae9d9754ae493df3b41a2c4c75a05ab8c518165582edd0ef4eaff80 \
   https://example.com/download/package.zip /app/package.zip