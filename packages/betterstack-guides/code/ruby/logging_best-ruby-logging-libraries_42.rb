# Source: https://betterstack.com/community/guides/logging/best-ruby-logging-libraries/
# Original language: ruby
# Normalized: ruby
# Block index: 42

require 'logging'

Logging.color_scheme('bright',
                     levels: {
                       info: :green,
                       warn: :yellow,
                       error: :red,
                       fatal: %i[white on_red]
                     },
                     date: :blue,
                     logger: :cyan,
                     message: :magenta)

logger = Logging.logger['example']

logger.add_appenders(
  Logging.appenders.stdout(
    layout: Logging.layouts.pattern(
      pattern: '[%d] %-5l %c: %m\n',
      color_scheme: 'bright'
    )
  ),
  Logging.appenders.rolling_file(
    'app.log',
    age: 'daily',
    layout: Logging.layouts.json
  )
)
. . .