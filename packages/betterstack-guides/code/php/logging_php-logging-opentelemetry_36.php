# Source: https://betterstack.com/community/guides/logging/php-logging-opentelemetry/
# Original language: php
# Normalized: php
# Block index: 36

$url = sprintf('%s/api/v1/templates/%s', getenv('CMS_API_URL'), Str::kebab($event['name']));