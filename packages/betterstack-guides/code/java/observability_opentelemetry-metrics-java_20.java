# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics-java/
# Original language: java
# Normalized: java
# Block index: 20

package com.example.demo.service;

import io.opentelemetry.api.common.Attributes;
import io.opentelemetry.api.metrics.DoubleHistogram;
import io.opentelemetry.api.metrics.Meter;
import io.opentelemetry.api.metrics.MeterProvider;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class ExternalApiService {
   private final DoubleHistogram apiLatencyHistogram;
   private final RestTemplate restTemplate;

   public ExternalApiService(MeterProvider meterProvider) {
       Meter meter = meterProvider.get("com.example.demo");

       this.apiLatencyHistogram = meter.histogramBuilder("external_api.request.duration")
               .setDescription("External API request duration in seconds")
               .setUnit("s")
               .build();

       this.restTemplate = new RestTemplate();
   }

   public Object fetchPosts() {
       long startTime = System.nanoTime();
       try {
           return restTemplate.getForObject(
               "https://jsonplaceholder.typicode.com/posts",
               Object.class
           );
       } finally {
           long duration = System.nanoTime() - startTime;
           apiLatencyHistogram.record(
               duration / 1_000_000_000.0,  // Convert to seconds
               Attributes.builder()
                   .put("api", "jsonplaceholder")
                   .put("endpoint", "/posts")
                   .build()
           );
       }
   }
}