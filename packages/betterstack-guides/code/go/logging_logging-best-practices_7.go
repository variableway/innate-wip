# Source: https://betterstack.com/community/guides/logging/logging-best-practices/
# Original language: go
# Normalized: go
# Block index: 7

package main

import (
	"log/slog"
	"os"
)

type User struct {
	ID        string `json:"id"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Email     string `json:"email"`
	Password  string `json:"password"`
}

[highlight]
func (u *User) LogValue() slog.Value {
	return slog.StringValue(u.ID)
}
[/highlight]

func main() {
	handler := slog.NewJSONHandler(os.Stdout, nil)
	logger := slog.New(handler)

	u := &User{
		ID:        "user-12234",
		FirstName: "Jan",
		LastName:  "Doe",
		Email:     "jan@example.com",
		Password:  "pass-12334",
	}

	logger.Info("info", "user", u)
}