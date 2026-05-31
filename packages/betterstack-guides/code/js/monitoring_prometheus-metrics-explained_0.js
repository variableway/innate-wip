# Source: https://betterstack.com/community/guides/monitoring/prometheus-metrics-explained/
# Original language: javascript
# Normalized: js
# Block index: 0

[label server.js]
import express from "express";
import promClient from "prom-client";

const app = express();

// 1. Create a counter to track the total number of HTTP requests
const httpRequestsCounter = new promClient.Counter({
	name: "http_requests_total",
	help: "Total number of HTTP requests received",
	labelNames: ["method", "route", "status"], // Labels add dimensions for querying the metric
});

// 2. Middleware to instrument HTTP requests
app.use((req, res, next) => {
	// Increment the counter for each request
	res.on("finish", () => {
		httpRequestsCounter
			.labels(req.method, req.route ? req.route.path : req.path, res.statusCode)
			.inc();
	});
	next();
});