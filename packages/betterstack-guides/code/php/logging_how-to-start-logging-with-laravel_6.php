# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-laravel/
# Original language: php
# Normalized: php
# Block index: 6

[label config/logging.php]
. . .
"syslog" => [
    "driver" => "syslog",
    "level" => env("LOG_LEVEL", "debug"),
],

"errorlog" => [
    "driver" => "errorlog",
    "level" => env("LOG_LEVEL", "debug"),
],
. . .