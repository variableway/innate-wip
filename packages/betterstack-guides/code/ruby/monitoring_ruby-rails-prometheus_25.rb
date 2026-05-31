# Source: https://betterstack.com/community/guides/monitoring/ruby-rails-prometheus/
# Original language: ruby
# Normalized: ruby
# Block index: 25

@latency_histogram = @registry.histogram(
  :http_request_duration_seconds,
  docstring: 'Duration of HTTP requests',
  labels: [:status, :path, :method],
  buckets: [0.1, 0.5, 1, 2.5, 5, 10]  # Custom buckets in seconds
)