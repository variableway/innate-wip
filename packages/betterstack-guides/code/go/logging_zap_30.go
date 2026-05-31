# Source: https://betterstack.com/community/guides/logging/zap/
# Original language: go
# Normalized: go
# Block index: 30

[highlight]
func lowerCaseLevelEncoder(
	level zapcore.Level,
	enc zapcore.PrimitiveArrayEncoder,
) {
	if level == zap.PanicLevel || level == zap.DPanicLevel {
		enc.AppendString("error")
		return
	}

	zapcore.LowercaseLevelEncoder(level, enc)
}
[/highlight]

func createLogger() *zap.Logger {
	stdout := zapcore.AddSync(os.Stdout)

	level := zap.NewAtomicLevelAt(zap.InfoLevel)

	productionCfg := zap.NewProductionEncoderConfig()
	productionCfg.TimeKey = "timestamp"
	productionCfg.EncodeTime = zapcore.ISO8601TimeEncoder
    [highlight]
	productionCfg.EncodeLevel = lowerCaseLevelEncoder
    [/highlight]

	jsonEncoder := zapcore.NewJSONEncoder(productionCfg)

	core := zapcore.NewCore(jsonEncoder, stdout, level)

	return zap.New(core)
}

func main() {
	logger := createLogger()

	defer logger.Sync()

	logger.DPanic(
		"this was never supposed to happen",
	)
}