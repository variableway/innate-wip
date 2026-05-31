# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-monolog/
# Original language: php
# Normalized: php
# Block index: 13

$output = "%level_name% | %datetime% > %message% | %context% %extra%\n";
$dateFormat = "Y-n-j, g:i a";

$formatter = new LineFormatter(
    $output, // Format of message in log
    $dateFormat, // Datetime format
    true, // allowInlineLineBreaks option, default false
    true  // discard empty Square brackets in the end, default false
);