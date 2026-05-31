# Source: https://betterstack.com/community/guides/monitoring/prometheus-metrics-explained/
# Original language: javascript
# Normalized: js
# Block index: 17

const httpRequestDurationHistogram = new promClient.Histogram({
    name: "http_request_duration_seconds",
    help: "Histogram of HTTP request durations in seconds",
});

app.use((req, res, next) => {
    const start = performance.now(); // Start high-resolution timer

    res.on("finish", () => {
        const elapsedTime = (performance.now() - start) / 1000; // Calculate elapsed time
[highlight]
        httpRequestDurationHistogram.observe(elapsedTime);
[/highlight]
    });

    next();
});