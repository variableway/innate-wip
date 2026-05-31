# Source: https://betterstack.com/community/guides/logging/logging-best-practices/
# Original language: go
# Normalized: go
# Block index: 5

func main() {
    log := zerolog.New(os.Stdout).
        With().
        Timestamp().
        Logger().
[highlight]
    Sample(&zerolog.BasicSampler{N: 5})
[/highlight]

    for i := 1; i <= 10; i++ {
        log.Info().Msg("a log message: %d", i)
    }
}