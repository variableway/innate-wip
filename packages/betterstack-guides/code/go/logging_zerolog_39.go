# Source: https://betterstack.com/community/guides/logging/zerolog/
# Original language: go
# Normalized: go
# Block index: 39

package main

import (
	"context"
	"os"
	"time"

	"github.com/nikoksr/notify"
	"github.com/nikoksr/notify/service/telegram"
	"github.com/rs/zerolog"
)

var wg sync.WaitGroup

type TelegramHook struct{}

func (t *TelegramHook) Run(
	e *zerolog.Event,
	level zerolog.Level,
	message string,
) {
	if level > zerolog.WarnLevel {
		wg.Add(1)
		go func() {
			_ = notifyTelegram("", message)
			wg.Done()
		}()
	}
}

func notifyTelegram(title, msg string) error {
  [highlight]
	telegramService, err := telegram.New(
		"<telegram bot token>",
	)
  [/highlight]
	if err != nil {
		return err
	}

  [highlight]
	telegramService.AddReceivers("<chat id>")
  [/highlight]

	notifier := notify.New()

	notifier.UseServices(telegramService)

	ctx, cancel := context.WithTimeout(
		context.Background(),
		30*time.Second,
	)

	defer cancel()

	return notifier.Send(ctx, title, msg)
}

func main() {
	logger := zerolog.New(os.Stdout).
		Level(zerolog.TraceLevel).
		With().
		Timestamp().
		Logger()

	logger = logger.Hook(&TelegramHook{})

	logger.Trace().Msg("trace message")
	logger.Debug().Msg("debug message")
	logger.Info().Msg("info message")
	logger.Warn().Msg("warn message")
	logger.Error().Msg("error message")
	logger.WithLevel(zerolog.FatalLevel).Msg("fatal message")
	logger.WithLevel(zerolog.PanicLevel).Msg("panic message")

	wg.Wait()
}