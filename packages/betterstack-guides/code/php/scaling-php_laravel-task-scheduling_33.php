# Source: https://betterstack.com/community/guides/scaling-php/laravel-task-scheduling/
# Original language: php
# Normalized: php
# Block index: 33

$schedule->command("inspire")->weekly()->weekdays(); // Runs every Monday to Friday at 00:00
$schedule->command("inspire")->weekly()->weekends(); // Limit the task to weekends alone
$schedule->command("inspire")->weekly()->sundays();
$schedule->command("inspire")->weekly()->mondays();
$schedule->command("inspire")->weekly()->tuesdays();
$schedule->command("inspire")->weekly()->wednesdays();
$schedule->command("inspire")->weekly()->thursdays();
$schedule->command("inspire")->weekly()->fridays();
$schedule->command("inspire")->weekly()->saturdays();
$schedule->command("inspire")->weekly()->days([2, 5]); // Execute every Tuesday and Friday at 00:00