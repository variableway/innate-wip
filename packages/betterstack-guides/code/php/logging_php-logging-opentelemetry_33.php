# Source: https://betterstack.com/community/guides/logging/php-logging-opentelemetry/
# Original language: php
# Normalized: php
# Block index: 33

[label ./notification-engine/src/Application.php]
. . .
class Application
{
. . .
    public function run()
    {
        $this->logger->info('running notification engine');
        while (true) {
            try {
                $this->processQueue();
            } catch (Throwable $e) {
[highlight]
                error_log($e->getMessage());
                exit(1);
[/highlight]
            }
        }
    }
. . .
}