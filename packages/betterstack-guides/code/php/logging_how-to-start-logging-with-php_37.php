# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-php/
# Original language: php
# Normalized: php
# Block index: 37

[label logging.php]
<?php
. . .
[highlight]
$dateFormat = "Y-n-j, g:i a";
[/highlight]
$output = "%level_name% | %datetime% > %message% | %context% %extra%\n";
$stream_handler->setFormatter(new LineFormatter($output, $dateFormat));
. . .
?>