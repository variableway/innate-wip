# Source: https://betterstack.com/community/guides/logging/best-ruby-logging-libraries/
# Original language: ruby
# Normalized: ruby
# Block index: 40

logger.add_appenders(Logging.appenders.stdout(level: :info, layout: Logging.layouts.json))