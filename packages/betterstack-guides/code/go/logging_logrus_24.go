# Source: https://betterstack.com/community/guides/logging/logrus/
# Original language: go
# Normalized: go
# Block index: 24

[label main.go]
package main

import (
    "fmt"
    "github.com/sirupsen/logrus"
    "strings"
)

// Define a custom hook
type AlertHook struct {
    // Configuration fields go here
    AlertThreshold logrus.Level
    AlertEndpoint  string
}

// Implement the Levels method to specify which log levels this hook should be triggered for
func (hook *AlertHook) Levels() []logrus.Level {
    // Get all levels at or above the threshold
    levels := []logrus.Level{}
    for _, level := range logrus.AllLevels {
        if level <= hook.AlertThreshold {
            levels = append(levels, level)
        }
    }
    return levels
}

// Implement the Fire method to define what happens when the hook is triggered
func (hook *AlertHook) Fire(entry *logrus.Entry) error {
    // Extract relevant information from the log entry
    level := entry.Level.String()
    message := entry.Message

    // Build alert payload
    alertText := fmt.Sprintf("[%s] %s", strings.ToUpper(level), message)

    // Include relevant fields
    for k, v := range entry.Data {
        alertText += fmt.Sprintf(" | %s=%v", k, v)
    }

    // In a real implementation, this would send the alert to an external system
    fmt.Printf("ALERT to %s: %s\n", hook.AlertEndpoint, alertText)

    // Return nil if successful, or an error if something went wrong
    return nil
}

func main() {
    log := logrus.New()

    // Add our custom hook
    log.AddHook(&AlertHook{
        AlertThreshold: logrus.WarnLevel,
        AlertEndpoint:  "https://alerts.example.com/webhook",
    })

    // These logs won't trigger the hook
    log.Debug("Debug message")
    log.Info("Info message")

    // These logs will trigger the hook
    log.Warn("Warning message")
    log.WithField("component", "database").Error("Connection failed")
}