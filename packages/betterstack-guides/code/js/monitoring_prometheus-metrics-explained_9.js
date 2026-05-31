# Source: https://betterstack.com/community/guides/monitoring/prometheus-metrics-explained/
# Original language: javascript
# Normalized: js
# Block index: 9

[label server.js]
import express from "express";
import promClient from "prom-client";

const app = express();
const PORT = 3000;

const register = new promClient.Registry();

// Create a gauge to track memory usage
const memoryUsageGauge = new promClient.Gauge({
  name: 'node_memory_usage_bytes',
  help: 'Memory usage of the Node.js process in bytes',
  labelNames: ['type'],
});

// Register the gauge with the Prometheus registry
register.registerMetric(memoryUsageGauge);

// Function to update the memory usage gauge
const updateMemoryMetrics = () => {
  const memoryUsage = process.memoryUsage();
[highlight]
  memoryUsageGauge.set({ type: 'rss' }, memoryUsage.rss); // Resident Set Size
  memoryUsageGauge.set({ type: 'heapTotal' }, memoryUsage.heapTotal); // Total heap size
  memoryUsageGauge.set({ type: 'heapUsed' }, memoryUsage.heapUsed); // Used heap size
  memoryUsageGauge.set({ type: 'external' }, memoryUsage.external); // External memory
[/highlight]
};

// Update memory metrics every 5 seconds
setInterval(updateMemoryMetrics, 5000);