# Source: https://betterstack.com/community/guides/logging/best-golang-logging-libraries/
# Original language: go
# Normalized: go
# Block index: 11

package main

import (
	"os"

	"go.uber.org/zap"
	"go.uber.org/zap/exp/zapslog"
	"golang.org/x/exp/slog"
)

func main() {
	zapLogger := zap.Must(zap.NewProduction())

	defer zapLogger.Sync()

	logger := slog.New(zapslog.NewHandler(zapLogger.Core()))

	logger.Info(
		"Using Slog frontend with Zap backend!",
		slog.Int("process_id", os.Getpid()),
	)
}