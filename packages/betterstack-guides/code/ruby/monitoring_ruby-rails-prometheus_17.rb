# Source: https://betterstack.com/community/guides/monitoring/ruby-rails-prometheus/
# Original language: ruby
# Normalized: ruby
# Block index: 17

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

        # Define a Gauge metric for tracking active HTTP requests
        @active_requests_gauge = @registry.gauge(
          :http_active_requests,
          docstring: 'Number of active connections to the service'
        )
      end

      def call(env)
        # Track start of request processing
        @active_requests_gauge.increment

        # Process the request
        response = @app.call(env)

        # Record the request
        record_request(env, response)

        # Track end of request processing
        @active_requests_gauge.decrement

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