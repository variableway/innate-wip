# Source: https://betterstack.com/community/guides/observability/jaeger-guide/
# Original language: go
# Normalized: go
# Block index: 16

[label services/config/config.go]
var (
    . . .
	// RouteWorkerPoolSize is the size of the worker pool used to query `route` service.
	// Can be overwritten from command line.
	RouteWorkerPoolSize = 3
    . . .
)