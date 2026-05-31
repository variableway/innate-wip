# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-monolog/
# Original language: php
# Normalized: php
# Block index: 15

[label index.php]
<?php
. . .
// Ask for user input
$user = readline('Please enter your name: ');

$logger = new Logger("my_logger");
$stream_handler = new StreamHandler("php://stdout", Level::Debug)
$logger->pushHandler($stream_handler);

[highlight]
$logger->debug("This file has been executed.", ["user" => $user]);
[/highlight]
?>