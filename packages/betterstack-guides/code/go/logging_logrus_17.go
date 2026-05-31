# Source: https://betterstack.com/community/guides/logging/logrus/
# Original language: go
# Normalized: go
# Block index: 17

[label main.go]
package main

import (
    "bytes"
    "fmt"
    "github.com/sirupsen/logrus"
    "sort"
    "strings"
    "time"
)

// CustomFormatter implements logrus.Formatter interface
type CustomFormatter struct {
    // Custom configuration options can go here
    TimestampFormat string
    IncludeFields   []string // Only include these fields
    ExcludeFields   []string // Exclude these fields
}

// Format renders a log entry
func (f *CustomFormatter) Format(entry *logrus.Entry) ([]byte, error) {
    var b *bytes.Buffer

    if entry.Buffer != nil {
        b = entry.Buffer
    } else {
        b = &bytes.Buffer{}
    }

    // Format timestamp
    timestamp := entry.Time.Format(f.TimestampFormat)

    // Format level name with padding for alignment
    level := strings.ToUpper(entry.Level.String())
    level = fmt.Sprintf("%-7s", level) // Pad to 7 characters

    // Add timestamp, level, and message
    fmt.Fprintf(b, "[%s] [%s] %s", timestamp, level, entry.Message)

    // Sort fields by key for consistent output
    var keys []string
    for k := range entry.Data {
        // Skip excluded fields
        if contains(f.ExcludeFields, k) {
            continue
        }

        // Only add included fields if the list is not empty
        if len(f.IncludeFields) > 0 && !contains(f.IncludeFields, k) {
            continue
        }

        keys = append(keys, k)
    }
    sort.Strings(keys)

    // Add fields
    for _, key := range keys {
        fmt.Fprintf(b, " | %s=%v", key, entry.Data[key])
    }

    b.WriteByte('\n')
    return b.Bytes(), nil
}

// Helper function to check if a slice contains a string
func contains(slice []string, s string) bool {
    for _, item := range slice {
        if item == s {
            return true
        }
    }
    return false
}

func main() {
    log := logrus.New()

    // Use our custom formatter
    log.SetFormatter(&CustomFormatter{
        TimestampFormat: "2006-01-02 15:04:05",
        ExcludeFields:   []string{"internal_id"}, // Don't show internal IDs
    })

    log.WithFields(logrus.Fields{
        "user_id":    123,
        "action":     "login",
        "internal_id": "some-internal-value", // This will be excluded
    }).Info("User logged in")

    // Test with different log levels to see alignment
    log.WithField("component", "test").Debug("This is a debug message")
    log.WithField("component", "test").Info("This is an info message")
    log.WithField("component", "test").Warn("This is a warning message")
    log.WithField("component", "test").Error("This is an error message")
}