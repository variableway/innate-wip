# Source: https://betterstack.com/community/guides/scaling-php/laravel-task-scheduling/
# Original language: php
# Normalized: php
# Block index: 41

use Illuminate\Support\Stringable;

$schedule
    ->exec("bash scripts/backup.bash")
    ->before(function () use ($logger) {
        Log::info("The database backup script executed at " . time());
    })
    ->after(function (Stringable $output) {
        Log::info($output);
    })
    ->everyMinute();