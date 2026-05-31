# Source: https://betterstack.com/community/guides/observability/opentelemetry-best-practices/
# Original language: javascript
# Normalized: js
# Block index: 2

const { context, propagation, baggage } = require('@opentelemetry/api');

function enrichContextWithCustomerId(customerId) {
  // Create baggage with customer ID
  const customerBaggage = baggage.setBaggage(baggage.createBaggage(), 'customer.id', customerId);

  // Set as current context
  return context.with(propagation.setBaggage(context.active(), customerBaggage), () => {
    // Make downstream service call - the context will be propagated
    return callDownstreamService();
  });
}