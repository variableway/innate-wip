# Source: https://betterstack.com/community/guides/logging/best-golang-logging-libraries/
# Original language: go
# Normalized: go
# Block index: 35

package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/apex/log"
	"github.com/apex/log/handlers/logfmt"
)

func fetchRandomQuote(l log.Interface) (err error) {
	url := "https://api.quotable.io/random"

    [highlight]
	defer l.Trace("fetching random quote").Stop(&err)
    [/highlight]

	_, err = http.Get(url)

    return
}

func main() {
	stdout := logfmt.New(os.Stdout)

	log.SetHandler(stdout)
	logger := log.WithFields(log.Fields{
		"app": "myapp",
		"env": "prod",
	})

	fetchRandomQuote(logger)
}