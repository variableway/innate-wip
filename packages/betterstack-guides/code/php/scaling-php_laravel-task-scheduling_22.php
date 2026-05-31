# Source: https://betterstack.com/community/guides/scaling-php/laravel-task-scheduling/
# Original language: php
# Normalized: php
# Block index: 22

$schedule->job(new SomeQueuedJob, "myJob", "sqs")->hourly();