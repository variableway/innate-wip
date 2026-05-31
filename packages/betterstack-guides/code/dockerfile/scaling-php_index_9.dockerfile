# Source: https://betterstack.com/community/guides/scaling-php/index/
# Original language: dockerfile
# Normalized: dockerfile
# Block index: 9

RUN apt-get update && apt-get install -y \
   git \
   curl \
   libpng-dev \
   libonig-dev \
   libxml2-dev \
   zip \
   unzip