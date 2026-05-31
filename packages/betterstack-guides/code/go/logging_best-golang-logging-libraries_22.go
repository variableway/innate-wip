# Source: https://betterstack.com/community/guides/logging/best-golang-logging-libraries/
# Original language: go
# Normalized: go
# Block index: 22

package main

import (
	log "github.com/inconshreveable/log15"
)

func main() {
	log.Info("Hello from Log15", "name", "John", "age", 20)
}