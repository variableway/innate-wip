# Source: https://betterstack.com/community/guides/logging/best-ruby-logging-libraries/
# Original language: ruby
# Normalized: ruby
# Block index: 43

require 'yell'

logger = Yell.new($stdout)

logger.debug('database query executed')
logger.info('user signed in')
logger.warn('disk space is 95% full')
logger.error('encountered an unexpected error while backing up database')
logger.fatal('application crashed')