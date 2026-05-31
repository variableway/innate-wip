# Source: https://betterstack.com/community/guides/logging/how-to-view-and-configure-ruby-logs/
# Original language: ruby
# Normalized: ruby
# Block index: 37

SemanticLogger.add_appender(io: $stdout, formatter: :json)