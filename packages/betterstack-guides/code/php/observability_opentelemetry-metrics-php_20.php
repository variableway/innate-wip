# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics-php/
# Original language: php
# Normalized: php
# Block index: 20

<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use OpenTelemetry\SDK\Metrics\MeterProviderInterface;
use OpenTelemetry\API\Metrics\CounterInterface;
use OpenTelemetry\API\Metrics\UpDownCounterInterface;

class OpenTelemetryMiddleware
{
   private $meterProvider;
   private $requestCounter;
   private $activeRequestsGauge;

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

       // Create a gauge (implemented as an up-down counter) for active requests
       $this->activeRequestsGauge = $meter->createUpDownCounter(
           'http.requests.active',
           'Number of active HTTP requests',
           'requests'
       );
   }

   public function handle(Request $request, Closure $next)
   {
       // Increment the active requests gauge before processing
       $this->activeRequestsGauge->add(1, [
           'path' => $request->path() === '/' ? 'root' : $request->path(),
       ]);

       $response = $next($request);

       // Increment the total requests counter
       $this->requestCounter->add(1, [
           'status' => $response->getStatusCode(),
           'path' => $request->path() === '/' ? 'root' : $request->path(),
           'method' => $request->method()
       ]);

       // Decrement the active requests gauge after processing
       $this->activeRequestsGauge->add(-1, [
           'path' => $request->path() === '/' ? 'root' : $request->path(),
       ]);

       return $response;
   }
}