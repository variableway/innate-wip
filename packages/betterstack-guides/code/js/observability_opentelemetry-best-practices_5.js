# Source: https://betterstack.com/community/guides/observability/opentelemetry-best-practices/
# Original language: javascript
# Normalized: js
# Block index: 5

const { ParentBasedSampler, TraceIdRatioBased } = require('@opentelemetry/sdk-trace-node');

// Create a sampler that keeps all error traces and samples 10% of normal traces
const errorAttributeSampler = {
  shouldSample(context, traceId, spanName, spanKind, attributes) {
    // Always sample if there's an error attribute
    if (attributes && attributes.error === true) {
      return {
        decision: SamplingDecision.RECORD_AND_SAMPLED
      };
    }
    // Delegate to the base sampler
    return { decision: SamplingDecision.NOT_RECORD };
  }
};

const compositeSampler = {
  shouldSample(context, traceId, spanName, spanKind, attributes) {
    // Try the error sampler first
    const errorSamplerResult = errorAttributeSampler.shouldSample(
      context, traceId, spanName, spanKind, attributes
    );

    if (errorSamplerResult.decision === SamplingDecision.RECORD_AND_SAMPLED) {
      return errorSamplerResult;
    }

    // Fall back to 10% sampling for normal traces
    return new TraceIdRatioBased(0.1).shouldSample(
      context, traceId, spanName, spanKind, attributes
    );
  }
};

// Use parent-based sampling to maintain trace consistency
const sampler = new ParentBasedSampler({
  root: compositeSampler
});