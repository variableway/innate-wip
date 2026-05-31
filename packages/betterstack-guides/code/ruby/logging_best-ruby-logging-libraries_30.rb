# Source: https://betterstack.com/community/guides/logging/best-ruby-logging-libraries/
# Original language: ruby
# Normalized: ruby
# Block index: 30

require 'ougai'

logger = Ougai::Logger.new($stdout)
logger.level = Ougai::Logger::TRACE

logger.with_fields = { app_version: 'v1.2.3' }

child_logger = logger.child({ user_id: 123_456, username: 'johndoe' })

child_logger.debug('user signed in')
child_logger.debug('user opened document', doc_id: 'xyz')
child_logger.debug('user signed out')