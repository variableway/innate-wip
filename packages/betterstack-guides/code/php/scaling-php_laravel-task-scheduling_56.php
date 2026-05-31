# Source: https://betterstack.com/community/guides/scaling-php/laravel-task-scheduling/
# Original language: php
# Normalized: php
# Block index: 56

[label app/Console/Kernel.php]
<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;
use Illuminate\Support\Facades\Mail;
use App\Mail\StudentFailClass;
use App\Mail\WeeklyReport;
use App\Models\Student;

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
        . . .
        $schedule
            ->call(function () {
                Mail::to("<your_email>")->send(
                    new WeeklyReport(Student::all())
                );
            })
            ->weekly();
    }

    . . .
}