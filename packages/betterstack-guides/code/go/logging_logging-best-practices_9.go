# Source: https://betterstack.com/community/guides/logging/logging-best-practices/
# Original language: go
# Normalized: go
# Block index: 9

package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Login successful")
	})

	fmt.Println("Starting server at port 8080")

	log.Fatal(http.ListenAndServe(":8080", nil))
}