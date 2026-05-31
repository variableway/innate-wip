# Source: https://betterstack.com/community/guides/logging/best-ruby-logging-libraries/
# Original language: ruby
# Normalized: ruby
# Block index: 9

# retain a maximum of five 10-megabyte files
Logger.new('app.log', 5, 10 * 1024 * 1024)