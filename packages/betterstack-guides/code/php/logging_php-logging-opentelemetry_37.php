# Source: https://betterstack.com/community/guides/logging/php-logging-opentelemetry/
# Original language: php
# Normalized: php
# Block index: 37

[label ./notification-engine/src/Application.php]
. . .
class Application
{
. . .
    private function processMessage(array $message, int $startTime): void
    {
[highlight]
        // decode raw message body to JSON
        $event = json_decode($message['Body'], true);
        $this->logger->info('processing message from SQS queue', ['event' => $event]);
[/highlight]

        // retrieve template from CMS
        $url = sprintf('%s/api/v1/templates/%s', getenv('CMS_API_URL'), Str::kebab($event['name']));
        $response = $this->httpClient->sendRequest(
            $this->httpFactory->createRequest('GET', $url)
        );
. . .
    }