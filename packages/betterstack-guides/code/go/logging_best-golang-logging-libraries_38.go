# Source: https://betterstack.com/community/guides/logging/best-golang-logging-libraries/
# Original language: go
# Normalized: go
# Block index: 38

package main

import (
	"errors"
	"os"

	"github.com/go-logr/logr"
	"github.com/go-logr/zerologr"
	"github.com/rs/zerolog"
)

func main() {
	zl := zerolog.New(os.Stderr)
	zl = zl.With().Caller().Timestamp().Logger()

	var log logr.Logger = zerologr.New(&zl)

	log.Info("hello from Logr and Zerolog!")
	log.Error(
		errors.New("file not found"),
		"file open failed",
		"file_path",
		"/home/john/abc.txt",
	)
}