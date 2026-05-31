# Source: https://betterstack.com/community/guides/monitoring/php-laravel-prometheus/
# Original language: php
# Normalized: php
# Block index: 2

[label routes/web.php]
<?php

use Illuminate\Support\Facades\Route;

Route::get('/metrics', function () {
    return response('', 200);
});

Route::get('/', function () {
    return 'Hello world!';
});