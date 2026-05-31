# Source: https://betterstack.com/community/guides/logging/how-to-view-and-configure-ruby-logs/
# Original language: ruby
# Normalized: ruby
# Block index: 39

require 'semantic_logger'
SemanticLogger.add_appender(file_name: 'logs/development.log', formatter: :json)
SemanticLogger.add_appender(io: $stdout, formatter: :color)

logger = SemanticLogger['MyApp']
logger.info('Hello from semantic logger')