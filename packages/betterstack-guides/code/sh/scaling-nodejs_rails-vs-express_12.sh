# Source: https://betterstack.com/community/guides/scaling-nodejs/rails-vs-express/
# Original language: bash
# Normalized: sh
# Block index: 12

# Rails provides built-in development tools
rails generate model Order user:references total:decimal
rails generate controller Orders index show create
rails generate migration AddStatusToOrders status:string

# Built-in console for debugging and testing
rails console
> Product.expensive.recent.count
> User.find_by(email: 'test@example.com').orders

# Integrated testing framework
rails test
rails test:models
rails test:controllers

# Asset pipeline and deployment helpers
rails assets:precompile
rails db:setup