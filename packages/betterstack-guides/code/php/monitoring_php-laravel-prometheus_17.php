# Source: https://betterstack.com/community/guides/monitoring/php-laravel-prometheus/
# Original language: php
# Normalized: php
# Block index: 17

[label app/Http/Middleware/PrometheusMiddleware.php]
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Prometheus\CollectorRegistry;

class PrometheusMiddleware
{
    private $registry;
    private $counter;

    public function __construct(CollectorRegistry $registry)
    {
        $this->registry = $registry;
        $this->counter = $registry->getOrRegisterCounter(
            'app',
            'http_requests_total',
            'Total number of HTTP requests',
            ['status', 'path', 'method']
        );
    }

    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        $this->counter->inc([
            'status' => $response->getStatusCode(),
            'path' => $request->path(),
            'method' => $request->method()
        ]);

        return $response;
    }
}