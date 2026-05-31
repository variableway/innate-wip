# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics-php/
# Original language: php
# Normalized: php
# Block index: 11

[label config/app.php]
'providers' => [
   // Other providers...
   App\Providers\OpenTelemetryServiceProvider::class,
],