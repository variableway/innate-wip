# Source: https://betterstack.com/community/guides/logging/logrus/
# Original language: go
# Normalized: go
# Block index: 1

[label main.go]
package main

import (
    "github.com/sirupsen/logrus"
)

func main() {
    // Create a new logger
    log := logrus.New()

    // Set the output format to JSON
    log.SetFormatter(&logrus.JSONFormatter{})

    // Log a simple message
    log.Info("Hello from Logrus!")
}