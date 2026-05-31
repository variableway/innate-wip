# Source: https://betterstack.com/community/guides/logging/best-golang-logging-libraries/
# Original language: go
# Normalized: go
# Block index: 16

package main

import (
	"os"

	"github.com/phuslu/log"
)

func main() {
	l := log.Logger{
		Writer: &log.ConsoleWriter{
			Writer:    os.Stdout,
            [highlight]
			Formatter: log.LogfmtFormatter{"ts"}.Formatter,
            [/highlight]
		},
	}

	l.Info().Msg("Hello from Phuslu logger")
}