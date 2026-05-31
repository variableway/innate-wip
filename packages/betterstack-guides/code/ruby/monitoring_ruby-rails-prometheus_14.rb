# Source: https://betterstack.com/community/guides/monitoring/ruby-rails-prometheus/
# Original language: ruby
# Normalized: ruby
# Block index: 14

[label lib/prometheus/middleware/collector.rb]
require 'prometheus/client'

module Prometheus
  module Middleware
    class Collector
      def initialize(app, registry = Prometheus::Client.registry)
        @app = app
        @registry = registry

        # Create a counter metric
        @http_requests_total = @registry.counter(
          :http_requests_total,
          docstring: 'Total number of HTTP requests received',
          labels: [:status, :path, :method]
        )
      end

      def call(env)
        # Process the request
        response = @app.call(env)

        # Record the request
        record_request(env, response)

        # Return the response
        response
      end

      private

      def record_request(env, response)
        status = response.first.to_s
        path = env['PATH_INFO']
        method = env['REQUEST_METHOD']

        @http_requests_total.increment(labels: { status: status, path: path, method: method })
      end
    end
  end
end