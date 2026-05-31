# Source: https://betterstack.com/community/guides/monitoring/prometheus-metrics-explained/
# Original language: javascript
# Normalized: js
# Block index: 20

const httpRequestDurationHistogram = new promClient.Histogram({
	name: "http_request_duration_seconds",
	help: "Histogram of HTTP request durations in seconds",
[highlight]
    buckets: [0.1, 0.5, 1, 2.5, 5, 10], // Define the bucket ranges
[/highlight]
});