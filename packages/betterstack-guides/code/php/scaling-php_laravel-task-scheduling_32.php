# Source: https://betterstack.com/community/guides/scaling-php/laravel-task-scheduling/
# Original language: php
# Normalized: php
# Block index: 32

$schedule->command("inspire")->yearly(); // Execute on the first day of every year at 00:00
$schedule->command("inspire")->yearlyOn(6, 1, "17:00"); // Execute on June 1st of every year at 17:00