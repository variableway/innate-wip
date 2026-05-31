# Source: https://betterstack.com/community/guides/monitoring/prometheus-golang/
# Original language: go
# Normalized: go
# Block index: 10

[label main.go]
package main

import (
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
    [highlight]
	"github.com/prometheus/client_golang/prometheus/promhttp"
    [/highlight]
)

func init() {
	_ = godotenv.Load()
}

func main() {
	mux := http.NewServeMux()

    [highlight]
	mux.Handle("/metrics", promhttp.Handler())
    [/highlight]

    . . .
}