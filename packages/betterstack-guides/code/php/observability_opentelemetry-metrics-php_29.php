# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics-php/
# Original language: php
# Normalized: php
# Block index: 29

use App\Services\ExternalApiService;

Route::get('/posts', function (ExternalApiService $service) {
   return $service->getPosts();
});