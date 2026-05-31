# Source: https://betterstack.com/community/guides/logging/logging-in-go/
# Original language: go
# Normalized: go
# Block index: 42

type Handler interface {
	Enabled(context.Context, Level) bool
	Handle(context.Context, r Record) error
	WithAttrs(attrs []Attr) Handler
	WithGroup(name string) Handler
}