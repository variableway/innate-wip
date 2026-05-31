# Source: https://betterstack.com/community/guides/scaling-php/laravel-task-scheduling/
# Original language: php
# Normalized: php
# Block index: 39

$schedule
    ->command("inspire")
    ->weekly()
    ->wednesdays()
    ->at("13:15"); // Executes every Wednesday at 13:15