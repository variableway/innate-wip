# Source: https://betterstack.com/community/guides/observability/opentelemetry-go/
# Original language: go
# Normalized: go
# Block index: 27

[label main.go]
package main

import (
	. . .
    [highlight]
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/trace"
    [/highlight]
)

var redisConn *redisconn.RedisConn

var dbConn *db.DBConn

[highlight]
var tracer trace.Tracer
[/highlight]

. . .

func init() {
	. . .

    [highlight]
	tracer = otel.Tracer(conf.ServiceName)
    [/highlight]
}

. . .