# Source: https://betterstack.com/community/guides/scaling-php/laravel-task-scheduling/
# Original language: php
# Normalized: php
# Block index: 31

$schedule->command("inspire")->monthly(); // Execute on the first day of every month at 00:00
$schedule->command("inspire")->monthlyOn(4, "15:00"); // Execute on the fourth day of every month at 15:00
$schedule->command("inspire")->twiceMonthly(1, 16, "13:00"); // Execute on the first and sixteenth day of every month at 13:00
$schedule->command("inspire")->lastDayOfMonth("15:00"); // Execute on the last day of every month at 15:00
$schedule->command("inspire")->quarterly(); // Execute on the first day of every quarter at 00:00