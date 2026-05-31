# Source: https://betterstack.com/community/guides/monitoring/java-prometheus/
# Original language: java
# Normalized: java
# Block index: 15

package com.example.demo.config;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.Gauge;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.concurrent.atomic.AtomicInteger;

@Configuration
public class MetricsConfig {

   private final AtomicInteger activeRequests = new AtomicInteger(0);

   @Bean
   public Counter requestCounter(MeterRegistry registry) {
       return Counter.builder("http.requests.total")
               .description("Total number of HTTP requests")
               .tags("app", "demo")
               .register(registry);
   }

   @Bean
   public AtomicInteger gaugeActive(MeterRegistry registry) {
       return registry.gauge("http.requests.active",
               Tags.of("app", "demo"),
               new AtomicInteger(0));
   }
}