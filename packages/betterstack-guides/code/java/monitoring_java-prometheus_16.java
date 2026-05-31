# Source: https://betterstack.com/community/guides/monitoring/java-prometheus/
# Original language: java
# Normalized: java
# Block index: 16

@Component
public class MetricsFilter extends OncePerRequestFilter {
   private final Counter requestCounter;
   private final AtomicInteger activeRequests;

   public MetricsFilter(Counter requestCounter, AtomicInteger activeRequests) {
       this.requestCounter = requestCounter;
       this.activeRequests = activeRequests;
   }

   @Override
   protected void doFilterInternal(HttpServletRequest request,
                                 HttpServletResponse response,
                                 FilterChain filterChain) throws ServletException, IOException {
       activeRequests.incrementAndGet();  // Increment at start of request
       try {
           requestCounter.increment();
           filterChain.doFilter(request, response);
       } finally {
           activeRequests.decrementAndGet();  // Decrement after request completes
       }
   }
}