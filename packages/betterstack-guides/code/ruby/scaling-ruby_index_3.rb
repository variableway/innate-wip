# Source: https://betterstack.com/community/guides/scaling-ruby/index/
# Original language: ruby
# Normalized: ruby
# Block index: 3

require 'rom'

config = ROM::Configuration.new(:sql, 'postgresql://localhost/myapp')

class Users < ROM::Relation[:sql]
  schema(:users, infer: true)
end

class UserRepository < ROM::Repository[:users]
  commands :create
end

container = ROM.container(config)
user_repo = UserRepository.new(container)
user = user_repo.create(email: 'user@example.com')