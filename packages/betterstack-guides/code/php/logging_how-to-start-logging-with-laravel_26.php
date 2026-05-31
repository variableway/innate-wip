# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-laravel/
# Original language: php
# Normalized: php
# Block index: 26

[label config/logging.php]
. . .
"info" => [
    "driver" => "single",
    "tap" => [App\Logging\CustomizeFormatter::class],
    "path" => storage_path("logs/daily.log"),
    "level" => "info",
],
. . .