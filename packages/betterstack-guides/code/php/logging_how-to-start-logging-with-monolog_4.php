# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-monolog/
# Original language: php
# Normalized: php
# Block index: 4

[label index.php]
<?php
. . .

$logger = new Logger("daily");

$stream_handler = new StreamHandler("php://stdout");
$logger->pushHandler($stream_handler);

$logger->debug("This file has been executed.");
?>