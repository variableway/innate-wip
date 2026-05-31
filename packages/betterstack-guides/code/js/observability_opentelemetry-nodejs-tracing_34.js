# Source: https://betterstack.com/community/guides/observability/opentelemetry-nodejs-tracing/
# Original language: javascript
# Normalized: js
# Block index: 34

[label converter/controllers/convert.controller.js]
[highlight]
import process from "node:process";
import { trace } from "@opentelemetry/api";
[/highlight]
import { stringify } from "yaml";

[highlight]
const tracer = trace.getTracer(process.env.OTEL_SERVICE_NAME);
[/highlight]

function convertToYAML(req, reply) {
	let body;

	try {
[highlight]
		const span = tracer.startSpan("parse json");
[/highlight]
		body = JSON.parse(req.body.json);
[highlight]
		span.end();
[/highlight]
	} catch (err) {
		req.log.error(err, "Parsing JSON body failed");

		return reply.status(400).send("Invalid JSON input");
	}

[highlight]
	const span = tracer.startSpan("convert json to yaml");
[/highlight]
	const yaml = stringify(body);
[highlight]
	span.end();
[/highlight]

	reply.send(yaml);
}

export { convertToYAML };