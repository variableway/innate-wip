# Source: https://betterstack.com/community/guides/observability/opentelemetry-best-practices/
# Original language: javascript
# Normalized: js
# Block index: 7

const winston = require('winston');
const { trace } = require('@opentelemetry/api');

// Configure your logger to include trace context
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format((info) => {
      const span = trace.getSpan(trace.context());
      if (span) {
        const context = span.spanContext();
        info.trace_id = context.traceId;
        info.span_id = context.spanId;
      }
      return info;
    })()
  ),
  transports: [
    new winston.transports.Console()
  ]
});

// Now your logs will include trace and span IDs
logger.info('Processing order', { orderId: '12345' });