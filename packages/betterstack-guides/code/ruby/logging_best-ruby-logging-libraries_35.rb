# Source: https://betterstack.com/community/guides/logging/best-ruby-logging-libraries/
# Original language: ruby
# Normalized: ruby
# Block index: 35

require 'logging'

logger = Logging.logger['example']
logger.add_appenders(Logging.appenders.stdout)
. . .