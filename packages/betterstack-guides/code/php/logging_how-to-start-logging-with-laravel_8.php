# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-laravel/
# Original language: php
# Normalized: php
# Block index: 8

[label config/logging.php]
<?php

use Monolog\Handler\StreamHandler

. . .
"monolog_handler" => [
    "driver"  => "monolog",
    [highlight]
    "handler" => Monolog\Handler\FilterHandler::class,
    "with" => [
        "handler" => new StreamHandler(storage_path("logs/info.log")),
        "minLevelOrList" => [Monolog\Logger::INFO],
    ],
    [/highlight]
],