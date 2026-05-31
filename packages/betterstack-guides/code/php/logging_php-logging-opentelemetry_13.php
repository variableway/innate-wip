# Source: https://betterstack.com/community/guides/logging/php-logging-opentelemetry/
# Original language: php
# Normalized: php
# Block index: 13

[label ./notification-engine/index.php]
. . .
$handler = new \OpenTelemetry\Contrib\Logs\Monolog\Handler(
[highlight]
    \OpenTelemetry\API\Globals::loggerProvider(),
[/highlight]
    \Monolog\Level::Info,
);
. . .