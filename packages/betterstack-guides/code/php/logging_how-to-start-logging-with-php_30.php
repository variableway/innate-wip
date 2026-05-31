# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-php/
# Original language: php
# Normalized: php
# Block index: 30

[label logging.php]
<?php

require __DIR__."/vendor/autoload.php"; // This tells PHP where to find the autoload file so that PHP can load the installed packages

use Monolog\Logger; // The Logger instance
use Monolog\Handler\StreamHandler; // The StreamHandler sends log messages to a file on your disk
use Monolog\Level; // Log levels
?>