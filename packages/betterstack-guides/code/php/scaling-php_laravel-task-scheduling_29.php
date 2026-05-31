# Source: https://betterstack.com/community/guides/scaling-php/laravel-task-scheduling/
# Original language: php
# Normalized: php
# Block index: 29

$schedule->command("inspire")->weekly(); // Execute weekly on Sunday at 00:00
$schedule->command("inspire")->weeklyOn(2, "8:00"); // Execute weekly on Tuesday at 08:00