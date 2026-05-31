# Source: https://betterstack.com/community/guides/observability/opentelemetry-sampling/
# Original language: bash
# Normalized: sh
# Block index: 1

[label .env]
export OTEL_TRACES_SAMPLER="traceidratio"
export OTEL_TRACES_SAMPLER_ARG="0.1"