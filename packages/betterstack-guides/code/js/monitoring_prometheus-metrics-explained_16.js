# Source: https://betterstack.com/community/guides/monitoring/prometheus-metrics-explained/
# Original language: javascript
# Normalized: js
# Block index: 16

[label server.js]
// Create a histogram to track request durations
const httpRequestDurationHistogram = new promClient.Histogram({
    name: "http_request_duration_seconds",
    help: "Histogram of HTTP request durations in seconds",
});

app.use((req, res, next) => {
    const end = httpRequestDurationHistogram.startTimer(); // Start the timer

    res.on("finish", () => {
        end(); // Stop the timer and record the duration
    });

    next();
});