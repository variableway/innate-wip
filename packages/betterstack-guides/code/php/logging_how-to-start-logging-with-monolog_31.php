# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-monolog/
# Original language: php
# Normalized: php
# Block index: 31

[label logging.php]
<?php

require __DIR__ . "/vendor/autoload.php";

use Monolog\Level;
use Monolog\Logger;
use Monolog\Handler\StreamHandler;
use Monolog\Formatter\JsonFormatter;

$logger = new Logger("exceptions");

$stream_handler = new StreamHandler(__DIR__ . "/log/exception.log", Level::Debug);
$stream_handler->setFormatter(new JsonFormatter());

$logger->pushHandler($stream_handler);

try {
    $username = readline("Choose your username: ");
    if (strlen($username) < 6) {
        throw new Exception("The username $username is too short.");
    }
} catch (exception $e) {
    $logger->error($e->getMessage());
}

?>