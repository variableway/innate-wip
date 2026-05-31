# Source: https://betterstack.com/community/guides/logging/zap/
# Original language: go
# Normalized: go
# Block index: 39

type SensitiveFieldEncoder struct {
	zapcore.Encoder
	cfg zapcore.EncoderConfig
}

// EncodeEntry is called for every log line to be emitted so it needs to be
// as efficient as possible so that you don't negate the speed/memory advantages
// of Zap
func (e *SensitiveFieldEncoder) EncodeEntry(
	entry zapcore.Entry,
	fields []zapcore.Field,
) (*buffer.Buffer, error) {
	filtered := make([]zapcore.Field, 0, len(fields))

	for _, field := range fields {
		user, ok := field.Interface.(User)
		if ok {
			user.Email = "[REDACTED]"
			field.Interface = user
		}

		filtered = append(filtered, field)
	}

	return e.Encoder.EncodeEntry(entry, filtered)
}

func NewSensitiveFieldsEncoder(config zapcore.EncoderConfig) zapcore.Encoder {
	encoder := zapcore.NewJSONEncoder(config)
	return &SensitiveFieldEncoder{encoder, config}
}

func createLogger() *zap.Logger {
	. . .

[highlight]
	jsonEncoder := NewSensitiveFieldsEncoder(productionCfg)
[/highlight]

	. . .

	return zap.New(samplingCore)
}