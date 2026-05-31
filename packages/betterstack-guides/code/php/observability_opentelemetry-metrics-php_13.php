# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics-php/
# Original language: php
# Normalized: php
# Block index: 13

[label app/Http/Controllers/MetricsController.php]
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use OpenTelemetry\SDK\Metrics\MeterProviderInterface;
use OpenTelemetry\Contrib\Prometheus\MetricExporterFactory;

class MetricsController extends Controller
{
   protected $meterProvider;

   public function __construct(MeterProviderInterface $meterProvider)
   {
       $this->meterProvider = $meterProvider;
   }

   public function metrics()
   {
       // Get the Prometheus exporter and render metrics
       $factory = new MetricExporterFactory();
       $exporter = $factory->create();
       $metrics = $exporter->getPrometheusRenderer()->render();

       return response($metrics)
           ->header('Content-Type', 'text/plain');
   }
}