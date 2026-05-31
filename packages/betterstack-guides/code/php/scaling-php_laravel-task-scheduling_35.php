# Source: https://betterstack.com/community/guides/scaling-php/laravel-task-scheduling/
# Original language: php
# Normalized: php
# Block index: 35

$schedule
    ->command("inspire")
    ->hourly()
    ->when(function () {
        $weather = . . .;
        if ($weather == "sunny") {
            return true;
        } else {
            return false;
        }
    });