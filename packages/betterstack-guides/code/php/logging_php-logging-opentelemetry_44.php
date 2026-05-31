# Source: https://betterstack.com/community/guides/logging/php-logging-opentelemetry/
# Original language: php
# Normalized: php
# Block index: 44

[label ./notification-engine/src/Application.php]
. . .
class Application
{
. . .
    private function processMessage(array $message, int $startTime): void
    {
        $event = json_decode($message['Body'], true);
        $this->logger->info('processing message from SQS queue', ['event' => $event]);

        // retrieve template from CMS
        $url = sprintf('%s/api/v1/templates/%s', getenv('CMS_API_URL'), Str::kebab($event['name']));
        $response = $this->httpClient->sendRequest(
[highlight]
            $request = $this->httpFactory->createRequest('GET', $url)
[/highlight]
        );

[highlight]
        // log CMS service response errors.
        $statusCode = $response->getStatusCode();
        if ($statusCode !== 200) {
            $message = sprintf('Received %d response from CMS service', $statusCode);
            $this->logger->error($message, [
                'method' => $request->getMethod(),
                'url' => $request->getUri(),
            ]);
            return;
        }
[/highlight]
. . .
    }
}