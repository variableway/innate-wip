# Source: https://betterstack.com/community/guides/logging/semantic-logger/
# Original language: ruby
# Normalized: ruby
# Block index: 18

[highlight]
SemanticLogger.add_appender(io: $stdout, formatter: :json)
[/highlight]

logger.info('User signed in')