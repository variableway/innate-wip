# Source: https://betterstack.com/community/guides/scaling-docker/reducing-docker-image-size/
# Original language: dockerfile
# Normalized: dockerfile
# Block index: 24

[Dockerfile - PHP Composer Optimization]
FROM composer:2.3 AS composer
WORKDIR /app
COPY composer.json composer.lock ./
# Install dependencies and optimize autoloader
RUN composer install --no-scripts --no-dev --optimize-autoloader

FROM php:8.1-fpm-alpine
WORKDIR /var/www/html
# Install production extensions
RUN apk add --no-cache \
    libpng \
    libjpeg \
    freetype \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) pdo_mysql gd

# Copy only the vendor directory from the composer stage
COPY --from=composer /app/vendor ./vendor
# Copy application code
COPY . .

# Cleanup
RUN rm -rf /tmp/* /var/cache/apk/*