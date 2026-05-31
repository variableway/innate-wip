# Source: https://betterstack.com/community/guides/monitoring/ruby-rails-prometheus/
# Original language: ruby
# Normalized: ruby
# Block index: 22

[label config/initializers/prometheus.rb]
require 'prometheus/middleware/collector'
require 'prometheus/memory_collector'

Rails.application.middleware.use Prometheus::Middleware::Collector
Prometheus::MemoryCollector.new