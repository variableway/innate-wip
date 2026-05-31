# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-php/
# Original language: php
# Normalized: php
# Block index: 31

[label logging.php]
<?php
. . .
// New Logger instance. Create a new channel called "my_logger".
$logger = new Logger("my_logger");

// Create a new handler. In this case, it is the StreamHandler, which will send the log messages to the console.
$stream_handler = new StreamHandler("php://stdout", Level::Debug);

// Push the handler to the log channel
$logger->pushHandler($stream_handler);

// Log the message
$logger->debug("This is a debug message.");
$logger->info("This is an info message.");
$logger->error("This is an error message.");
$logger->critical("This is a critical message.");
?>