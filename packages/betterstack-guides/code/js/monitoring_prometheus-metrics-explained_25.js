# Source: https://betterstack.com/community/guides/monitoring/prometheus-metrics-explained/
# Original language: javascript
# Normalized: js
# Block index: 25

const apiRequestDurationSummary = new promClient.Summary({
	name: "api_request_duration_seconds",
	help: "Summary of API request durations in seconds",
[highlight]
    percentiles: [0.01, 0.1, 0.9, 0.99],
[/highlight]
	labelNames: ["url"],
});