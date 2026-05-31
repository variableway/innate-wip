# Source: https://betterstack.com/community/guides/monitoring/ruby-rails-prometheus/
# Original language: ruby
# Normalized: ruby
# Block index: 27

[label app/controllers/posts_controller.rb]
require 'prometheus/client'
require 'net/http'
require 'json'

class PostsController < ApplicationController
  # Create a summary metric
  @@registry = Prometheus::Client.registry
  @@posts_latency_summary = @@registry.summary(
    :post_request_duration_seconds,
    docstring: 'Duration of requests to jsonplaceholder',
    labels: [:method]
  )

  def index
    start_time = Time.now

    begin
      uri = URI('https://jsonplaceholder.typicode.com/posts')
      response = Net::HTTP.get_response(uri)

      if response.is_a?(Net::HTTPSuccess)
        posts = JSON.parse(response.body)
      else
        posts = []
      end
    rescue => e
      render plain: e.message, status: 500
      return
    ensure
      # Record the request duration in the summary
      duration = Time.now - start_time
      @@posts_latency_summary.observe(duration, labels: { method: 'GET' })
    end

    render json: posts
  end
end