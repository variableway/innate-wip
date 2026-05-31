# Source: https://betterstack.com/community/guides/scaling-php/laravel-task-scheduling/
# Original language: php
# Normalized: php
# Block index: 37

$schedule
    ->command("inspire")
    ->weekdays()
    ->environments(["staging", "production"]);