# Source: https://betterstack.com/community/guides/logging/logging-in-go/
# Original language: go
# Normalized: go
# Block index: 72

package main

import (
	"fmt"
	"log/slog"
	"os"

	slogmulti "github.com/samber/slog-multi"
	slogsampling "github.com/samber/slog-sampling"
)

func main() {
	// Will print 20% of entries.
	option := slogsampling.UniformSamplingOption{
		Rate: 0.2,
	}

	logger := slog.New(
		slogmulti.
			Pipe(option.NewMiddleware()).
			Handler(slog.NewJSONHandler(os.Stdout, nil)),
	)

	for i := 1; i <= 10; i++ {
		logger.Info(fmt.Sprintf("a message from the gods: %d", i))
	}
}