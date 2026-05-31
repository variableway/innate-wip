# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-laravel/
# Original language: php
# Normalized: php
# Block index: 4

"channels" => [
    "single" => [
        "driver" => "single",
        "path" => storage_path("logs/laravel.log"),
        [highlight]
        "level" => env("LOG_LEVEL", "debug"),
        [/highlight]
    ],
]