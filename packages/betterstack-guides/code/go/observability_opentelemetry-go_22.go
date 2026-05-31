# Source: https://betterstack.com/community/guides/observability/opentelemetry-go/
# Original language: go
# Normalized: go
# Block index: 22

[label github.go]
package main

import (
	"context"
	"net/http"
	"time"

	"github.com/go-resty/resty/v2"
    [highlight]
	"go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp"
    [/highlight]
)

var httpClient = &http.Client{
	Timeout:   2 * time.Minute,
    [highlight]
	Transport: otelhttp.NewTransport(http.DefaultTransport),
    [/highlight]
}

. . .