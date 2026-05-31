# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics-php/
# Original language: php
# Normalized: php
# Block index: 18

[label app/Http/Kernel.php]
protected $middleware = [
   // ...
   \App\Http\Middleware\OpenTelemetryMiddleware::class,
];