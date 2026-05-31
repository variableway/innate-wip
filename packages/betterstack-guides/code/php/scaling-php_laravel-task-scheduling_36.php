# Source: https://betterstack.com/community/guides/scaling-php/laravel-task-scheduling/
# Original language: php
# Normalized: php
# Block index: 36

$schedule
    ->command("inspire")
    ->hourly()
    ->skip(function () {
        $weather = . . .;
        if ($weather == "rainy") {
            return true;
        } else {
            return false;
        }
    });