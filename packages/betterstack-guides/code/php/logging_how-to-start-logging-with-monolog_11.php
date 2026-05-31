# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-monolog/
# Original language: php
# Normalized: php
# Block index: 11

[label index.php]
<?php

require __DIR__ . "/vendor/autoload.php";

. . .
[highlight]
use Monolog\Formatter\LineFormatter;
[/highlight]

$logger = new Logger("my_logger");

$stream_handler = new StreamHandler("php://stdout", Level::Debug);
[highlight]
$output = "%level_name% | %datetime% > %message% | %context% %extra%\n";
$stream_handler->setFormatter(new LineFormatter($output));
[/highlight]

$logger->pushHandler($stream_handler);

$logger->debug("This file has been executed")
?>