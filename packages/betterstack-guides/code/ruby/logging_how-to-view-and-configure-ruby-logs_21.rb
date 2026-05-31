# Source: https://betterstack.com/community/guides/logging/how-to-view-and-configure-ruby-logs/
# Original language: ruby
# Normalized: ruby
# Block index: 21

Logger.new('app.log', 3, 10 * 1024 * 1024) # retain 3 10-megabyte files