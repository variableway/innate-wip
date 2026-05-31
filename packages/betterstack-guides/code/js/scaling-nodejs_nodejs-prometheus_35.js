# Source: https://betterstack.com/community/guides/scaling-nodejs/nodejs-prometheus/
# Original language: javascript
# Normalized: js
# Block index: 35

[label index.js]
[highlight]
import { register, Counter, Gauge, Histogram } from "prom-client";
import { performance } from "perf_hooks";
[/highlight]
const fastify = Fastify({ logger: true });

// Prometheus metrics
...

[highlight]
const dbQueryDurationHistogram = new Histogram({
  name: "db_query_duration_seconds",
  help: "Histogram of database query durations in seconds",
  labelNames: ["method", "route"],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.075, 0.1],
});
[/highlight]

// Define a route for '/'
fastify.get("/", async (request, reply) => {
  requestCounter.labels(request.method, request.routerPath).inc();
[highlight]
  const dbQueryStart = performance.now();
[/highlight]
  const rows = await new Promise((resolve, reject) => {
    db.all("SELECT title, release_date, tagline FROM movies", (err, rows) => {
      if (err) {
        console.error(err.message);
        reject(err);
 }
      resolve(rows);
 });
 });

[highlight]
  const dbQueryDuration = (performance.now() - dbQueryStart) / 1000;
  dbQueryDurationHistogram
 .labels(request.method, request.routerPath)
 .observe(dbQueryDuration);
[/highlight]
  return rows.splice(0, 8);
});