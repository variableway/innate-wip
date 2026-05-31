# Source: https://betterstack.com/community/guides/logging/logging-in-go/
# Original language: go
# Normalized: go
# Block index: 69

package main

import (
	"log/slog"
	"os"

    [highlight]
	"github.com/rs/zerolog"
	slogzerolog "github.com/samber/slog-zerolog"
    [/highlight]
)

func main() {
    [highlight]
	zerologL := zerolog.New(os.Stdout).Level(zerolog.InfoLevel)

	logger := slog.New(
		slogzerolog.Option{Logger: &zerologL}.NewZerologHandler(),
	)
    [/highlight]

	logger.Info(
		"incoming request",
		slog.String("method", "GET"),
		slog.String("path", "/api/user"),
		slog.Int("status", 200),
	)
}