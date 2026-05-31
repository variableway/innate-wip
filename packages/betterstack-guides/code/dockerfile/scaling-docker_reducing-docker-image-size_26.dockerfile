# Source: https://betterstack.com/community/guides/scaling-docker/reducing-docker-image-size/
# Original language: dockerfile
# Normalized: dockerfile
# Block index: 26

[label Dockerfile]
FROM php:8.1-cli-alpine
WORKDIR /app

# Install minimal extensions
RUN apk add --no-cache libpq-dev \
    && docker-php-ext-install -j$(nproc) pdo_pgsql

COPY . .
# Remove development files
RUN rm -rf tests phpunit.xml .git .github

EXPOSE 8000
CMD ["php", "-S", "0.0.0.0:8000", "-t", "public"]