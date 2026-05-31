# Source: https://betterstack.com/community/guides/monitoring/prometheus-golang/
# Original language: go
# Normalized: go
# Block index: 13

[label main.go]
package main

import (
	"log"
	"net/http"
	"os"
[highlight]
	"strconv"
[/highlight]

	"github.com/joho/godotenv"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

func init() {
	_ = godotenv.Load()
}

[highlight]
var httpRequestCounter = prometheus.NewCounterVec(prometheus.CounterOpts{
	Name: "http_requests_total",
	Help: "Total number of HTTP requests received",
}, []string{"status", "path", "method"})

// Middleware to count HTTP requests
func prometheusMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Wrap the ResponseWriter to capture the status code
		recorder := &statusRecorder{
			ResponseWriter: w,
			statusCode:     http.StatusOK,
		}

		// Process the request
		next.ServeHTTP(recorder, r)

		method := r.Method
		path := r.URL.Path // Path can be adjusted for aggregation (e.g., `/users/:id` → `/users/{id}`)
		status := strconv.Itoa(recorder.statusCode)

		// Increment the counter
		httpRequestCounter.WithLabelValues(status, path, method).Inc()
	})
}

// Helper to capture HTTP status codes
type statusRecorder struct {
	http.ResponseWriter
	statusCode int
}

func (rec *statusRecorder) WriteHeader(code int) {
	rec.statusCode = code
	rec.ResponseWriter.WriteHeader(code)
}
[/highlight]

func main() {
	mux := http.NewServeMux()

	reg := prometheus.NewRegistry()

[highlight]
	reg.MustRegister(httpRequestCounter)
[/highlight]

	handler := promhttp.HandlerFor(
		reg,
		promhttp.HandlerOpts{})

	mux.Handle("/metrics", handler)

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello world!"))
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}

[highlight]
	promHandler := prometheusMiddleware(mux)
[/highlight]

	log.Println("Starting HTTP server on port", port)

[highlight]
	if err := http.ListenAndServe(":"+port, promHandler); err != nil {
[/highlight]
		log.Fatal("Server failed to start:", err)
	}
}