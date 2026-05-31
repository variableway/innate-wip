# Source: https://betterstack.com/community/guides/logging/php-logging-opentelemetry/
# Original language: command
# Normalized: sh
# Block index: 9

docker run -it --rm -u $(id -u):$(id -g) -v ./notification-engine:/app notification-engine:0.1.0 composer require open-telemetry/opentelemetry-logger-monolog