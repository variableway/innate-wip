# Source: https://betterstack.com/community/guides/logging/php-logging-opentelemetry/
# Original language: php
# Normalized: php
# Block index: 54

[label ./notification-engine/index.php]
. . .
$handler = new \OpenTelemetry\Contrib\Logs\Monolog\Handler(
    \OpenTelemetry\API\Globals::loggerProvider(),
    \Monolog\Level::Info,
);
$logger = new \Monolog\Logger('notification-engine', [$handler]);
[highlight]
\Demo\Project\Instrumentation\Logging::register($logger);
[/highlight]
. . .