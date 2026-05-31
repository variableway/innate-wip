# Source: https://betterstack.com/community/guides/logging/best-golang-logging-libraries/
# Original language: go
# Normalized: go
# Block index: 29

package main

import (
	"github.com/apex/log"
)

func main() {
	logger := log.WithFields(log.Fields{
		"app": "myapp",
		"env": "prod",
	})

	logger.Info("Hello from Apex logger")
}