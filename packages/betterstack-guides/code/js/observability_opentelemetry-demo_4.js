# Source: https://betterstack.com/community/guides/observability/opentelemetry-demo/
# Original language: javascript
# Normalized: js
# Block index: 4

[label src/paymentservice/charge.js]
. . .
  // Check baggage for synthetic_request=true, and add charged attribute accordingly
[highlight]
  const baggage = propagation.getBaggage(context.active());
[/highlight]
  if (baggage && baggage.getEntry('synthetic_request') && baggage.getEntry('synthetic_request').value === 'true') {
    span.setAttribute('app.payment.charged', false);
  } else {
    span.setAttribute('app.payment.charged', true);
  }
. . .