# Source: https://betterstack.com/community/guides/logging/php-logging-opentelemetry/
# Original language: php
# Normalized: php
# Block index: 51

[label ./notification-engine/src/Instrumentation/Logging.php]
<?php

namespace Demo\Project\Instrumentation;

use Demo\Project\Application;
use Psr\Log\LoggerInterface;
use Throwable;
use function OpenTelemetry\Instrumentation\hook;

class Logging
{
    public static function register(LoggerInterface $logger)
    {
        hook(
            Application::class,
            'run',
            pre: static function (Application $app, array $params, string $class, string $function, ?string $filename, ?int $lineno) use ($logger) {
                $logger->info('running notification engine');
            },
        );

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
    }
}