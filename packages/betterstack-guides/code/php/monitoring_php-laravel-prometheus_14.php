# Source: https://betterstack.com/community/guides/monitoring/php-laravel-prometheus/
# Original language: php
# Normalized: php
# Block index: 14

[label config/app.php]
'providers' => [
    // Other providers...
    App\Providers\PrometheusServiceProvider::class,
],