# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics-java/
# Original language: java
# Normalized: java
# Block index: 19

public void incrementRequestCounter(Attributes attributes) {
    requestCounter.add(1, attributes);
}

public void incrementActiveRequests(Attributes attributes) {
    activeRequestsGauge.add(1, attributes);
}

public void decrementActiveRequests(Attributes attributes) {
    activeRequestsGauge.add(-1, attributes);
}

public void recordRequestDuration(double durationSeconds, Attributes attributes) {
    requestDurationHistogram.record(durationSeconds, attributes);
}