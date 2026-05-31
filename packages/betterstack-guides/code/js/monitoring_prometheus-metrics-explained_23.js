# Source: https://betterstack.com/community/guides/monitoring/prometheus-metrics-explained/
# Original language: javascript
# Normalized: js
# Block index: 23

[label server.js]
const apiRequestDurationSummary = new promClient.Summary({
	name: "api_request_duration_seconds",
	help: "Summary of API request durations in seconds",
	labelNames: ["url"],
});

const observer = new PerformanceObserver((list) => {
	for (const entry of list.getEntries()) {
		if (entry.initiatorType === "fetch") {
[highlight]
			apiRequestDurationSummary
				.labels(entry.name)
				.observe(entry.duration / 1000);
[/highlight]
		}
	}

	performance.clearResourceTimings();
});

observer.observe({ entryTypes: ["resource"] });