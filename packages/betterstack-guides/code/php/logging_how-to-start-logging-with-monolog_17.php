# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-monolog/
# Original language: php
# Normalized: php
# Block index: 17

[label index.php]
<?php
. . .
$logger = new Logger("my_logger");

[highlight]
$logger->pushProcessor(new \Monolog\Processor\ProcessIdProcessor());
$logger->pushProcessor(new \Monolog\Processor\GitProcessor());
$logger->pushProcessor(new \Monolog\Processor\MemoryUsageProcessor());
[/highlight]
. . .
?>