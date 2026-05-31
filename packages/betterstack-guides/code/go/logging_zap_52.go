# Source: https://betterstack.com/community/guides/logging/zap/
# Original language: go
# Normalized: go
# Block index: 52

[label handlers.go]
func searchHandler(w http.ResponseWriter, r *http.Request) error {
	ctx := r.Context()

[highlight]
	l := logger.FromCtx(ctx)
[/highlight]

	l.Debug("entered searchHandler()")

	 . . .
}