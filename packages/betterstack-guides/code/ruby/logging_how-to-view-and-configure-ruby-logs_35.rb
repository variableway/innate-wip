# Source: https://betterstack.com/community/guides/logging/how-to-view-and-configure-ruby-logs/
# Original language: ruby
# Normalized: ruby
# Block index: 35

require 'semantic_logger'
SemanticLogger.add_appender(io: $stdout)
logger = SemanticLogger['MyApp']
logger.info('Hello from semantic logger')