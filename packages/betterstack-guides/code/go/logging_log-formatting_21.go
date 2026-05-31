# Source: https://betterstack.com/community/guides/logging/log-formatting/
# Original language: go
# Normalized: go
# Block index: 21

l := slog.With(slog.Int("user_id", 42))

l.Info("user logged in")
l.Info("user deleted doc", slog.String("doc_id", "DOC-123"))
l.Info("user logged out")