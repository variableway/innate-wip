# Source: https://betterstack.com/community/guides/monitoring/php-laravel-prometheus/
# Original language: php
# Normalized: php
# Block index: 24

class PrometheusMiddleware
{
    public function __construct(CollectorRegistry $registry)
    {
        // Previous metrics...

        $this->memoryGauge = $this->registry->getOrRegisterGauge(
            'app',
            'memory_usage_bytes',
            'Current memory usage in bytes',
            ['type']
        );
    }

    public function handle(Request $request, Closure $next)
    {
        // Previous metric collection...

        // Set absolute memory values
        $this->memoryGauge->set(
            memory_get_usage(true),
            ['real']
        );
        $this->memoryGauge->set(
            memory_get_usage(false),
            ['emalloc']
        );

        return $response;
    }
}