# Source: https://betterstack.com/community/guides/scaling-php/laravel-task-scheduling/
# Original language: php
# Normalized: php
# Block index: 25

$schedule
    ->exec("bash script.sh")
    ->hourly()
    ->runInBackground();