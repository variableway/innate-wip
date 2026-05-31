# Source: https://betterstack.com/community/guides/logging/logrus/
# Original language: go
# Normalized: go
# Block index: 25

[label httpmiddleware.go]
package main

import (
    "github.com/sirupsen/logrus"
    "net/http"
    "time"
    "github.com/google/uuid"
)

[highlight]
// LoggingMiddleware logs HTTP requests with detailed information
func LoggingMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        // Generate a unique request ID
        requestID := uuid.New().String()

        // Add the request ID to the response headers
        w.Header().Set("X-Request-ID", requestID)

        // Create a logger with request details
        log := logrus.WithFields(logrus.Fields{
            "request_id":  requestID,
            "method":      r.Method,
            "path":        r.URL.Path,
            "query":       r.URL.RawQuery,
            "remote_addr": r.RemoteAddr,
            "user_agent":  r.UserAgent(),
            "referer":     r.Referer(),
        })

        // Create a custom response writer to capture the status code
        rw := &responseWriter{w, http.StatusOK, 0}

        // Record start time for duration calculation
        start := time.Now()

        // Log the incoming request
        log.Info("HTTP request started")

        // Process the request
        next.ServeHTTP(rw, r)

        // Calculate request duration
        duration := time.Since(start)

        // Log the completed request with additional information
        log.WithFields(logrus.Fields{
            "status_code": rw.statusCode,
            "duration_ms": duration.Milliseconds(),
            "size_bytes":  rw.size,
        }).Info("HTTP request completed")
    })
}
[/highlight]

// Custom response writer to capture status code and response size
type responseWriter struct {
    http.ResponseWriter
    statusCode int
    size       int
}

// Override WriteHeader to capture status code
func (rw *responseWriter) WriteHeader(code int) {
    rw.statusCode = code
    rw.ResponseWriter.WriteHeader(code)
}

// Override Write to capture response size
func (rw *responseWriter) Write(b []byte) (int, error) {
    size, err := rw.ResponseWriter.Write(b)
    rw.size += size
    return size, err
}

func main() {
    logrus.SetFormatter(&logrus.JSONFormatter{})

    helloHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Write([]byte("Hello, world!"))
    })

    errorHandler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.WriteHeader(http.StatusInternalServerError)
        w.Write([]byte("Something went wrong!"))
    })

    // Register handlers with our logging middleware
    [highlight]
    http.Handle("/", LoggingMiddleware(helloHandler))
    http.Handle("/error", LoggingMiddleware(errorHandler))
    [/highlight]

    logrus.Info("Starting server on :8080")
    http.ListenAndServe(":8080", nil)
}