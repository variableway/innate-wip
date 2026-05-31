# Source: https://betterstack.com/community/guides/logging/zerolog/
# Original language: go
# Normalized: go
# Block index: 59

[label main.go]
. . .
func init() {
  [highlight]
  l := logger.Get()
  [/highlight]

	var err error

	tpl, err = template.New("index.html").Funcs(template.FuncMap{
		"htmlSafe": htmlSafe,
	}).ParseFiles("index.html")
	if err != nil {
    [highlight]
		l.Fatal().Err(err).Msg("Unable to initialize HTML templates")
    [/highlight]
	}
}

func main() {
  [highlight]
	l := logger.Get()
  [/highlight]

	fs := http.FileServer(http.Dir("assets"))

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	mux := http.NewServeMux()
	mux.Handle("/assets/", http.StripPrefix("/assets/", fs))
	mux.Handle("/search", handlerWithError(searchHandler))
	mux.Handle("/", handlerWithError(indexHandler))

  [highlight]
	l.Info().
		Str("port", port).
		Msgf("Starting Wikipedia App Server on port '%s'", port)


	l.Fatal().
		Err(http.ListenAndServe(":"+port, mux)).
		Msg("Wikipedia App Server Closed")
  [/highlight]
}