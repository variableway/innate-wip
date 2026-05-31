# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-php/
# Original language: php
# Normalized: php
# Block index: 39

[label logging.php]
<?php

require __DIR__ . "/vendor/autoload.php";

use Monolog\Level;
use Monolog\Logger;
use Monolog\Handler\StreamHandler;
use Monolog\Formatter\JsonFormatter;

$logger = new Logger("daily");

$stream_handler = new StreamHandler("php://stdout", Level::Debug);
$logger->pushHandler($stream_handler);
[highlight]
$stream_handler->setFormatter(new JsonFormatter());
[/highlight]

$logger->debug("This is a debug message.");