# Source: https://betterstack.com/community/guides/logging/zerolog/
# Original language: go
# Normalized: go
# Block index: 66

[label main.go]
. . .
func main() {
	. . .

	l.Fatal().
    [highlight]
		Err(http.ListenAndServe(":"+port, requestLogger(mux))).
    [/highlight]
		Msg("Wikipedia App Server Closed")
}
. . .