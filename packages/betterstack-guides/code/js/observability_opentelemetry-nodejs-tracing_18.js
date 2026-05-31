# Source: https://betterstack.com/community/guides/observability/opentelemetry-nodejs-tracing/
# Original language: javascript
# Normalized: js
# Block index: 18

[output]
{
  resource: {
    attributes: {
    [highlight]
      'service.name': 'auth-service',
    [/highlight]
      . . .
    }
  },
  instrumentationScope: {
    name: '@opentelemetry/instrumentation-http',
    version: '0.56.0',
    schemaUrl: undefined
  },
  traceId: '99619981a891e027234e27acdbfcc2a0',
  parentId: undefined,
  traceState: undefined,
  name: 'GET',
  id: '0f9741d356468e14',
  kind: 1,
  timestamp: 1734027011683000,
  duration: 40781.088,
  attributes: {
    . . .
  },
  status: {
    code: 0
  },
  events: [],
  links: []
}