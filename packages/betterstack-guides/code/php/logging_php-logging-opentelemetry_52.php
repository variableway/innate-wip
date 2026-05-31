# Source: https://betterstack.com/community/guides/logging/php-logging-opentelemetry/
# Original language: php
# Normalized: php
# Block index: 52

hook(
    Application::class,
    'run',
    pre: static function (Application $app, array $params, string $class, string $function, ?string $filename, ?int $lineno) use ($logger) {
        $logger->info('running notification engine');
    },
);