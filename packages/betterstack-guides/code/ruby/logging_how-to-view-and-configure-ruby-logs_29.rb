# Source: https://betterstack.com/community/guides/logging/how-to-view-and-configure-ruby-logs/
# Original language: ruby
# Normalized: ruby
# Block index: 29

logger.debug('Calling external API at example.com', {
  api_url: 'https://api.example.com/products',
  request_body: {
    id: 42
  }
})