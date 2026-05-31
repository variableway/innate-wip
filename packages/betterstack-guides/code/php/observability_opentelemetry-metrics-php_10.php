# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics-php/
# Original language: php
# Normalized: php
# Block index: 10

[label app/Providers/OpenTelemetryServiceProvider.php]
<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use OpenTelemetry\SDK\Metrics\MeterProvider;
use OpenTelemetry\SDK\Metrics\MeterProviderInterface;
use OpenTelemetry\SDK\Resource\ResourceInfo;
use OpenTelemetry\SDK\Resource\ResourceInfoFactory;
use OpenTelemetry\SDK\Common\Attribute\Attributes;
use OpenTelemetry\Contrib\Otlp\MetricExporterFactory;
use OpenTelemetry\Contrib\Prometheus\MetricExporterFactory as PrometheusExporterFactory;
use OpenTelemetry\SDK\Metrics\View\View;
use OpenTelemetry\SemConv\ResourceAttributes;

class OpenTelemetryServiceProvider extends ServiceProvider
{
   public function register()
   {
       $this->app->singleton(MeterProviderInterface::class, function () {
           // Create a resource defining your application
           $resource = ResourceInfoFactory::defaultResource()->merge(
               ResourceInfo::create(Attributes::create([
                   ResourceAttributes::SERVICE_NAME => 'laravel-app',
                   ResourceAttributes::SERVICE_VERSION => '1.0.0',
               ]))
           );

           // Create the Prometheus exporter
           $prometheusExporter = (new PrometheusExporterFactory())->create();

           // Create and configure the meter provider
           $meterProvider = MeterProvider::builder()
               ->setResource($resource)
               ->addMetricExporter($prometheusExporter)
               ->build();

           return $meterProvider;
       });
   }
}