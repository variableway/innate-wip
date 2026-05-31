# Source: https://betterstack.com/community/guides/logging/php-logging-opentelemetry/
# Original language: php
# Normalized: php
# Block index: 53

hook(
    Application::class,
    'processQueue',
    post: static function (Application $app, array $params, $returnValue, ?Throwable $exception) use ($logger) {
        if ($exception) {
            $logger->alert('terminating notification engine', ['exception' => $exception]);
        }
        return $returnValue;
    }
);