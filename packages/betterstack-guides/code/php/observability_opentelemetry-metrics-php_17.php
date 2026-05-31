# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics-php/
# Original language: php
# Normalized: php
# Block index: 17

[label app/Http/Middleware/OpenTelemetryMiddleware.php]
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use OpenTelemetry\SDK\Metrics\MeterProviderInterface;
use OpenTelemetry\API\Metrics\CounterInterface;

class OpenTelemetryMiddleware
{
   private $meterProvider;
   private $requestCounter;

   public function __construct(MeterProviderInterface $meterProvider)
   {
       $this->meterProvider = $meterProvider;

       $meter = $meterProvider->getMeter('laravel-app');

       // Create a counter for total HTTP requests
       $this->requestCounter = $meter->createCounter(
           'http.requests.total',
           'Total number of HTTP requests',
           'requests'
       );
   }

   public function handle(Request $request, Closure $next)
   {
       $response = $next($request);

       // Increment the counter with appropriate attributes
       $this->requestCounter->add(1, [
           'status' => $response->getStatusCode(),
           'path' => $request->path() === '/' ? 'root' : $request->path(),
           'method' => $request->method()
       ]);

       return $response;
   }
}