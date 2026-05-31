# Source: https://betterstack.com/community/guides/logging/zerolog/
# Original language: go
# Normalized: go
# Block index: 82

[label main.go]
. . .
func (fn handlerWithError) ServeHTTP(w http.ResponseWriter, r *http.Request) {
  [highlight]
	l := zerolog.Ctx(r.Context())
  [/highlight]

	err := fn(w, r)
	if err != nil {
    [highlight]
		l.Error().Err(err).Msg("server error")
    [/highlight]
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
. . .