# Source: https://betterstack.com/community/guides/logging/logrus/
# Original language: go
# Normalized: go
# Block index: 7

[label main.go]
package main

import (
    "github.com/sirupsen/logrus"
)

func main() {
    log := logrus.New()
    [highlight]
    log.SetFormatter(&logrus.JSONFormatter{}) // set this to produce JSON output
    [/highlight]

    // Log with structured fields
    log.WithFields(logrus.Fields{
        "user_id":   12345,
        "component": "auth_service",
        "action":    "login",
        "ip_address": "192.168.1.1",
        "success": true,
    }).Info("User login successful")

    // You can also add single fields
    log.WithField("request_id", "req-abc-123").Info("Processing request")

    // Or chain multiple field operations
    log.WithField("module", "api").
        WithField("method", "GET").
        WithField("endpoint", "/users").
        Info("Request received")
}