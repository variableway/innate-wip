# Source: https://betterstack.com/community/guides/scaling-nodejs/rails-vs-express/
# Original language: bash
# Normalized: sh
# Block index: 0

# Install Rails and create new application
gem install rails
rails new ecommerce_app --database=postgresql
cd ecommerce_app

# Generate a complete model, view, controller
rails generate scaffold Product name:string price:decimal description:text
rails db:migrate

# Start the development server
rails server