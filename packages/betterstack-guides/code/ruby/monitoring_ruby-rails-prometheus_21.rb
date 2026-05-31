# Source: https://betterstack.com/community/guides/monitoring/ruby-rails-prometheus/
# Original language: ruby
# Normalized: ruby
# Block index: 21

[label lib/prometheus/memory_collector.rb]
require 'prometheus/client'
require 'socket'

module Prometheus
  class MemoryCollector
    def initialize(registry = Prometheus::Client.registry)
      @registry = registry

      # Define a Gauge metric for tracking memory usage
      @memory_usage_gauge = @registry.gauge(
        :memory_usage_bytes,
        docstring: 'Current memory usage of the service in bytes',
        labels: [:hostname]
      )

      Thread.new do
        collect_memory_metrics
      end
    end

    private

    def collect_memory_metrics
      while true
        # Get memory usage in bytes (using GetProcessMem gem or similar)
        memory = get_memory_usage() * 1024
        @memory_usage_gauge.set(
          memory,
          labels: { hostname: Socket.gethostname }
        )
        sleep 1
      end
    end

    def get_memory_usage
      # On Linux, read from /proc/self/status
      if File.exist?('/proc/self/status')
        File.open('/proc/self/status') do |file|
          file.each_line do |line|
            if line.start_with?('VmRSS:')
              return line.split[1].to_i
            end
          end
        end
      end

      # Fallback: return 0
      0
    end
  end
end