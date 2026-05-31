# Source: https://betterstack.com/community/guides/observability/opentelemetry-prometheus-backend/
# Original language: command
# Normalized: sh
# Block index: 15

prometheus --web.enable-otlp-receiver --feature-flag=otlp-deltatocumulative