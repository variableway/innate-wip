# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics-java/
# Original language: java
# Normalized: java
# Block index: 10

package com.example.demo.service;

import io.opentelemetry.api.common.Attributes;
import io.opentelemetry.api.metrics.LongCounter;
import io.opentelemetry.api.metrics.Meter;
import io.opentelemetry.api.metrics.MeterProvider;
import org.springframework.stereotype.Service;

@Service
public class MetricsService {

    private final LongCounter requestCounter;

    public MetricsService(MeterProvider meterProvider) {
        Meter meter = meterProvider.get("com.example.demo");

        // Create a counter for HTTP requests
        this.requestCounter = meter.counterBuilder("http.requests.total")
                .setDescription("Total number of HTTP requests")
                .build();
    }

    public void incrementRequestCounter() {
        requestCounter.add(1, Attributes.builder().put("app", "demo").build());
    }
}