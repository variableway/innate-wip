# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics-php/
# Original language: dockerfile
# Normalized: dockerfile
# Block index: 3

[label Dockerfile]
FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
   git \
   curl \
   libpng-dev \
   libonig-dev \
   libxml2-dev \
   zip \
   unzip

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Get Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy existing application directory contents
COPY . .

# Install dependencies
RUN composer install

# Expose port 8000
EXPOSE 8000

# Start PHP server
CMD php artisan serve --host=0.0.0.0 --port=8000