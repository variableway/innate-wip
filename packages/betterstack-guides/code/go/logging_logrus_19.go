# Source: https://betterstack.com/community/guides/logging/logrus/
# Original language: go
# Normalized: go
# Block index: 19

[label multioutput.go]
package main

import (
    "github.com/sirupsen/logrus"
    "io"
    "os"
)

func main() {
    // Create a new logger
    log := logrus.New()

    // Open a file for writing logs
    file, err := os.OpenFile("application.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
    if err != nil {
        log.Fatal("Failed to open log file:", err)
    }

    // Send logs to both file and stdout
    mw := io.MultiWriter(os.Stdout, file)
    log.SetOutput(mw)

    // Configure the formatter (optional)
    log.SetFormatter(&logrus.JSONFormatter{})

    // Now logs will go to both console and file
    log.Info("Application started")
    log.WithField("user_id", 123).Info("User logged in")

    // Using different formatters for different outputs
    // For this case, you would need two separate loggers
    fileLogger := logrus.New()
    fileLogger.SetOutput(file)
    fileLogger.SetFormatter(&logrus.JSONFormatter{})

    consoleLogger := logrus.New()
    consoleLogger.SetOutput(os.Stdout)
    consoleLogger.SetFormatter(&logrus.TextFormatter{})

    // Now use the appropriate logger based on where you want the log to go
    fileLogger.WithField("source", "file_only").Info("This goes only to the file as JSON")
    consoleLogger.WithField("source", "console_only").Info("This goes only to the console as text")
}