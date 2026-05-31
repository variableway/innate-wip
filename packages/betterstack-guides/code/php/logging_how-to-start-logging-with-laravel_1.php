# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-laravel/
# Original language: php
# Normalized: php
# Block index: 1

[label config/logging.php]
<?php

use Monolog\Handler\NullHandler;
use Monolog\Handler\StreamHandler;
use Monolog\Handler\SyslogUdpHandler;

return [
    "default" => env("LOG_CHANNEL", "stack"),

    "deprecations" => [
        "channel" => env("LOG_DEPRECATIONS_CHANNEL", "null"),
        "trace" => false,
    ],

    "channels" => [
        "stack" => [
            "driver" => "stack",
            "channels" => ["single", "daily"],
            "ignore_exceptions" => false,
        ],
        "single" => [
            "driver" => "single",
            "path" => storage_path("logs/laravel.log"),
            "level" => env("LOG_LEVEL", "debug"),
        ],
        "daily" => [
            "driver" => "daily",
            "path" => storage_path("logs/laravel.log"),
            "level" => env("LOG_LEVEL", "debug"),
            "days" => 14,
        ],

        . . .
    ],
];