# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics-java/
# Original language: java
# Normalized: java
# Block index: 17

@Component
public class MetricsFilter extends OncePerRequestFilter {
    private final MetricsService metricsService;

    public MetricsFilter(MetricsService metricsService) {
        this.metricsService = metricsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                  HttpServletResponse response,
                                  FilterChain filterChain) throws ServletException, IOException {
        metricsService.incrementRequestCounter();
        metricsService.incrementActiveRequests();

        long startTime = System.nanoTime();  // High-precision timestamp before request
        try {
            filterChain.doFilter(request, response);
        } finally {
            long duration = System.nanoTime() - startTime;
            // Convert nanoseconds to seconds with floating-point precision
            metricsService.recordRequestDuration(duration / 1_000_000_000.0);
            metricsService.decrementActiveRequests();
        }
    }
}