# Source: https://betterstack.com/community/guides/logging/logrus/
# Original language: go
# Normalized: go
# Block index: 22

[label main.go]
package main

import (
	"errors"

	"github.com/sirupsen/logrus"
)

func main() {
	log := logrus.New()
	log.SetFormatter(&logrus.JSONFormatter{})

	// Simple error logging
	err := errors.New("something went wrong")
	log.WithError(err).Error("Failed to process request")

	// WithError is a shorthand for WithField("error", err)
	// It's equivalent to:
	log.WithField("error", err).Error("Failed to process request")

	// With additional context
	log.WithFields(logrus.Fields{
		"user_id": 123,
		"error":   err.Error(),
		"context": "user lookup",
	}).Error("User data could not be retrieved")

	// Fatal errors - will exit the program
	if criticalErr := performCriticalOperation(); criticalErr != nil {
		log.WithError(criticalErr).Fatal("System cannot continue")
		// The program exits here with status code 1
	}

	// Panic errors - will panic after logging
	if panicErr := performRiskyOperation(); panicErr != nil {
		log.WithError(panicErr).Panic("Unexpected state detected")
		// The program panics here
	}
}

func performCriticalOperation() error {
	// Simulate an error
	return errors.New("critical subsystem failure")
}

func performRiskyOperation() error {
	// Simulate an error
	return errors.New("invalid state")
}
    // Simulate an error
    return errors.New("critical subsystem failure")
}

func performRiskyOperation() error {
    // Simulate an error
    return errors.New("invalid state")
}