# Source: https://betterstack.com/community/guides/observability/opentelemetry-go/
# Original language: go
# Normalized: go
# Block index: 24

[label redisconn/redis.go]
package redisconn

import (
	"context"
	"log/slog"
	"time"

    [highlight]
	"github.com/redis/go-redis/extra/redisotel/v9"
    [/highlight]
	redis "github.com/redis/go-redis/v9"
)

. . .

func NewRedisConn(ctx context.Context, addr string) (*RedisConn, error) {
	r := redis.NewClient(&redis.Options{
		Addr: addr,
		DB:   0,
	})

	err := r.Ping(ctx).Err()
	if err != nil {
		return nil, err
	}

	slog.DebugContext(ctx, "redis connection is successful")

    [highlight]
	if err := redisotel.InstrumentTracing(r); err != nil {
		return nil, err
	}
    [/highlight]

	return &RedisConn{
		client: r,
	}, nil
}