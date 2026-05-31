# Source: https://betterstack.com/community/guides/logging/how-to-view-and-configure-ruby-logs/
# Original language: ruby
# Normalized: ruby
# Block index: 27

require 'ougai'

logger = Ougai::Logger.new($stdout)

logger.info('Hello from Ougai logger')