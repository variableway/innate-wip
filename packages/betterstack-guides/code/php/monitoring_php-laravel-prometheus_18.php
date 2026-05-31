# Source: https://betterstack.com/community/guides/monitoring/php-laravel-prometheus/
# Original language: php
# Normalized: php
# Block index: 18

[label app/Http/Kernel.php]
protected $middleware = [
    // ...
    \App\Http\Middleware\PrometheusMiddleware::class,
];