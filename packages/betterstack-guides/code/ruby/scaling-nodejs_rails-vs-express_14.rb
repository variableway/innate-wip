# Source: https://betterstack.com/community/guides/scaling-nodejs/rails-vs-express/
# Original language: ruby
# Normalized: ruby
# Block index: 14

# Gemfile - use established authentication gem
gem 'devise'

# Generate authentication
rails generate devise:install
rails generate devise User
rails db:migrate

# Controllers get authentication for free
class ProductsController < ApplicationController
  before_action :authenticate_user!
  before_action :authorize_admin!, only: [:create, :update, :destroy]
  
  private
  
  def authorize_admin!
    redirect_to root_path unless current_user.admin?
  end
end

# Views have authentication helpers
<% if user_signed_in? %>
  <p>Welcome, <%= current_user.email %>!</p>
  <%= link_to 'Sign out', destroy_user_session_path, method: :delete %>
<% else %>
  <%= link_to 'Sign in', new_user_session_path %>
<% end %>