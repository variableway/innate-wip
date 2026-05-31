# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-php/
# Original language: php
# Normalized: php
# Block index: 33

[label logging.php]
<?php
. . .

$logger = new Logger("my_logger");

[highlight]
$stream_handler = new StreamHandler(__DIR__ . "/log/debug.log", Level::Debug);
[/highlight]

$logger->pushHandler($stream_handler);

$logger->debug("This is a debug message.");
?>