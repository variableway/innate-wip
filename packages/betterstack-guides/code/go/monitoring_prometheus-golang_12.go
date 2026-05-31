# Source: https://betterstack.com/community/guides/monitoring/prometheus-golang/
# Original language: go
# Normalized: go
# Block index: 12

[label main.go]
package main

import (
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
[highlight]
	"github.com/prometheus/client_golang/prometheus"
[/highlight]
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

func init() {
	_ = godotenv.Load()
}

func main() {
	mux := http.NewServeMux()

[highlight]
	reg := prometheus.NewRegistry()

	handler := promhttp.HandlerFor(
		reg,
		promhttp.HandlerOpts{})

	mux.Handle("/metrics", handler)
[/highlight]

    . . .
}