# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics-php/
# Original language: php
# Normalized: php
# Block index: 14

[label routes/web.php]
use App\Http\Controllers\MetricsController;

Route::get('/metrics', [MetricsController::class, 'metrics']);