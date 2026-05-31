# Source: https://betterstack.com/community/guides/logging/how-to-view-and-configure-ruby-logs/
# Original language: ruby
# Normalized: ruby
# Block index: 25

logger.error(e.message + ' ' + e.backtrace.join(' '))