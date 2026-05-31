# Source: https://betterstack.com/community/guides/logging/log-formatting/
# Original language: go
# Normalized: go
# Block index: 24

type User struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
	Password string `json:"password"`
}

func (u *User) LogValue() slog.Value {
	return slog.StringValue(u.ID)
}