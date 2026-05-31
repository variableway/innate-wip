# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-monolog/
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

function exception_handler(Throwable $e)
{
    $logger = new Logger('uncaught');
    $stream_handler = new StreamHandler(__DIR__ . "/log/uncaught.log", Level::Debug);
    $stream_handler->setFormatter(new JsonFormatter());
    $logger->pushHandler($stream_handler);
    $logger->error("Uncaught exception", array('exception' => $e));
}

set_exception_handler("exception_handler");

class emptyClass
{
    // This class is empty
};

// Try to access a property that does not exist
emptyClass::one();
?>