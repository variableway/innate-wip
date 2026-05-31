# Source: https://betterstack.com/community/guides/scaling-ruby/index/
# Original language: ruby
# Normalized: ruby
# Block index: 1

require 'active_record'

ActiveRecord::Base.establish_connection(
  adapter: 'postgresql',
  database: 'myapp_development'
)

class User < ActiveRecord::Base
end

user = User.create(email: 'user@example.com')