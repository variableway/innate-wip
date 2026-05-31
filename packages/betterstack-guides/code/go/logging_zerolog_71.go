# Source: https://betterstack.com/community/guides/logging/zerolog/
# Original language: go
# Normalized: go
# Block index: 71

[label main.go]
. . .
func requestLogger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		l := logger.Get()

    [highlight]
		lrw := newLoggingResponseWriter(w)
    [/highlight]

		defer func() {
      [highlight]
			panicVal := recover()
			if panicVal != nil {
				lrw.statusCode = http.StatusInternalServerError // ensure that the status code is updated
				panic(panicVal) // continue panicking
			}
      [/highlight]

			l.
				Info().
				Str("method", r.Method).
				Str("url", r.URL.RequestURI()).
				Str("user_agent", r.UserAgent()).
				Dur("elapsed_ms", time.Since(start)).
        [highlight]
				Int("status_code", lrw.statusCode).
        [/highlight]
				Msg("incoming request")
		}()

    [highlight]
		next.ServeHTTP(lrw, r)
    [/highlight]
	})
}
. . .