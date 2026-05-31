# Source: https://betterstack.com/community/guides/monitoring/ruby-rails-prometheus/
# Original language: ruby
# Normalized: ruby
# Block index: 28

[label config/routes.rb]
Rails.application.routes.draw do
  root 'home#index'
  get '/metrics', to: 'home#metrics'
  get '/posts', to: 'posts#index'
end