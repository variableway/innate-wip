# Source: https://betterstack.com/community/guides/monitoring/php-laravel-prometheus/
# Original language: php
# Normalized: php
# Block index: 15

[label routes/web.php]
<?php

use Prometheus\CollectorRegistry;
use Prometheus\RenderTextFormat;

Route::get('/metrics', function (CollectorRegistry $registry) {
    $renderer = new RenderTextFormat();
    return response($renderer->render($registry->getMetricFamilySamples()))
        ->header('Content-Type', RenderTextFormat::MIME_TYPE);
});