# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics-php/
# Original language: php
# Normalized: php
# Block index: 23

public function __construct(MeterProviderInterface $meterProvider)
{
   // Previous metrics...

   // Create a gauge for memory usage
   $this->memoryGauge = $meter->createUpDownCounter(
       'app.memory_usage_bytes',
       'Current memory usage in bytes',
       'bytes'
   );
}

public function handle(Request $request, Closure $next)
{
   // Previous metric collection...

   // Record current memory usage
   $memoryUsage = memory_get_usage(true);

   // Reset the gauge value (since we want absolute value, not incremental)
   $this->memoryGauge->add($memoryUsage, ['type' => 'real']);

   return $response;
}