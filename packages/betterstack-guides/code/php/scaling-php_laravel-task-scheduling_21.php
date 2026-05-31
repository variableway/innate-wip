# Source: https://betterstack.com/community/guides/scaling-php/laravel-task-scheduling/
# Original language: php
# Normalized: php
# Block index: 21

use App\Jobs\UpdateSearchIndex;

$schedule->job(new UpdateSearchIndex)->hourly();