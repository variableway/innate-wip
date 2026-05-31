# Source: https://betterstack.com/community/guides/monitoring/java-prometheus/
# Original language: java
# Normalized: java
# Block index: 22

package com.example.demo.config;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.Gauge;
import io.micrometer.core.instrument.Histogram;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.concurrent.atomic.AtomicInteger;

@Configuration
public class MetricsConfig {
   // Previous counter and gauge beans...

   @Bean
   public Timer requestLatencyHistogram(MeterRegistry registry) {
       return Timer.builder("http.request.duration.seconds")
               .description("HTTP request duration in seconds")
               .tags("app", "demo")
               .publishPercentiles(0.5, 0.95, 0.99)
               .register(registry);
   }
}