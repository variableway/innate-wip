# Source: https://betterstack.com/community/guides/scaling-ruby/index/
# Original language: ruby
# Normalized: ruby
# Block index: 6

User.where(active: true)
User.where('created_at > ?', 1.week.ago).order(created_at: :desc)

# Scopes for reusable queries
class User < ActiveRecord::Base
  scope :active, -> { where(active: true) }
  scope :recent, -> { where('created_at > ?', 1.week.ago) }
end

User.active.recent