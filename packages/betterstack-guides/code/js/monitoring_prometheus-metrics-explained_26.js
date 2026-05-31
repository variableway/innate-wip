# Source: https://betterstack.com/community/guides/monitoring/prometheus-metrics-explained/
# Original language: javascript
# Normalized: js
# Block index: 26

const apiRequestDurationSummary = new promClient.Summary({
	name: "api_request_duration_seconds",
	help: "Summary of API request durations in seconds",
	labelNames: ["url"],
[highlight]
    maxAgeSeconds: 600, // 10 minutes
    ageBuckets: 5,
[/highlight]
});