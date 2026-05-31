# Source: https://betterstack.com/community/guides/logging/logging-in-go/
# Original language: go
# Normalized: go
# Block index: 49

func main() {
    [highlight]
	h := &ContextHandler{slog.NewJSONHandler(os.Stdout, nil)}
    [/highlight]

	logger := slog.New(h)

    [highlight]
	ctx := AppendCtx(context.Background(), slog.String("request_id", "req-123"))
    [/highlight]

	logger.InfoContext(ctx, "image uploaded", slog.String("image_id", "img-998"))
}