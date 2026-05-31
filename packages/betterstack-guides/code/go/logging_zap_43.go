# Source: https://betterstack.com/community/guides/logging/zap/
# Original language: go
# Normalized: go
# Block index: 43

func (e *SensitiveFieldEncoder) Clone() zapcore.Encoder {
	return &SensitiveFieldEncoder{
		Encoder: e.Encoder.Clone(),
	}
}