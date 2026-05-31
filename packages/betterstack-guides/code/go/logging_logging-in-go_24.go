# Source: https://betterstack.com/community/guides/logging/logging-in-go/
# Original language: go
# Normalized: go
# Block index: 24

handler := slog.NewJSONHandler(os.Stdout, nil)
[highlight]
buildInfo, _ := debug.ReadBuildInfo()
logger := slog.New(handler).WithGroup("program_info")
[/highlight]

child := logger.With(
  slog.Int("pid", os.Getpid()),
  slog.String("go_version", buildInfo.GoVersion),
)

child.Warn(
  "storage is 90% full",
  slog.String("available_space", "900.1 MB"),
)