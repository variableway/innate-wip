# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics-php/
# Original language: php
# Normalized: php
# Block index: 28

<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use OpenTelemetry\SDK\Metrics\MeterProviderInterface;
use OpenTelemetry\API\Metrics\HistogramInterface;

class ExternalApiService
{
   private $meterProvider;
   private $apiLatencyHistogram;

   public function __construct(MeterProviderInterface $meterProvider)
   {
       $this->meterProvider = $meterProvider;

       $meter = $meterProvider->getMeter('laravel-app');

       // Create a histogram for API call durations
       $this->apiLatencyHistogram = $meter->createHistogram(
           'external_api.request.duration',
           'External API request duration in seconds',
           's'
       );
   }

   public function getPosts()
   {
       $startTime = microtime(true);

       try {
           $response = Http::get('https://jsonplaceholder.typicode.com/posts');
           $response->throw();
           return $response->json();
       } finally {
           $duration = microtime(true) - $startTime;

           // Record the API call duration
           $this->apiLatencyHistogram->record($duration, [
               'api' => 'jsonplaceholder',
               'endpoint' => '/posts'
           ]);
       }
   }
}