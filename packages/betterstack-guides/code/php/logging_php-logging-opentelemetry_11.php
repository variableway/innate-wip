# Source: https://betterstack.com/community/guides/logging/php-logging-opentelemetry/
# Original language: php
# Normalized: php
# Block index: 11

[label ./notification-engine/src/Application.php]
<?php

namespace Demo\Project;

use Aws\Sqs\SqsClient;
. . .
[highlight]
use Psr\Log\LoggerInterface;
[/highlight]
use Throwable;

class Application
{
    /** @var DemoSmtpMailer[] */
    private array $smtpServers;

    public function __construct(
        private readonly SqsClient $sqsClient,
        private readonly ClientInterface $httpClient,
        private readonly RequestFactoryInterface $httpFactory,
[highlight]
        private readonly LoggerInterface $logger,
[/highlight]
    ) {}
. . .