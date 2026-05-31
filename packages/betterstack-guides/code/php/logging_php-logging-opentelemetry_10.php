# Source: https://betterstack.com/community/guides/logging/php-logging-opentelemetry/
# Original language: php
# Normalized: php
# Block index: 10

[label ./notification-engine/index.php]
<?php

require __DIR__ . '/vendor/autoload.php';

\Demo\Project\Instrumentation\Tracing::register();

$sqsClient = new Aws\Sqs\SqsClient(['http' => ['connect_timeout' => 1]]);
$httpClient = new \GuzzleHttp\Client(['connect_timeout' => 1]);
$httpFactory = new \GuzzleHttp\Psr7\HttpFactory();

[highlight]
$handler = new \OpenTelemetry\Contrib\Logs\Monolog\Handler(
    \OpenTelemetry\API\Globals::loggerProvider(),
    \Monolog\Level::Info,
);
$logger = new \Monolog\Logger('notification-engine', [$handler]);
[/highlight]

$app = new Demo\Project\Application(
    $sqsClient,
    $httpClient,
    $httpFactory,
[highlight]
    $logger,
[/highlight]
);
$app->registerSmtpServer('mailgun');
$app->registerSmtpServer('postmark');

$app->run();