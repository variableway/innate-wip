# Source: https://betterstack.com/community/guides/scaling-docker/trivy-container/
# Original language: dockerfile
# Normalized: dockerfile
# Block index: 2

[label Dockerfile]
FROM ubuntu:latest

EXPOSE 22

MAINTAINER admin@admin.local

RUN apt-get update && apt-get install -y openssh-server