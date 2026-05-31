# Source: https://betterstack.com/community/guides/logging/logrus/
# Original language: go
# Normalized: go
# Block index: 5

[label main.go]
package main

import (
    "github.com/sirupsen/logrus"
)

func main() {
    // Creating your own logger instance
    log := logrus.New()

    // Try different log levels
    log.Trace("Trace message") // Most detailed level
    log.Debug("Debug message") // Detailed information for debugging
    log.Info("Info message")   // General information about system operation
    log.Warn("Warning message") // Something unexpected but not critical
    log.Error("Error message")  // An error that doesn't stop operation
    log.Fatal("Fatal message") // Logs and then calls os.Exit(1)
    log.Panic("Panic message") // Logs and then calls panic()
}