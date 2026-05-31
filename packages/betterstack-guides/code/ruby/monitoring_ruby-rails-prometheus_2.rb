# Source: https://betterstack.com/community/guides/monitoring/ruby-rails-prometheus/
# Original language: ruby
# Normalized: ruby
# Block index: 2

[label app/controllers/home_controller.rb]
class HomeController < ApplicationController
 def index
   render plain: 'Hello world!'
 end

 def metrics
   render plain: '', status: 200
 end
end