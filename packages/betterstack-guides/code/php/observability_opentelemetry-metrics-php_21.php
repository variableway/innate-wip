# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics-php/
# Original language: php
# Normalized: php
# Block index: 21

Route::get('/', function () {
   $delay = random_int(1, 5);  // Random delay between 1 and 5 seconds
   sleep($delay);
   return 'Hello world!';
});