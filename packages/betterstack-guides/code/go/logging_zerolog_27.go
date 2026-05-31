# Source: https://betterstack.com/community/guides/logging/zerolog/
# Original language: go
# Normalized: go
# Block index: 27

zerolog.ConsoleWriter{
	Out:        os.Stderr,
	TimeFormat: time.RFC3339,
	FormatLevel: func(i interface{}) string {
		return strings.ToUpper(fmt.Sprintf("[%s]", i))
	},
	FormatMessage: func(i interface{}) string {
		return fmt.Sprintf("| %s |", i)
	},
	FormatCaller: func(i interface{}) string {
		return filepath.Base(fmt.Sprintf("%s", i))
	},
	PartsExclude: []string{
		zerolog.TimestampFieldName,
	},
}