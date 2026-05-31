# Source: https://betterstack.com/community/guides/logging/log-formatting/
# Original language: go
# Normalized: go
# Block index: 3

package main

import (
	"log/slog"
	"os"
)

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	logger.Info("an info message")
}