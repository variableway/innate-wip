# Source: https://betterstack.com/community/guides/monitoring/java-prometheus/
# Original language: java
# Normalized: java
# Block index: 23

@Component
public class MetricsFilter extends OncePerRequestFilter {
   private final Counter requestCounter;
   private final AtomicInteger activeRequests;
   private final Timer requestLatencyHistogram;

   public MetricsFilter(Counter requestCounter,
                       AtomicInteger activeRequests,
                       Timer requestLatencyHistogram) {
       this.requestCounter = requestCounter;
       this.activeRequests = activeRequests;
       this.requestLatencyHistogram = requestLatencyHistogram;
   }

   @Override
   protected void doFilterInternal(HttpServletRequest request,
                                 HttpServletResponse response,
                                 FilterChain filterChain) throws ServletException, IOException {
       activeRequests.incrementAndGet();

       Timer.Sample sample = Timer.start();
       try {
           requestCounter.increment();
           filterChain.doFilter(request, response);
       } finally {
           sample.stop(requestLatencyHistogram);
           activeRequests.decrementAndGet();
       }
   }
}