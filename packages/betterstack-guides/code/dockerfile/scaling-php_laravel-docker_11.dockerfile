# Source: https://betterstack.com/community/guides/scaling-php/laravel-docker/
# Original language: dockerfile
# Normalized: dockerfile
# Block index: 11

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer