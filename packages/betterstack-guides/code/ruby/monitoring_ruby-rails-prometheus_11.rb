# Source: https://betterstack.com/community/guides/monitoring/ruby-rails-prometheus/
# Original language: ruby
# Normalized: ruby
# Block index: 11

[label app/controllers/home_controller.rb]
require 'prometheus/client'
require 'prometheus/client/formats/text'

class HomeController < ApplicationController
  def index
    render plain: 'Hello world!'
  end

  def metrics
    content_type = Prometheus::Client::Formats::Text::CONTENT_TYPE
    render plain: Prometheus::Client::Formats::Text.marshal(Prometheus::Client.registry),
           content_type: content_type
  end
end