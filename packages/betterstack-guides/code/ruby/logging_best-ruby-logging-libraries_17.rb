# Source: https://betterstack.com/community/guides/logging/best-ruby-logging-libraries/
# Original language: ruby
# Normalized: ruby
# Block index: 17

SemanticLogger.add_appender(io: $stdout, formatter: :color)
SemanticLogger.add_appender(file_name: 'app.log', formatter: :json)