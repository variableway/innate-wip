# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics-java/
# Original language: java
# Normalized: java
# Block index: 16

package com.example.demo.service;

import io.opentelemetry.api.common.Attributes;
import io.opentelemetry.api.metrics.LongCounter;
import io.opentelemetry.api.metrics.LongUpDownCounter;
import io.opentelemetry.api.metrics.Meter;
import io.opentelemetry.api.metrics.MeterProvider;
import io.opentelemetry.api.metrics.DoubleHistogram;
import org.springframework.stereotype.Service;

@Service
public class MetricsService {

    private final LongCounter requestCounter;
    private final LongUpDownCounter activeRequestsGauge;
    private final DoubleHistogram requestDurationHistogram;

    public MetricsService(MeterProvider meterProvider) {
        Meter meter = meterProvider.get("com.example.demo");

        // Create a counter for HTTP requests
        this.requestCounter = meter.counterBuilder("http.requests.total")
                .setDescription("Total number of HTTP requests")
                .build();

        // Create a gauge for active requests
        this.activeRequestsGauge = meter.upDownCounterBuilder("http.requests.active")
                .setDescription("Number of active HTTP requests")
                .build();

        // Create a histogram for request durations
        this.requestDurationHistogram = meter.histogramBuilder("http.request.duration.seconds")
                .setDescription("HTTP request duration in seconds")
                .setUnit("s")  // Explicitly set the unit to seconds
                .build();
    }

    // Previous methods...

    public void recordRequestDuration(double durationSeconds) {
        requestDurationHistogram.record(durationSeconds, Attributes.builder().put("app", "demo").build());
    }
}