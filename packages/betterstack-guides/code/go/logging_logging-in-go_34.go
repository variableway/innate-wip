# Source: https://betterstack.com/community/guides/logging/logging-in-go/
# Original language: go
# Normalized: go
# Block index: 34

. . .

var LevelNames = map[slog.Leveler]string{
	LevelTrace:      "TRACE",
	LevelFatal:      "FATAL",
}

func main() {
	opts := slog.HandlerOptions{
		Level: LevelTrace,
    [highlight]
		ReplaceAttr: func(groups []string, a slog.Attr) slog.Attr {
			if a.Key == slog.LevelKey {
				level := a.Value.Any().(slog.Level)
				levelLabel, exists := LevelNames[level]
				if !exists {
					levelLabel = level.String()
				}

				a.Value = slog.StringValue(levelLabel)
			}

			return a
		},
    [/highlight]
	}

	. . .
}