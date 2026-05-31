# Source: https://betterstack.com/community/guides/logging/logging-in-go/
# Original language: go
# Normalized: go
# Block index: 61

func (u User) LogValue() slog.Value {
	return slog.GroupValue(
		slog.String("id", u.ID),
		slog.String("name", u.FirstName+" "+u.LastName),
	)
}