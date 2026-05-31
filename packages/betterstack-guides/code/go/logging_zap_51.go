# Source: https://betterstack.com/community/guides/logging/zap/
# Original language: go
# Normalized: go
# Block index: 51

[label middleware.go]
func requestLogger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// retrieve the standard logger instance
		l := logger.Get()

		// create a correlation ID for the request
		correlationID := xid.New().String()

		ctx := context.WithValue(
			r.Context(),
			correlationIDCtxKey,
			correlationID,
		)

		r = r.WithContext(ctx)

		// create a child logger containing the correlation ID
		// so that it appears in all subsequent logs
		l = l.With(zap.String(string(correlationIDCtxKey), correlationID))

		w.Header().Add("X-Correlation-ID", correlationID)

		lrw := newLoggingResponseWriter(w)

		// the logger is associated with the request context here
        // so that it may be retrieved in subsequent `http.Handlers`
		r = r.WithContext(logger.WithCtx(ctx, l))

		. . .

		next.ServeHTTP(lrw, r)
	})
}