# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-laravel/
# Original language: php
# Normalized: php
# Block index: 9

[label config/logging.php]
. . .
"example-custom-channel" => [
    "driver" => "custom",
    "via" => App\Logging\CreateCustomLogger::class,
],