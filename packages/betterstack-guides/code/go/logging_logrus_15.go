# Source: https://betterstack.com/community/guides/logging/logrus/
# Original language: go
# Normalized: go
# Block index: 15

[label main.go]
package main

import (
    "context"
    "github.com/sirupsen/logrus"
    "net/http"
)

type contextKey string

const loggerKey contextKey = "logger"

// Middleware to add logger to request context
func LoggerMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        // Create a request ID
        requestID := "req-" + generateID() // Implement this function

        // Create a logger with request fields
        logger := logrus.WithFields(logrus.Fields{
            "request_id": requestID,
            "path":       r.URL.Path,
            "method":     r.Method,
            "user_agent": r.UserAgent(),
            "remote_ip":  r.RemoteAddr,
        })

        // Add the logger to the request context
        ctx := context.WithValue(r.Context(), loggerKey, logger)
        r = r.WithContext(ctx)

        logger.Info("Request started")

        // Call the next handler
        next.ServeHTTP(w, r)

        logger.Info("Request completed")
    })
}

// Helper function to get logger from context
func LoggerFromContext(ctx context.Context) *logrus.Entry {
    if logger, ok := ctx.Value(loggerKey).(*logrus.Entry); ok {
        return logger
    }
    // Return default logger if none in context
    return logrus.NewEntry(logrus.StandardLogger())
}

// Handler that uses the logger from context
func MyHandler(w http.ResponseWriter, r *http.Request) {
    logger := LoggerFromContext(r.Context())

    logger.Info("Processing request in handler")

    // Do work...

    logger.WithField("status", 200).Info("Successfully processed request")
}

// In your main function, you'd set up the HTTP server with this middleware
func main() {
    logrus.SetFormatter(&logrus.JSONFormatter{})

    router := http.NewServeMux()
    router.Handle("/api/endpoint", http.HandlerFunc(MyHandler))

    // Wrap all handlers with the logger middleware
    http.ListenAndServe(":8080", LoggerMiddleware(router))
}

// Dummy function to generate IDs
func generateID() string {
    return "123456" // In real code, generate a unique ID
}