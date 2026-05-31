# Source: https://betterstack.com/community/guides/monitoring/prometheus-golang/
# Original language: go
# Normalized: go
# Block index: 19

[label main.go]
package main

import (
	"log"
	"math/rand"
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
var latencyHistogram = prometheus.NewHistogramVec(prometheus.HistogramOpts{
	Name: "http_request_duration_seconds",
	Help: "Duration of HTTP requests",
}, []string{"status", "path", "method"})
[/highlight]

// Middleware to count HTTP requests.
func prometheusMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		. . .

[highlight]
		now := time.Now()

		delay := time.Duration(rand.Intn(900)) * time.Millisecond

		time.Sleep(delay)
[/highlight]

		. . .

[highlight]
		latencyHistogram.With(prometheus.Labels{
			"method": method, "path": path, "status": status,
		}).
			Observe(time.Since(now).Seconds())
[/highlight]

		// Increment the counter
		httpRequestCounter.WithLabelValues(status, path, method).Inc()
	})
}

. . .

func main() {
	mux := http.NewServeMux()

	reg := prometheus.NewRegistry()

	reg.MustRegister(httpRequestCounter)
	reg.MustRegister(activeRequestsGauge)
[highlight]
	reg.MustRegister(latencyHistogram)
[/highlight]

	. . .
}