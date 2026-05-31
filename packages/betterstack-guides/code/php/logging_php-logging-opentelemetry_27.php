# Source: https://betterstack.com/community/guides/logging/php-logging-opentelemetry/
# Original language: php
# Normalized: php
# Block index: 27

[label ./producer/src/Event/Event.php]
<?php

namespace Demo\Project\Event;

use Faker\Generator;

abstract class Event
{
. . .
    public function toArray(): array
    {
        return [
            'id' => $this->id,
[highlight]
            'type' => $this->name,
[/highlight]
            'context' => $this->getContext(),
        ];
    }
. . .
}