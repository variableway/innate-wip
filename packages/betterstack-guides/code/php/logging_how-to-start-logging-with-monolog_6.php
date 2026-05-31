# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-monolog/
# Original language: php
# Normalized: php
# Block index: 6

[label index.php]
<?php

. . .

$logger->debug("This is a debug message.");
$logger->info("This is an info level message.");
$logger->notice("This is a notice level message.");
$logger->warning("This is a warning level message.");
$logger->error("This is an error level message.");
$logger->critical("This is a critical level message.");
$logger->alert("This is an alert level message.");
$logger->emergency("This is an emergency level message.");
?>