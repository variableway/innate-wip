# Source: https://betterstack.com/community/guides/monitoring/sre-golden-signals/
# Original language: bash
# Normalized: sh
# Block index: 4

docker run -p 9090:9090 -v /path/to/prometheus.yml:/etc/prometheus/prometheus.yml prom/prometheus