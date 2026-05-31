# Source: https://betterstack.com/community/guides/logging/how-to-view-and-configure-ruby-logs/
# Original language: ruby
# Normalized: ruby
# Block index: 22

begin
  result = 1 / 0
rescue StandardError => e
  logger.error(e)
end