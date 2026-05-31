# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-laravel/
# Original language: php
# Normalized: php
# Block index: 14

[label config/logging.php]
. . .

"channels" => [
    "stack" => [
        "driver" => "stack",
        "channels" => [
            "daily",
            "important",
            "urgent",
        ],
        "ignore_exceptions" => false,
    ],

    "daily" => [
        "driver" => "daily",
        "path" => storage_path("logs/daily.log"),
        "level" => "info",
    ],

    "important" => [
        "driver" => "daily",
        "level" => "warning",
        "path" => storage_path("logs/important.log"),
    ],

    "urgent" => [
        "driver" => "daily",
        "path" => storage_path("logs/urgent.log"),
        "level" => "critical",
    ],
],