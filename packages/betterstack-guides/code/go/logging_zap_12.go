# Source: https://betterstack.com/community/guides/logging/zap/
# Original language: go
# Normalized: go
# Block index: 12

sugar := zap.Must(zap.NewProduction()).Sugar()

defer sugar.Sync()
sugar.Infow("Hello from SugaredLogger!")

logger := sugar.Desugar()

logger.Info("Hello from Logger!")