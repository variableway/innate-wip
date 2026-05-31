# Source: https://betterstack.com/community/guides/scaling-docker/docker-build-best-practices/
# Original language: dockerfile
# Normalized: dockerfile
# Block index: 16

[label Dockerfile]
FROM ubuntu:24.04
RUN apt-get update && apt-get install -y mysql-server
# Database directly in container - data lost when container is removed
CMD ["mysqld"]