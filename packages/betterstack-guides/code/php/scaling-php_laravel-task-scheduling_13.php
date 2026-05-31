# Source: https://betterstack.com/community/guides/scaling-php/laravel-task-scheduling/
# Original language: php
# Normalized: php
# Block index: 13

$schedule
    ->command("inspire")
    ->everyMinute()
    ->appendOutputTo("scheduler-output.log");