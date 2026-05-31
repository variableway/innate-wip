# Source: https://betterstack.com/community/guides/logging/logging-in-go/
# Original language: go
# Normalized: go
# Block index: 46

package main

import (
	"context"
	"log/slog"
	"os"
)

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))

	ctx := context.WithValue(context.Background(), "request_id", "req-123")

	logger.InfoContext(ctx, "image uploaded", slog.String("image_id", "img-998"))
}