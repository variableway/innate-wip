# Source: https://betterstack.com/community/guides/monitoring/prometheus-metrics-explained/
# Original language: javascript
# Normalized: js
# Block index: 8

[label server.js]
// 1. Create a gauge to track the current number of active connections
const activeConnectionsGauge = new promClient.Gauge({
    name: "http_active_connections",
    help: "Current number of active HTTP connections",
});

app.use((req, res, next) => {
    // Increment the gauge when a request starts
[highlight]
    activeConnectionsGauge.inc();
[/highlight]

    // Decrement the gauge when the request finishes
    res.on("finish", () => {
[highlight]
        activeConnectionsGauge.dec();
[/highlight]
    });
    next();
});