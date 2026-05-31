# Source: https://betterstack.com/community/guides/logging/php-logging-opentelemetry/
# Original language: php
# Normalized: php
# Block index: 50

[label ./notification-engine/src/Application.php]
<?php
. . .
class Application
{
. . .
    public function run()
    {
[highlight]
        $this->logger->info('running notification engine');
[/highlight]
        while (true) {
            try {
                $this->processQueue();
            } catch (Throwable $e) {
[highlight]
                $this->logger->alert('terminating notification engine', ['exception' => $e]);
[/highlight]
                exit(1);
            }
        }
    }
    }
. . .
}