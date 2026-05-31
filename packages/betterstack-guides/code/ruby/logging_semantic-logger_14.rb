# Source: https://betterstack.com/community/guides/logging/semantic-logger/
# Original language: ruby
# Normalized: ruby
# Block index: 14

class Device
  include SemanticLogger::Loggable

[highlight]
  logger.level = :error
[/highlight]
end