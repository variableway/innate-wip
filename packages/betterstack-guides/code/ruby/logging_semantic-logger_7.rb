# Source: https://betterstack.com/community/guides/logging/semantic-logger/
# Original language: ruby
# Normalized: ruby
# Block index: 7

require 'semantic_logger'

# Set the default appender to STDOUT
SemanticLogger.add_appender(io: $stdout)

logger = SemanticLogger['MyApp']
logger.info('Application started')
logger.error('An error occurred')