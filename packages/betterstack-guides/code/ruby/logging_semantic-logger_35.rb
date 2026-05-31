# Source: https://betterstack.com/community/guides/logging/semantic-logger/
# Original language: ruby
# Normalized: ruby
# Block index: 35

logger.measure_info 'called external API', metric: 'ExternalAPI/request_time' do
  # call external API
end