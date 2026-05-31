# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-monolog/
# Original language: php
# Normalized: php
# Block index: 23

[label index.php]
<?php
. . .
$stream_handler = new StreamHandler(__DIR__ . "/log/debug.log", Level::Debug);
. . .
?>