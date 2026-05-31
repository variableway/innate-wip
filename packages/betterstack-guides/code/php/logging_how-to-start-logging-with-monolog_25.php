# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-monolog/
# Original language: php
# Normalized: php
# Block index: 25

[label index.php]
<?php

. . .
[highlight]
use Monolog\Handler\RotatingFileHandler;
[/highlight]


[highlight]
$rotating_handler = new RotatingFileHandler(__DIR__ . "/log/debug.log", 30, Level::Debug);
$logger->pushHandler($rotating_handler);
[/highlight]

$logger->info("This file has been executed.");
?>