# Source: https://betterstack.com/community/guides/logging/zap/
# Original language: go
# Normalized: go
# Block index: 35

type User struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
}

func main() {
	logger := createLogger()

	defer logger.Sync()

	user := User{
		ID:    "USR-12345",
		Name:  "John Doe",
		Email: "john.doe@example.com",
	}

	logger.Info("user login", zap.Any("user", user))
}