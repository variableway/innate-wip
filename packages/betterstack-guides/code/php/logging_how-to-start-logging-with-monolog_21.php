# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-monolog/
# Original language: php
# Normalized: php
# Block index: 21

[label index.php]
<?php

require __DIR__."/vendor/autoload.php"; // This tells PHP where to find the autoload file so that PHP can load the installed packages

use Monolog\Level; // The StreamHandler sends log messages to a file on your disk
[highlight]
use Monolog\Formatter\JsonFormatter;
[/highlight]
use Monolog\Logger; // The Logger instance
use Monolog\Handler\StreamHandler; // The StreamHandler sends log messages to a file on your disk

$user = readline('Please enter your name: ');

$logger = new Logger("my_logger");

$stream_handler = new StreamHandler("php://stdout", Level::Debug);

[highlight]
$formatter = new JsonFormatter();

$stream_handler->setFormatter($formatter);
[/highlight]

$logger->pushHandler($stream_handler);

$logger->info("This file has been executed.", ["user" => $user]);
?>