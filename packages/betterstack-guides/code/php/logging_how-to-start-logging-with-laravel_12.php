# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-laravel/
# Original language: php
# Normalized: php
# Block index: 12

use Illuminate\Support\Facades\Log;

Log::debug("This is a debug message.");
Log::info("This is an info level message.");
Log::notice("This is a notice level message.");
Log::warning("This is a warning level message.");
Log::error("This is an error level message.");
Log::critical("This is a critical level message.");
Log::alert("This is an alert level message.");
Log::emergency("This is an emergency level message.");