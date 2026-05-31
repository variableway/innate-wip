# Source: https://betterstack.com/community/guides/logging/logrus/
# Original language: go
# Normalized: go
# Block index: 9

[label main.go]
package main

import (
    "github.com/sirupsen/logrus"
    "os"
)

func main() {
    log := logrus.New()

    // Configure JSON formatter with custom settings
    log.SetFormatter(&logrus.JSONFormatter{
        TimestampFormat: "2006-01-02 15:04:05", // Customize time format
        PrettyPrint:     true, // Makes the output more readable for humans
        DataKey:         "data", // Put all fields under a nested "data" key
    })
    log.WithField("user_id", 123).Info("This will be formatted as pretty JSON")

    // Switch to text formatter with custom settings
    log.SetFormatter(&logrus.TextFormatter{
        FullTimestamp:   true, // Show full timestamp instead of elapsed time
        TimestampFormat: "2006-01-02 15:04:05",
        DisableColors:   false, // Enable colors for better readability
        ForceColors:     true, // Force colors even when not in a terminal
    })
    log.WithField("user_id", 123).Info("This will be formatted as colored text")

    // You can also customize the output destination
    file, err := os.OpenFile("app.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
    if err == nil {
        log.SetOutput(file)
    } else {
        log.Error("Failed to log to file, using default stderr")
    }

    log.Info("This goes to the file instead of the console")
}