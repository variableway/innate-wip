# Source: https://betterstack.com/community/guides/logging/best-golang-logging-libraries/
# Original language: go
# Normalized: go
# Block index: 14

package main

import (
	"os"
	"time"

	"github.com/phuslu/log"
)

func main() {
	log.Info().Msg("Hello from Phuslu logger")
}