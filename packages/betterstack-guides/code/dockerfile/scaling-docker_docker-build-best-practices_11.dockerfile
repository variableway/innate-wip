# Source: https://betterstack.com/community/guides/scaling-docker/docker-build-best-practices/
# Original language: dockerfile
# Normalized: dockerfile
# Block index: 11

[label Dockerfile]
FROM ubuntu:24.04
RUN apt-get update
RUN apt-get install -y nginx
RUN apt-get install -y curl