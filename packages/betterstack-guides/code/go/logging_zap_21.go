# Source: https://betterstack.com/community/guides/logging/zap/
# Original language: go
# Normalized: go
# Block index: 21

logger.Warn("User account is nearing the storage limit",
    zap.String("username", "john.doe"),
    zap.Float64("storageUsed", 4.5),
    zap.Float64("storageLimit", 5.0),
)