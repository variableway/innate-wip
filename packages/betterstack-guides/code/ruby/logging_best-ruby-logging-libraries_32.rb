# Source: https://betterstack.com/community/guides/logging/best-ruby-logging-libraries/
# Original language: ruby
# Normalized: ruby
# Block index: 32

require 'ougai'

logger = Ougai::Logger.new($stdout)
[highlight]
logger.formatter = Ougai::Formatters::Readable.new
[/highlight]
. . .