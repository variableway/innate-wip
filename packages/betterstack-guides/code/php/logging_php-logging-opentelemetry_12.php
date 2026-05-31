# Source: https://betterstack.com/community/guides/logging/php-logging-opentelemetry/
# Original language: php
# Normalized: php
# Block index: 12

[label ./notification-engine/src/Application.php]
. . .
class Application
{
. . .
    public function run()
    {
[highlight]
        $this->logger->info('running notification engine');
[/highlight]
. . .
    }
. . .
    private function processMessage(array $message, int $startTime): void
    {
[highlight]
        $this->logger->info('processing message from SQS queue');
[/highlight]
. . .
    }
}