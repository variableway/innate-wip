# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics-php/
# Original language: php
# Normalized: php
# Block index: 24

<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use OpenTelemetry\SDK\Metrics\MeterProviderInterface;
use OpenTelemetry\API\Metrics\CounterInterface;
use OpenTelemetry\API\Metrics\UpDownCounterInterface;
use OpenTelemetry\API\Metrics\HistogramInterface;

class OpenTelemetryMiddleware
{
   private $meterProvider;
   private $requestCounter;
   private $activeRequestsGauge;
   private $requestDurationHistogram;

   public function __construct(MeterProviderInterface $meterProvider)
   {
       $this->meterProvider = $meterProvider;

       $meter = $meterProvider->getMeter('laravel-app');

       // Previous metrics...

       // Create a histogram for request durations
       $this->requestDurationHistogram = $meter->createHistogram(
           'http.request.duration',
           'HTTP request duration in seconds',
           's'  // seconds
       );
   }

   public function handle(Request $request, Closure $next)
   {
       // Increment active requests gauge
       $this->activeRequestsGauge->add(1, [
           'path' => $request->path() === '/' ? 'root' : $request->path(),
       ]);

       // Start timing the request
       $startTime = microtime(true);

       $response = $next($request);

       // Calculate request duration
       $duration = microtime(true) - $startTime;

       // Increment request counter
       $this->requestCounter->add(1, [
           'status' => $response->getStatusCode(),
           'path' => $request->path() === '/' ? 'root' : $request->path(),
           'method' => $request->method()
       ]);

       // Record request duration in the histogram
       $this->requestDurationHistogram->record($duration, [
           'status' => $response->getStatusCode(),
           'path' => $request->path() === '/' ? 'root' : $request->path(),
           'method' => $request->method()
       ]);

       // Decrement active requests gauge
       $this->activeRequestsGauge->add(-1, [
           'path' => $request->path() === '/' ? 'root' : $request->path(),
       ]);

       return $response;
   }
}