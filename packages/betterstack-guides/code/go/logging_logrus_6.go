# Source: https://betterstack.com/community/guides/logging/logrus/
# Original language: go
# Normalized: go
# Block index: 6

[label setlevel.go]
package main

import (
    "github.com/sirupsen/logrus"
    "os"
)

func main() {
    log := logrus.New()

    // Set log level to Debug to see more details
    [highlight]
    log.SetLevel(logrus.DebugLevel)
    [/highlight]

    log.Debug("This debug message will now be visible")
    log.Info("Along with info and higher levels")

    // You can also set the level dynamically based on environment
    if env := os.Getenv("APP_ENV"); env == "production" {
        log.SetLevel(logrus.WarnLevel) // Only log warnings and above in production
    } else {
        log.SetLevel(logrus.DebugLevel) // Log everything in development
    }
}