# Source: https://betterstack.com/community/guides/logging/logging-in-go/
# Original language: go
# Normalized: go
# Block index: 65

package main

import (
	"log/slog"

	"go.uber.org/zap"
	"go.uber.org/zap/exp/zapslog"
)

func main() {
	zapL := zap.Must(zap.NewProduction())

	defer zapL.Sync()

	logger := slog.New(zapslog.NewHandler(zapL.Core(), nil))

	logger.Info(
		"incoming request",
		slog.String("method", "GET"),
		slog.String("path", "/api/user"),
		slog.Int("status", 200),
	)
}