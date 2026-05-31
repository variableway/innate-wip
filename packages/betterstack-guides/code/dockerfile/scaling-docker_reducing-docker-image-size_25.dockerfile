# Source: https://betterstack.com/community/guides/scaling-docker/reducing-docker-image-size/
# Original language: dockerfile
# Normalized: dockerfile
# Block index: 25

[label Dockerfile]
FROM composer:2.3 AS composer
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-scripts --no-dev --optimize-autoloader

FROM php:8.1-fpm-alpine AS base
WORKDIR /var/www/html
# Install required extensions
RUN apk add --no-cache libpng libjpeg freetype icu \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) pdo_mysql gd intl opcache

# Copy composer dependencies
COPY --from=composer /app/vendor ./vendor

# Copy only necessary Laravel directories
COPY app ./app
COPY bootstrap ./bootstrap
COPY config ./config
COPY database ./database
COPY public ./public
COPY resources ./resources
COPY routes ./routes
COPY storage ./storage
COPY artisan .
COPY .env.example ./.env

# Set correct permissions and optimize
RUN php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache && \
    chmod -R 775 storage bootstrap/cache

# Configure opcache for production
RUN { \
    echo 'opcache.memory_consumption=128'; \
    echo 'opcache.interned_strings_buffer=8'; \
    echo 'opcache.max_accelerated_files=4000'; \
    echo 'opcache.revalidate_freq=0'; \
    echo 'opcache.fast_shutdown=1'; \
    echo 'opcache.enable_cli=1'; \
    } > /usr/local/etc/php/conf.d/opcache-recommended.ini

EXPOSE 9000
CMD ["php-fpm"]