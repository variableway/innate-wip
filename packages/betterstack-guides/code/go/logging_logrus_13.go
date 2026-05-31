# Source: https://betterstack.com/community/guides/logging/logrus/
# Original language: go
# Normalized: go
# Block index: 13

[label main.go]
package main

import (
    "github.com/sirupsen/logrus"
)

func main() {
    log := logrus.New()
    log.SetFormatter(&logrus.JSONFormatter{})

    // Create a child logger with request context
    requestLogger := log.WithFields(logrus.Fields{
        "request_id": "req-123",
        "client_ip":  "192.168.1.1",
        "user_agent": "Mozilla/5.0",
    })

    // All these logs will include the request context
    requestLogger.Info("Request started")
    processRequest(requestLogger)
    requestLogger.WithField("duration_ms", 42).Info("Request completed")
}

func processRequest(log *logrus.Entry) {
    // The logger already has the request context
    log.Debug("Parsing request parameters")

    // We can add more context specific to this function
    log.WithField("path", "/api/users").Info("Routing request")

    // Further function calls can use the same logger
    validateAuth(log)
}

func validateAuth(log *logrus.Entry) {
    // Create a more specialized logger for auth operations
    authLogger := log.WithField("component", "auth")
    authLogger.Debug("Checking authentication token")
    authLogger.Info("User authenticated successfully")
}