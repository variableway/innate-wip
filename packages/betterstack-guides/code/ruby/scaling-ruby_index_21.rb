# Source: https://betterstack.com/community/guides/scaling-ruby/index/
# Original language: ruby
# Normalized: ruby
# Block index: 21

# Intuitive for beginners
user = User.new(email: 'user@example.com')
user.save

# Natural method chaining
User.where(active: true).order(:created_at).first

# Familiar patterns from other ORMs
user.posts.create(title: 'Hello')