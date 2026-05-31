# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-laravel/
# Original language: php
# Normalized: php
# Block index: 15

. . .

"channels" => [
    "stack" => [
        "driver" => "stack",
        "channels" => ["debug", "info", "warning", "critical", "emergency"],
        "ignore_exceptions" => false,
    ],

    "debug" => [
        'driver'  => 'monolog',
        'handler' => Monolog\Handler\FilterHandler::class,
        'with' => [
            'handler' => new Monolog\Handler\RotatingFileHandler(storage_path('logs/debug.log'), 15),
            'minLevelOrList' => [Monolog\Logger::DEBUG],
        ],
    ],

    "info" => [
        'driver'  => 'monolog',
        'handler' => Monolog\Handler\FilterHandler::class,
        'with' => [
            'handler' => new Monolog\Handler\RotatingFileHandler(storage_path('logs/info.log'), 15),
            'minLevelOrList' => [Monolog\Logger::INFO],
        ],
    ],

    "warning" => [
        'driver'  => 'monolog',
        'handler' => Monolog\Handler\FilterHandler::class,
        'with' => [
            'handler' => new Monolog\Handler\RotatingFileHandler(storage_path('logs/warning.log'), 15),
            'minLevelOrList' => [Monolog\Logger::NOTICE, Monolog\Logger::WARNING],
        ],
    ],

    "critical" => [
        'driver'  => 'monolog',
        'handler' => Monolog\Handler\FilterHandler::class,
        'with' => [
            'handler' => new Monolog\Handler\RotatingFileHandler(storage_path('logs/critical.log'), 15),
            'minLevelOrList' => [Monolog\Logger::ERROR, Monolog\Logger::CRITICAL],
        ],
    ],

    "emergency" => [
        'driver'  => 'monolog',
        'handler' => Monolog\Handler\FilterHandler::class,
        'with' => [
            'handler' => new Monolog\Handler\TelegramBotHandler($apiKey = "<telegram_bot_api>", $channel = "@<channel_name>"),
            'minLevelOrList' => [Monolog\Logger::ALERT, Monolog\Logger::EMERGENCY],
        ],
    ],
],