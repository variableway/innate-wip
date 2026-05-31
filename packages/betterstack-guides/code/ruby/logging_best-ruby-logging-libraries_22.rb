# Source: https://betterstack.com/community/guides/logging/best-ruby-logging-libraries/
# Original language: ruby
# Normalized: ruby
# Block index: 22

logger.measure_debug 'request a random quote' do
  response = HTTP.get('https://api.quotable.io/quotes/random?tags=history%7Ccivil-rights')
  p response.parse
end