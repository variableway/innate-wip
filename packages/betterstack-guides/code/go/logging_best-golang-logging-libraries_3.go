# Source: https://betterstack.com/community/guides/logging/best-golang-logging-libraries/
# Original language: go
# Normalized: go
# Block index: 3

func SomeMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		l := zerolog.New(os.Stdout)

		l.UpdateContext(func(c zerolog.Context) zerolog.Context {
			// add contextual properties to the logger's context like this
			return c.Str("user_id", "usr-1234")
		})

		// store the logger in the request's context
		r = r.WithContext(l.WithContext(ctx))

		next.ServeHTTP(w, r)
	})
}

// your HTTP handler
func handler(w http.ResponseWriter, r *http.Request) {
	// retrieve the logger from the request context
	l := zerolog.Ctx(r.Context())

	// all subsequent logs will contain the contextual properties previously attached
	// to the logger along with any additional context added at log point
	l.Info().Str("doc_id", "doc-xyz").Msg("doc-xyz deleted")
}