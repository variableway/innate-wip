# Source: https://betterstack.com/community/guides/logging/best-ruby-logging-libraries/
# Original language: ruby
# Normalized: ruby
# Block index: 10

require 'semantic_logger'
SemanticLogger.add_appender(io: $stdout)
logger = SemanticLogger['MyApp']

logger.trace('entered main function')
logger.debug('database query executed')
logger.info('server started on port 8080')
logger.warn('disk space is 95% full')
logger.error('encountered an unexpected error while backing up database')
logger.fatal('application crashed')