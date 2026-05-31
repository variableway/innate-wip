# Source: https://betterstack.com/community/guides/monitoring/ruby-rails-prometheus/
# Original language: ruby
# Normalized: ruby
# Block index: 15

[label config/initializers/prometheus.rb]
require 'prometheus/middleware/collector'

Rails.application.middleware.use Prometheus::Middleware::Collector