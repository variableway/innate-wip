# Source: https://betterstack.com/community/guides/observability/opentelemetry-metrics-golang/
# Original language: go
# Normalized: go
# Block index: 13

[label main.go]
package main

import (
    . . .

    [highlight]
	"go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp"
    [/highlight]
)

. . .

func main.go() {
   . . .
    [highlight]
	handler := otelhttp.NewHandler(mux, "/")
    [/highlight]

	log.Println("Starting HTTP server on port 8000")

    [highlight]
	if err := http.ListenAndServe(":8000", handler); err != nil {
    [/highlight]
		log.Fatal("Server failed to start:", err)
	}
}