# Source: https://betterstack.com/community/guides/monitoring/ruby-rails-prometheus/
# Original language: ruby
# Normalized: ruby
# Block index: 23

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

        # Define a Histogram metric for request duration
        @latency_histogram = @registry.histogram(
          :http_request_duration_seconds,
          docstring: 'Duration of HTTP requests',
          labels: [:status, :path, :method]
        )
      end

      def call(env)
        start_time = Time.now

        # Track start of request processing
        @active_requests_gauge.increment

        # Process the request
        response = @app.call(env)

        # Calculate request duration
        duration = Time.now - start_time

        # Record the request
        record_request(env, response, duration)

        # Track end of request processing
        @active_requests_gauge.decrement

        # Return the response
        response
      end

      private

      def record_request(env, response, duration)
        status = response.first.to_s
        path = env['PATH_INFO']
        method = env['REQUEST_METHOD']

        @http_requests_total.increment(labels: { status: status, path: path, method: method })
        @latency_histogram.observe(
          duration,
          labels: { status: status, path: path, method: method }
        )
      end
    end
  end
end