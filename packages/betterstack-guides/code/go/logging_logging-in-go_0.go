# Source: https://betterstack.com/community/guides/logging/logging-in-go/
# Original language: go
# Normalized: go
# Block index: 0

package main

import (
	"log"
	"log/slog"
)

func main() {
	log.Print("Info message")
	slog.Info("Info message")
}