# Source: https://betterstack.com/community/guides/scaling-ruby/index/
# Original language: ruby
# Normalized: ruby
# Block index: 14

class Users < ROM::Relation[:sql]
  schema(:users, infer: true) do
    attribute :id, Types::Serial
    attribute :email, Types::String
    attribute :username, Types::String
  end
end