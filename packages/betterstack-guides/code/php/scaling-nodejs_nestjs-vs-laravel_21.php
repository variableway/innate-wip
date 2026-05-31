# Source: https://betterstack.com/community/guides/scaling-nodejs/nestjs-vs-laravel/
# Original language: php
# Normalized: php
# Block index: 21

// app/Console/Kernel.php
protected function schedule(Schedule $schedule)
{
    // Send newsletter every Monday at 9 AM
    $schedule->job(new SendWeeklyNewsletter)->weeklyOn(1, '9:00');
    
    // Clean up old logs daily
    $schedule->call(function () {
        Log::info('Cleaning up old log files');
        Storage::delete(Storage::files('logs'));
    })->daily();
    
    // Process failed jobs every hour
    $schedule->command('queue:retry all')->hourly();
    
    // Database cleanup with conditional execution
    $schedule->call(function () {
        User::whereNull('email_verified_at')
            ->where('created_at', '<', now()->subDays(7))
            ->delete();
    })->daily()->when(function () {
        return config('app.env') === 'production';
    });
}