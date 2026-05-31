# Source: https://betterstack.com/community/guides/monitoring/prometheus-golang/
# Original language: go
# Normalized: go
# Block index: 24

[label main.go]
package main

import (
	"io"
	"log"
	"math/rand"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/joho/godotenv"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

. . .

[highlight]
var postsLatencySummary = prometheus.NewSummary(prometheus.SummaryOpts{
	Name: "post_request_duration_seconds",
	Help: "Duration of requests to https://jsonplaceholder.typicode.com/posts",
	Objectives: map[float64]float64{
		0.5:  0.05,  // Median (50th percentile) with a 5% tolerance
		0.9:  0.01,  // 90th percentile with a 1% tolerance
		0.99: 0.001, // 99th percentile with a 0.1% tolerance
	},
})
[/highlight]

. . .

func main() {
. . .

[highlight]
	reg.MustRegister(postsLatencySummary)
[/highlight]

	handler := promhttp.HandlerFor(
		reg,
		promhttp.HandlerOpts{})

	mux.Handle("/metrics", handler)

[highlight]
	mux.HandleFunc("/posts", func(w http.ResponseWriter, r *http.Request) {
		url := "https://jsonplaceholder.typicode.com/posts"

		now := time.Now()

		resp, err := http.Get(url)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		postsLatencySummary.Observe(time.Since(now).Seconds())

		defer resp.Body.Close()

		if resp.StatusCode != http.StatusOK {
			http.Error(w, "request failed", resp.StatusCode)
			return
		}

		body, err := io.ReadAll(resp.Body)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}

		w.Header().Set("Content-Type", "application/json")
		w.Write(body)
	})
[/highlight]

	. . .
}