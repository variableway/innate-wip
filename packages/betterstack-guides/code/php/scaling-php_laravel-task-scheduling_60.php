# Source: https://betterstack.com/community/guides/scaling-php/laravel-task-scheduling/
# Original language: php
# Normalized: php
# Block index: 60

[label app/Console/Kernel.php]
<?php

namespace App\Console;

. . .

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule)
    {
        . . .

        $schedule
            ->exec("bash scripts/backup.sh")
            ->thenPing("https://betterstack.com/api/v1/heartbeat/<heartbeat_id>")
            ->everyMinute();
    }

    . . .
}