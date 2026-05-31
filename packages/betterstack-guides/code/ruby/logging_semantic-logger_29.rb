# Source: https://betterstack.com/community/guides/logging/semantic-logger/
# Original language: ruby
# Normalized: ruby
# Block index: 29

SemanticLogger.add_appender(io: $stdout, formatter: :color)
SemanticLogger.add_appender(file_name: 'application.log', formatter: :json, level: :error)