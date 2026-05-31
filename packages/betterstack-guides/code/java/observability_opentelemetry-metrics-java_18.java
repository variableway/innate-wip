# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics-java/
# Original language: java
# Normalized: java
# Block index: 18

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
        // Create attributes with endpoint and method information
        Attributes attributes = Attributes.builder()
                .put("app", "demo")
                .put("endpoint", request.getRequestURI())
                .put("method", request.getMethod())
                .build();

        metricsService.incrementRequestCounter(attributes);
        metricsService.incrementActiveRequests(attributes);

        long startTime = System.nanoTime();
        try {
            filterChain.doFilter(request, response);
        } finally {
            long duration = System.nanoTime() - startTime;

            // Add status code to attributes for the histogram
            Attributes histogramAttributes = Attributes.builder()
                    .putAll(attributes)
                    .put("status", response.getStatus())
                    .build();

            metricsService.recordRequestDuration(duration / 1_000_000_000.0, histogramAttributes);
            metricsService.decrementActiveRequests(attributes);
        }
    }
}