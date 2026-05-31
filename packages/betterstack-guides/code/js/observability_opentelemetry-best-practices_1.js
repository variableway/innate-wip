# Source: https://betterstack.com/community/guides/observability/opentelemetry-best-practices/
# Original language: javascript
# Normalized: js
# Block index: 1

const { trace, SpanStatusCode } = require('@opentelemetry/api');

async function processOrder(orderId, customerId) {
  const tracer = trace.getTracer('my-service');

  // Create a span for the operation
  const span = tracer.startSpan('processOrder');

  // Add relevant attributes
  span.setAttribute('order.id', orderId);
  span.setAttribute('customer.id', customerId);

  try {
    // Set the current span as active for context propagation
    return await tracer.startActiveSpan('processOrder', async (activeSpan) => {
      // Your business logic here
      await processPayment(orderId);

      // Add events to mark important milestones
      activeSpan.addEvent('payment.processed');

      const result = await updateInventory(orderId);
      activeSpan.addEvent('inventory.updated');

      return result;
    });
  } catch (error) {
    // Record the error on the span
    span.setStatus({ code: SpanStatusCode.ERROR });
    span.recordException(error);
    throw error;
  } finally {
    // Always end the span
    span.end();
  }
}