# Source: https://betterstack.com/community/guides/logging/best-golang-logging-libraries/
# Original language: go
# Normalized: go
# Block index: 31

package main

import (
	"os"

	"github.com/apex/log"
	"github.com/apex/log/handlers/logfmt"
)

func main() {
	stdout := logfmt.New(os.Stdout)

	log.SetHandler(stdout)
	logger := log.WithFields(log.Fields{
		"app": "myapp",
		"env": "prod",
	})

	logger.Info("Hello from Apex logger")
}