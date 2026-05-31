# Source: https://betterstack.com/community/guides/logging/logging-in-go/
# Original language: go
# Normalized: go
# Block index: 59

// implement the `LogValuer` interface on the User struct
func (u User) LogValue() slog.Value {
	return slog.StringValue(u.ID)
}