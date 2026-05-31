# Source: https://betterstack.com/community/guides/logging/how-to-view-and-configure-ruby-logs/
# Original language: ruby
# Normalized: ruby
# Block index: 8

require 'logger'

logger = Logger.new($stdout)

[highlight]
log_level = ENV.fetch('RUBY_LOG_LEVEL', 'INFO')
logger.level = Logger.const_get(log_level)
[/highlight]