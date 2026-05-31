# Source: https://betterstack.com/community/guides/logging/logrus/
# Original language: go
# Normalized: go
# Block index: 20

[label main.go]
package main

import (
    "github.com/sirupsen/logrus"
    "os"
    "runtime"
)

func main() {
    log := logrus.New()
    log.SetFormatter(&logrus.JSONFormatter{})

    // Gather information about the environment
    hostname, _ := os.Hostname()

    // Create an entry with default fields
    logger := log.WithFields(logrus.Fields{
        "environment": os.Getenv("APP_ENV"),
        "service":     "user-service",
        "version":     "1.0.0",
        "host":        hostname,
        "go_version":  runtime.Version(),
        "pid":         os.Getpid(),
    })

    // All these logs will include the default fields
    logger.Info("Application started")
    logger.WithField("component", "database").Info("Connected to database")
    logger.WithField("component", "http").Info("HTTP server listening")

    // Specific components can add their own default fields
    dbLogger := logger.WithField("component", "database")
    dbLogger.Info("Migrations completed")
    dbLogger.WithField("query_time_ms", 15).Info("Query executed")
}