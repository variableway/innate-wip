# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-php/
# Original language: php
# Normalized: php
# Block index: 35

[label logging.php]
. . .
use Monolog\Level;
use Monolog\Logger;
use Monolog\Handler\StreamHandler;
[highlight]
use Monolog\Formatter\LineFormatter;
[/highlight]

$logger = new Logger("my_logger");

$stream_handler = new StreamHandler("php://stdout", Level::Debug);
[highlight]
$output = "%level_name% | %datetime% > %message% | %context% %extra%\n";
$stream_handler->setFormatter(new LineFormatter($output));
[/highlight]

$logger->pushHandler($stream_handler);

$logger->debug("This file has been executed.");
?>