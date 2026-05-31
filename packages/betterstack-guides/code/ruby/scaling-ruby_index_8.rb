# Source: https://betterstack.com/community/guides/scaling-ruby/index/
# Original language: ruby
# Normalized: ruby
# Block index: 8

class User < ActiveRecord::Base
  has_many :posts
  has_many :comments
end

class Post < ActiveRecord::Base
  belongs_to :user
  has_many :comments
end

# Access through methods
user = User.find(1)
user.posts.each { |post| puts post.title }

# Eager loading to avoid N+1
users = User.includes(:posts)
users.each { |u| puts u.posts.count }