# Source: https://betterstack.com/community/guides/observability/opentelemetry-go/
# Original language: go
# Normalized: go
# Block index: 26

[label db/db.go]
package db

import (
	"context"
	"database/sql"
	"errors"

	"github.com/betterstack-community/go-image-upload/models"
	"github.com/uptrace/bun"
	"github.com/uptrace/bun/dialect/pgdialect"
	"github.com/uptrace/bun/driver/pgdriver"
    [highlight]
	"github.com/uptrace/bun/extra/bunotel"
    [/highlight]
)

type DBConn struct {
	db *bun.DB
}

func NewDBConn(ctx context.Context, name, url string) (*DBConn, error) {
	sqldb := sql.OpenDB(pgdriver.NewConnector(pgdriver.WithDSN(url)))

	db := bun.NewDB(sqldb, pgdialect.New())
    [highlight]
	db.AddQueryHook(
		bunotel.NewQueryHook(bunotel.WithDBName(name)),
	)
    [/highlight]
	return &DBConn{db}, nil
}
. . .