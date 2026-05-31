# Source: https://betterstack.com/community/guides/scaling-php/laravel-task-scheduling/
# Original language: php
# Normalized: php
# Block index: 42

$schedule
    ->command(". . .")
    ->before(function () use ($logger) {
        Log::info("The script weather.php executed at " . time());
    })
    ->onSuccess(function (Stringable $output) {
        // The task succeeded...
    })
    ->onFailure(function (Stringable $output) {
        // The task failed...
    })
    ->everyMinute();