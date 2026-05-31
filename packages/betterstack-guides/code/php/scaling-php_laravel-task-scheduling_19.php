# Source: https://betterstack.com/community/guides/scaling-php/laravel-task-scheduling/
# Original language: php
# Normalized: php
# Block index: 19

<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Illuminate\Support\Facades\DB;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        $schedule
            ->call(function () {
                DB::table("users")
                    ->where("status", "inactive")
                    ->delete();
            })
            ->daily();
    }
}