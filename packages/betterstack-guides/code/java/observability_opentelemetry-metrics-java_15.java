# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics-java/
# Original language: java
# Normalized: java
# Block index: 15

@GetMapping("/")
public String hello() throws InterruptedException {
   java.util.concurrent.ThreadLocalRandom random = java.util.concurrent.ThreadLocalRandom.current();
   Thread.sleep(random.nextInt(1000, 5000));  // Random delay between 1-5 seconds
   return "Hello world!";
}