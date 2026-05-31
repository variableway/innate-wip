# Source: https://betterstack.com/community/guides/observability/jaeger-guide/
# Original language: go
# Normalized: go
# Block index: 15

[label services/frontend/best_eta.go]
. . .
func newBestETA(tracer trace.TracerProvider, logger log.Factory, options ConfigOptions) *bestETA {
	return &bestETA{
		customer: customer.NewClient(
			tracer,
			logger.With(zap.String("component", "customer_client")),
			options.CustomerHostPort,
		),
		driver: driver.NewClient(
			tracer,
			logger.With(zap.String("component", "driver_client")),
			options.DriverHostPort,
		),
		route: route.NewClient(
			tracer,
			logger.With(zap.String("component", "route_client")),
			options.RouteHostPort,
		),
[highlight]
		pool:   pool.New(config.RouteWorkerPoolSize),
[/highlight]
		logger: logger,
	}
}
. . .