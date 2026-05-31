# Source: https://betterstack.com/community/guides/monitoring/java-prometheus/
# Original language: java
# Normalized: java
# Block index: 20

@Configuration
public class MetricsConfig {
   // Previous beans...

   @Bean
   public void memoryMetrics(MeterRegistry registry) {
       Gauge.builder("jvm.memory.used", Runtime.getRuntime(),
           runtime -> runtime.totalMemory() - runtime.freeMemory())
           .description("JVM memory currently used")
           .baseUnit("bytes")
           .register(registry);
   }
}