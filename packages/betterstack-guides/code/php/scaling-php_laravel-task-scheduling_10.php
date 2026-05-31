# Source: https://betterstack.com/community/guides/scaling-php/laravel-task-scheduling/
# Original language: php
# Normalized: php
# Block index: 10

$schedule
    ->command("inspire")
    ->everyMinute()
    ->sendOutputTo("scheduler-output.log");