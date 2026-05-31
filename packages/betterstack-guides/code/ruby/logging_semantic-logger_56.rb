# Source: https://betterstack.com/community/guides/logging/semantic-logger/
# Original language: ruby
# Normalized: ruby
# Block index: 56

config.semantic_logger.add_appender(
  appender: :http,
  url:      "https://in.logs.betterstack.com",
  formatter: :json,
  header: {"Authorization" => "Bearer <token>"}
)