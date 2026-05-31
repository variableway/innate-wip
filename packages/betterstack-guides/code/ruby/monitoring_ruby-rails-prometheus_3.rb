# Source: https://betterstack.com/community/guides/monitoring/ruby-rails-prometheus/
# Original language: ruby
# Normalized: ruby
# Block index: 3

[label config/routes.rb]
Rails.application.routes.draw do
 root 'home#index'
 get '/metrics', to: 'home#metrics'
end