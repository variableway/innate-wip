# Source: https://betterstack.com/community/guides/scaling-php/laravel-task-scheduling/
# Original language: php
# Normalized: php
# Block index: 27

$schedule->command("inspire")->hourly(); // Execute every hour
$schedule->command("inspire")->hourlyAt(15); // Execute every hour at minute 15
$schedule->command("inspire")->everyOddHour();
$schedule->command("inspire")->everyTwoHours();
$schedule->command("inspire")->everyThreeHours();
$schedule->command("inspire")->everyFourHours();
$schedule->command("inspire")->everySixHours();