# Source: https://betterstack.com/community/guides/logging/semantic-logger/
# Original language: ruby
# Normalized: ruby
# Block index: 23

begin
  raise 'Something went wrong'
rescue StandardError => e
[highlight]
  logger.error('An error occurred', { request_id: 123 }, e)
[/highlight]
  # or
[highlight]
  logger.error('An error occurred', e)
[/highlight]
end