# Source: https://betterstack.com/community/guides/monitoring/php-laravel-prometheus/
# Original language: php
# Normalized: php
# Block index: 20

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
    private $gauge;

    public function __construct(CollectorRegistry $registry)
    {
        $this->registry = $registry;

        // Previous counter definition...

        $this->gauge = $this->registry->getOrRegisterGauge(
            'app',                         // namespace
            'http_active_requests',        // name
            'Number of active HTTP requests', // help text
        );
    }

    public function handle(Request $request, Closure $next)
    {
        $this->gauge->inc();  // Increment before processing

        $response = $next($request);

        $this->counter->inc([
            $response->getStatusCode(),
            $request->path(),
            $request->method()
        ]);

        $this->gauge->dec();  // Decrement after processing

        return $response;
    }
}