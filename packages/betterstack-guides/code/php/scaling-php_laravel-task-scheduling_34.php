# Source: https://betterstack.com/community/guides/scaling-php/laravel-task-scheduling/
# Original language: php
# Normalized: php
# Block index: 34

// Execute hourly on weekdays, between 08:00 and 17:00
$schedule
    ->command("inspire")
    ->weekdays()
    ->hourly()
    ->between("8:00", "17:00");

// Execute hourly on weekdays, before 08:00 and after 17:00
$schedule
    ->command("inspire")
    ->weekdays()
    ->hourly()
    ->unlessBetween("8:00", "17:00");