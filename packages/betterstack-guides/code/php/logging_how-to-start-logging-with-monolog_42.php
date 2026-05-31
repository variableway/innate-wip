# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-monolog/
# Original language: php
# Normalized: php
# Block index: 42

function exception_handler(Throwable $e)
{
    $logger = new Logger('uncaught');
    $stream_handler = new StreamHandler(__DIR__ . "/log/uncaught.log", Level::Debug);
    $stream_handler->setFormatter(new JsonFormatter());
    $logger->pushHandler($stream_handler);
    $logger->error("Uncaught exception", array('exception' => $e));
    [highlight]
    exit(1)
    [/highlight]
}