# Source: https://betterstack.com/community/guides/logging/best-ruby-logging-libraries/
# Original language: ruby
# Normalized: ruby
# Block index: 12

require 'semantic_logger'
[highlight]
SemanticLogger.default_level = :trace
[/highlight]
SemanticLogger.add_appender(io: $stdout)
. . .