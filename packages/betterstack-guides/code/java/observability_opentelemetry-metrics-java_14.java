# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics-java/
# Original language: java
# Normalized: java
# Block index: 14

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
        metricsService.incrementActiveRequests();  // Increase at request start

        try {
            filterChain.doFilter(request, response);
        } finally {
            metricsService.decrementActiveRequests();  // Decrease at request end
        }
    }
}