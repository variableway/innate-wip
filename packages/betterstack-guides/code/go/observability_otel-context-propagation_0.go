# Source: https://betterstack.com/community/guides/observability/otel-context-propagation/
# Original language: go
# Normalized: go
# Block index: 0

package main

import (
        "context"

        "go.opentelemetry.io/otel"
        "go.opentelemetry.io/otel/propagation"
        "go.opentelemetry.io/otel/trace"
)

func main() {
        // Assuming you have a tracer already set up
        tracer := otel.Tracer("your-service-name")

        // Start a new span
        ctx, span := tracer.Start(context.Background(), "My Operation")
        defer span.End()

        // Create a custom message
        message := map[string]interface{}{
                "payload": "Request data",
        }

        // Inject the current span context into the message headers
        propagator := propagation.TraceContext{}
        propagator.Inject(context.Background(), message, propagation.HeaderCarrier(message))

        // Send the message (using Kafka, for example)
        // ...
}