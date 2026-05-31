# Source: https://betterstack.com/community/guides/logging/php-logging-opentelemetry/
# Original language: php
# Normalized: php
# Block index: 34

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
. . .
            } catch (Throwable $e) {
[highlight]
                $this->logger->alert('terminating notification engine', ['exception' => $e]);
[/highlight]
                exit(1);
            }
        }
    }
. . .
}