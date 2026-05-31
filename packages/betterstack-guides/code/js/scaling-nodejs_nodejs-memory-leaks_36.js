# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-memory-leaks/
# Original language: javascript
# Normalized: js
# Block index: 36

[label /etc/prometheus/prometheus.yml]
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    scrape_interval: 5s
    static_configs:
      - targets: ['localhost:9090']
[highlight]
  - job_name: 'memoryleak_demo'
    scrape_interval: 5s
    static_configs:
      - targets: ['localhost:3000']
[/highlight]