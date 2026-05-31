# Source: https://betterstack.com/community/guides/logging/best-ruby-logging-libraries/
# Original language: ruby
# Normalized: ruby
# Block index: 33

require 'logging'

logger = Logging.logger($stdout)

logger.debug('database query executed')
logger.info('user signed in')
logger.warn('disk space is 95% full')
logger.error('encountered an unexpected error while backing up database')
logger.fatal('application crashed')