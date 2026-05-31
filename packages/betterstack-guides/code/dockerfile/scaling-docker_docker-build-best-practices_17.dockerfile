# Source: https://betterstack.com/community/guides/scaling-docker/docker-build-best-practices/
# Original language: dockerfile
# Normalized: dockerfile
# Block index: 17

[label Dockerfile]
FROM mysql:8.4
# Configuration through environment variables
ENV MYSQL_ROOT_PASSWORD=my-secret-pw
ENV MYSQL_DATABASE=app_db
# Data stored in a volume that persists beyond the container
VOLUME /var/lib/mysql
CMD ["mysqld"]