# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-monolog/
# Original language: php
# Normalized: php
# Block index: 30

[label index.php]
<?php

[highlight]
require "./DBHandler.php";
[/highlight]

. . .

$db_handler = new DBHandler(new PDO('sqlite:debug.sqlite'));
$logger->pushHandler($db_handler);
$logger->debug("This file has been executed.");
?>