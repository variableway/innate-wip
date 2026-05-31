# Source: https://betterstack.com/community/guides/logging/logrus/
# Original language: go
# Normalized: go
# Block index: 12

[label main.go]
package main

import (
    "github.com/sirupsen/logrus"
)

func main() {
    log := logrus.New()

    // Add a single field
    log.WithField("request_id", "req-123").Info("Processing request")

    // Add multiple fields
    log.WithFields(logrus.Fields{
        "request_id": "req-123",
        "user_id":    456,
        "path":       "/api/users",
        "method":     "GET",
        "latency_ms": 42,
    }).Info("Request completed")

    // You can also build up context incrementally
    entry := log.WithField("request_id", "req-123")
    // Do some processing...
    entry = entry.WithField("user_found", true)
    // Do more processing...
    entry.WithField("response_size", 1024).Info("Response sent")
}