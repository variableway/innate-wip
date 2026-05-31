# Source: https://betterstack.com/community/guides/logging/zap/
# Original language: go
# Normalized: go
# Block index: 7

package main

import (
	"go.uber.org/zap"
)

func init() {
	zap.ReplaceGlobals(zap.Must(zap.NewProduction()))
}

func main() {
	zap.L().Info("Hello from Zap!")
}