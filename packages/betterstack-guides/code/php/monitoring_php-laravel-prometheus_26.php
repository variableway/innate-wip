# Source: https://betterstack.com/community/guides/monitoring/php-laravel-prometheus/
# Original language: php
# Normalized: php
# Block index: 26

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
    private $histogram;

    public function __construct(CollectorRegistry $registry)
    {
        $this->registry = $registry;

        // Previous metrics...

        $this->histogram = $registry->getOrRegisterHistogram(
            'app',
            'http_request_duration_seconds',
            'HTTP request duration in seconds',
            ['status', 'path', 'method'],
            [0.1, 0.25, 0.5, 1, 2.5, 5]
        );
    }

    public function handle(Request $request, Closure $next)
    {
        $this->gauge->inc();
        $start = microtime(true);

        $response = $next($request);

        $duration = microtime(true) - $start;

        $this->counter->inc([
            'status' => $response->getStatusCode(),
            'path' => $request->path(),
            'method' => $request->method()
        ]);

        $this->histogram->observe(
            $duration,
            [
                'status' => $response->getStatusCode(),
                'path' => $request->path(),
                'method' => $request->method()
            ]
        );

        $this->gauge->dec();

        return $response;
    }
}