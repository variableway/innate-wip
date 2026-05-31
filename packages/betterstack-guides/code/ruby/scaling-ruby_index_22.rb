# Source: https://betterstack.com/community/guides/scaling-ruby/index/
# Original language: ruby
# Normalized: ruby
# Block index: 22

# Requires grasping relations, repositories, and entities
class Users < ROM::Relation[:sql]  # What's a relation?
  schema(:users, infer: true)      # Schema definition
end

class UserRepository < ROM::Repository[:users]  # Repository pattern
  commands :create                               # Command objects
  
  struct_namespace Entities  # Custom struct namespace
end

# Different mental model
user_repo.create(email: 'user@example.com')  # Repository, not model