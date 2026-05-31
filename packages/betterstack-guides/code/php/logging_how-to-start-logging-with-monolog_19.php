# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-monolog/
# Original language: php
# Normalized: php
# Block index: 19

[label index.php]
<?php
. . .
$user = readline('Please enter your name: ');

$logger = new Logger("my_logger");
[highlight]
$logger->pushProcessor(function ($record) use ($user) {
    $record->extra["user"] = $user;

    return $record;
});
[/highlight]
$stream_handler = new StreamHandler("php://stdout", Level::Debug)
$logger->pushHandler($stream_handler);

$logger->info("This file has been executed.");
?>