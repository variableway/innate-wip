# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-laravel/
# Original language: php
# Normalized: php
# Block index: 7

[label config/logging.php]
. . .
    "channels" => [
        "stack" => [
            "driver" => "stack",
            [highlight]
            "channels" => ["one", "two", "three"],
            [/highlight]
            "ignore_exceptions" => false,
        ],
        "one" => [
            "driver" => "single",
            "path" => storage_path("logs/laravel_1.log"),
            "level" => "debug",
        ],
        "two" => [
            "driver" => "single",
            "path" => storage_path("logs/laravel_2.log"),
            "level" => "warning",
        ],
        "three" => [
            "driver" => "single",
            "path" => storage_path("logs/laravel_3.log"),
            "level" => "error",
        ],
    ],
. . .