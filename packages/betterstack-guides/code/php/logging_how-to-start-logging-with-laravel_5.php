# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-laravel/
# Original language: php
# Normalized: php
# Block index: 5

[label config/logging.php]
. . .
"daily" => [
    "driver" => "daily",
    "path" => storage_path("logs/laravel.log"),
    "level" => env("LOG_LEVEL", "debug"),
    "days" => 14,
],
. . .