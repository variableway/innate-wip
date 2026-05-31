# Source: https://betterstack.com/community/guides/logging/logrus/
# Original language: go
# Normalized: go
# Block index: 3

[label main.go]
package main

import (
    "github.com/sirupsen/logrus"
)

func main() {
    // Using the global logger
    logrus.SetFormatter(&logrus.JSONFormatter{})
    logrus.Info("Hello from the global Logrus logger!")

    // You can also configure the global logger
    logrus.SetLevel(logrus.DebugLevel)
    logrus.Debug("This debug message will now be visible")
}