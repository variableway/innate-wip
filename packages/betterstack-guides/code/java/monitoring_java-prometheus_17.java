# Source: https://betterstack.com/community/guides/monitoring/java-prometheus/
# Original language: java
# Normalized: java
# Block index: 17

@GetMapping("/")
public String hello() throws InterruptedException {
   Thread.sleep(ThreadLocalRandom.current().nextInt(1000, 5000));
   return "Hello world!";
}