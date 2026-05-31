# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics-php/
# Original language: php
# Normalized: php
# Block index: 1

[label routes/web.php]
<?php

use Illuminate\Support\Facades\Route;

Route::get('/metrics', function () {
   return response('', 200);
});

Route::get('/', function () {
   return 'Hello world!';
});