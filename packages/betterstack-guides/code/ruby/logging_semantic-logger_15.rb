# Source: https://betterstack.com/community/guides/logging/semantic-logger/
# Original language: ruby
# Normalized: ruby
# Block index: 15

SemanticLogger.default_level = ENV.fetch('LOG_LEVEL', 'info')
# or per logger
logger.level = ENV.fetch('LOG_LEVEL', 'info')