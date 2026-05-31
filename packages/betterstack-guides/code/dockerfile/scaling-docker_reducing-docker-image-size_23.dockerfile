# Source: https://betterstack.com/community/guides/scaling-docker/reducing-docker-image-size/
# Original language: dockerfile
# Normalized: dockerfile
# Block index: 23

[Dockerfile - PHP Alpine Base]
FROM php:8.1-fpm-alpine
WORKDIR /var/www/html

# Install only required extensions
RUN apk add --no-cache \
    libpng-dev \
    libzip-dev \
    && docker-php-ext-install \
    pdo_mysql \
    gd \
    zip \
    && apk del libpng-dev libzip-dev

COPY . .