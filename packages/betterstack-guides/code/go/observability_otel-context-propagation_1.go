# Source: https://betterstack.com/community/guides/observability/otel-context-propagation/
# Original language: go
# Normalized: go
# Block index: 1

package main

import (
	"context"
	"log"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/propagation"
	"go.opentelemetry.io/otel/trace"
)

func main() {
	// Initialize propagator for trace context
	propagator := otel.GetTextMapPropagator()

	// Receive message from Kafka
	message := receiveFromKafka()

	// Extract context from headers
	headers := propagation.MapCarrier(message["headers"].(map[string]string))
	ctx := propagator.Extract(context.Background(), headers)

	// Retrieve the span from the extracted context (optional)
	span := trace.SpanFromContext(ctx)
	if span.SpanContext().IsValid() {
		log.Println("Span successfully extracted from context")
	} else {
		log.Println("No valid span found in the context")
	}

	// Set the context for the processing logic
	// (if needed, you could start a new span here)
	processRequest(message)
}