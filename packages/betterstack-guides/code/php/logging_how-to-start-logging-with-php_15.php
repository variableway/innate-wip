# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-php/
# Original language: php
# Normalized: php
# Block index: 15

[label logging.php]
<?php
. . .
ini_set("error_log", "my-errors.log");
error_log("database not available!");
?>