# Source: https://betterstack.com/community/guides/scaling-php/laravel-task-scheduling/
# Original language: php
# Normalized: php
# Block index: 28

$schedule->command("inspire")->daily(); // Execute daily at 00:00
$schedule->command("inspire")->dailyAt("10:15"); // Execute daily at 10:15
$schedule->command("inspire")->twiceDaily(10, 16); // Execute twice daily at 10:00 and 16:00
$schedule->command("inspire")->twiceDailyAt(10, 16, 15); // Execute twice daily at 10:15 and 16:15