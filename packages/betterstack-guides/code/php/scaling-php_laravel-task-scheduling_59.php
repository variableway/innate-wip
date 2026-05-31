# Source: https://betterstack.com/community/guides/scaling-php/laravel-task-scheduling/
# Original language: php
# Normalized: php
# Block index: 59

$schedule->command("inspire")->everyMinute()->emailOutputOnFailure("<email_address>");