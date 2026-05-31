# Source: https://betterstack.com/community/guides/observability/opentelemetry-go/
# Original language: go
# Normalized: go
# Block index: 7

otelhttp.NewHandler(mux, "/", otelhttp.WithFilter(otelReqFilter))

func otelReqFilter(req *http.Request) bool {
	return req.URL.Path != "/auth"
}