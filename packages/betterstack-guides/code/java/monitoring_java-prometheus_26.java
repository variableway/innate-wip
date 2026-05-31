# Source: https://betterstack.com/community/guides/monitoring/java-prometheus/
# Original language: java
# Normalized: java
# Block index: 26

package com.example.demo.service;

import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Summary;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class ExternalApiService {
   private final Summary requestLatency;
   private final RestTemplate restTemplate;

   public ExternalApiService(MeterRegistry registry) {
       this.requestLatency = Summary.builder("external_api.request.duration")
               .description("External API request duration")
               .quantiles(0.5, 0.95, 0.99)  // Track 50th, 95th, and 99th percentiles
               .register(registry);

       this.restTemplate = new RestTemplate();
   }

   public Object fetchPosts() {
       long start = System.nanoTime();
       try {
           return restTemplate.getForObject(
               "https://jsonplaceholder.typicode.com/posts",
               Object.class
           );
       } finally {
           long duration = System.nanoTime() - start;
           requestLatency.record(duration / 1_000_000_000.0);  // Convert to seconds
       }
   }
}