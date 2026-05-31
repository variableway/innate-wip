# Source: https://betterstack.com/community/guides/scaling-ruby/index/
# Original language: ruby
# Normalized: ruby
# Block index: 5

# Relation: defines database queries
class Users < ROM::Relation[:sql]
  schema(:users, infer: true) do
    associations do
      has_many :posts
    end
  end
end

# Repository: handles data access
class UserRepository < ROM::Repository[:users]
  commands :create
  struct_namespace Entities
  
  def find_by_email(email)
    users.where(email: email).one
  end
end

# Domain entity: pure Ruby object
module Entities
  class User < ROM::Struct
    def full_name
      "#{first_name} #{last_name}"
    end
  end
end

# Validation: separate from persistence
class UserValidator < Dry::Validation::Contract
  params do
    required(:email).filled(:string)
    required(:username).filled(:string)
  end
end

# Usage separates concerns
user_repo = UserRepository.new(container)
result = user_repo.create(email: 'user@example.com', username: 'johndoe')