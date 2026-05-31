# Source: https://betterstack.com/community/guides/logging/how-to-start-logging-with-laravel/
# Original language: php
# Normalized: php
# Block index: 28

[label app/Logging/CustomizeFormatter.php]

<?php

namespace App\Logging;
[highlight]
use Monolog\Formatter\LineFormatter;
[/highlight]
class CustomizeFormatter
{
    /**
     * Customize the given logger instance.
     *
     * @param  \Illuminate\Log\Logger  $logger
     * @return void
     */
    public function __invoke($logger)
    {
        foreach ($logger->getHandlers() as $handler) {
            $handler->setFormatter(new LineFormatter(
                [highlight]
                '%level_name% | [%datetime%] | %message% | %context%'
                [/highlight]
            ));
        }
    }
}