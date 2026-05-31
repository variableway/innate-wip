# Source: https://betterstack.com/community/guides/monitoring/prometheus-golang/
# Original language: go
# Normalized: go
# Block index: 16

[label main.go]
package main

import (
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/joho/godotenv"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

. . .

[highlight]
var activeRequestsGauge = prometheus.NewGauge(
	prometheus.GaugeOpts{
		Name: "http_active_requests",
		Help: "Number of active connections to the service",
	},
)
[/highlight]

// Middleware to count HTTP requests.
func prometheusMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
[highlight]
		activeRequestsGauge.Inc()
[/highlight]
		// Wrap the ResponseWriter to capture the status code
		recorder := &statusRecorder{
			ResponseWriter: w,
			statusCode:     http.StatusOK,
		}

[highlight]
		time.Sleep(1 * time.Second)
[/highlight]

		// Process the request
		next.ServeHTTP(recorder, r)

[highlight]
		activeRequestsGauge.Dec()
[/highlight]

        . . .
	})
}

. . .

func main() {
	mux := http.NewServeMux()

	reg := prometheus.NewRegistry()

	reg.MustRegister(httpRequestCounter)
[highlight]
	reg.MustRegister(activeRequestsGauge)
[/highlight]

    . . .
}