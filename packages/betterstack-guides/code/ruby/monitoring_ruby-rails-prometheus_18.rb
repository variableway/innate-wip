# Source: https://betterstack.com/community/guides/monitoring/ruby-rails-prometheus/
# Original language: ruby
# Normalized: ruby
# Block index: 18

[label app/controllers/home_controller.rb]
class HomeController < ApplicationController
  def index
    # Random delay between 1 and 5 seconds
    sleep rand(1..5)
    render plain: 'Hello world!'
  end

  # metrics method stays the same
end