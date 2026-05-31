# Source: https://betterstack.com/community/guides/logging/log-sampling/
# Original language: go
# Normalized: go
# Block index: 6

package main

import (
	"os"
	"time"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

func createLogger() *zap.Logger {
	stdout := zapcore.AddSync(os.Stdout)

	level := zap.NewAtomicLevelAt(zap.InfoLevel)

	productionCfg := zap.NewProductionEncoderConfig()

	jsonEncoder := zapcore.NewJSONEncoder(productionCfg)

	jsonOutCore := zapcore.NewCore(jsonEncoder, stdout, level)

[highlight]
	samplingCore := zapcore.NewSamplerWithOptions(
		jsonOutCore,
		time.Second, // interval
		3,           // log first 3 entries
		0,           // thereafter log zero entires within the interval
	)
[/highlight]

	return zap.New(samplingCore)
}

func main() {
	logger := createLogger().Sugar()

	defer logger.Sync()

	for i := 1; i <= 10; i++ {
		logger.Info("an info message")
		logger.Debug("a debug message")
		logger.Warn("a warning message")
		logger.Error("an error message")
	}
}