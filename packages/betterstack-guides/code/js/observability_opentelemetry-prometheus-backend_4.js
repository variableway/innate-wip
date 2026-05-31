# Source: https://betterstack.com/community/guides/observability/opentelemetry-prometheus-backend/
# Original language: javascript
# Normalized: js
# Block index: 4

[label app.js]
import "dotenv/config";
import "./otel.js";
import { metrics } from "@opentelemetry/api";
import express from "express";
import { v4 as uuidv4 } from "uuid";

const app = express();
const PORT = 3000;

const meter = metrics.getMeter(process.env.OTEL_SERVICE_NAME);

// Create instruments
const itemsProcessedCounter = meter.createCounter("inventory.items.processed", {
	description: "Number of inventory items processed",
});

const processingDurationHistogram = meter.createHistogram(
	"inventory.processing.duration",
	{
		description: "Duration of inventory processing operations",
		unit: "ms",
	},
);

const inventoryLevelGauge = meter.createUpDownCounter("inventory.level", {
	description: "Current inventory level",
});

app.get("/process/:count", (req, res) => {
	const count = Number.parseInt(req.params.count, 10);
	const startTime = Date.now();

	// Simulate processing
	setTimeout(() => {
		// Record metrics
		itemsProcessedCounter.add(count);
		processingDurationHistogram.record(Date.now() - startTime);
		inventoryLevelGauge.add(-count);

		res.json({ processed: count });
	}, Math.random() * 500);
});

app.get("/restock/:count", (req, res) => {
	const count = Number.parseInt(req.params.count, 10);
	inventoryLevelGauge.add(count);
	res.json({ restocked: count });
});

app.listen(PORT, () => {
	console.log(`Inventory service running on port ${PORT}`);
});