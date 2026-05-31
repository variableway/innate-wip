# Source: https://betterstack.com/community/guides/monitoring/php-laravel-prometheus/
# Original language: php
# Normalized: php
# Block index: 31

[label routes/web.php]
use App\Services\PostsService;

Route::get('/posts', function (PostsService $service) {
    return $service->getPosts();
});